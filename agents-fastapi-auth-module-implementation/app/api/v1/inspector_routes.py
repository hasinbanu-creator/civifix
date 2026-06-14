"""Inspector API routes"""
from fastapi import APIRouter, Depends, status, HTTPException, Query
from typing import Dict, Any
from bson import ObjectId
from datetime import datetime
import logging
import random

from app.core.response import ResponseHandler
from app.dependencies.auth_dependency import get_current_user
from app.dependencies.role_dependency import require_role
from app.db.mongodb import db

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/complaints",
    summary="Get ward complaints",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def get_ward_complaints(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: str = Query(None),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get complaints for inspector's ward"""
    try:
        # Get inspector's ward
        ward = await db.wards.find_one({
            "inspector_id": ObjectId(current_user["user_id"]),
            "is_active": True
        })

        if not ward:
            return ResponseHandler.error(
                message="Inspector not assigned to any ward",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        query = {
            "ward_id": ward["_id"]
        }
        if status:
            query["status"] = status

        skip = (page - 1) * limit
        complaints = await db.complaints.find(query)\
            .skip(skip)\
            .limit(limit)\
            .to_list(length=limit)

        total = await db.complaints.count_documents(query)

        result = []
        for complaint in complaints:
            result.append({
                "_id": str(complaint["_id"]),
                "complaint_id": complaint.get("complaint_id"),
                "title": complaint.get("title"),
                "description": complaint.get("description"),
                "status": complaint.get("status"),
                "location": complaint.get("location"),
                "created_at": complaint.get("created_at").isoformat() if complaint.get("created_at") else None,
                "updated_at": complaint.get("updated_at").isoformat() if complaint.get("updated_at") else None
            })

        return ResponseHandler.success(
            message="Complaints retrieved",
            data={
                "complaints": result,
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        )
    except Exception as e:
        logger.error(f"Error fetching ward complaints: {str(e)}")
        return ResponseHandler.error(
            message="Failed to retrieve complaints",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.get(
    "/workers",
    summary="Get ward workers",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def get_ward_workers(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get workers assigned to inspector's ward"""
    try:
        # Get inspector's ward
        inspector = await db.users.find_one({"_id": ObjectId(current_user["user_id"])})

        if not inspector or not inspector.get("ward_id"):
            return ResponseHandler.error(
                message="Inspector not assigned to any ward",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        workers = await db.users.find({
            "ward_id": ObjectId(inspector["ward_id"]),
            "role": "WORKER"
        }).to_list(length=1000)

        result = []
        for worker in workers:
            # Count active complaints for this worker
            active_tasks = await db.complaints.count_documents({
                "assigned_to": ObjectId(worker["_id"]),
                "status": {"$in": ["PENDING", "IN_PROGRESS"]}
            })

            result.append({
                "_id": str(worker["_id"]),
                "name": worker.get("name"),
                "email": worker.get("email"),
                "active_tasks": active_tasks,
                "status": worker.get("status", "ACTIVE")
            })

        return ResponseHandler.success(
            message="Workers retrieved",
            data=result
        )
    except Exception as e:
        logger.error(f"Error fetching ward workers: {str(e)}")
        return ResponseHandler.error(
            message="Failed to retrieve workers",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.put(
    "/complaints/{complaint_id}/start-work",
    summary="Start work on a complaint",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def start_work(
    complaint_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Move complaint from OPEN to IN_PROGRESS and auto-assign a random worker"""
    try:
        complaint = await db.complaints.find_one({"_id": ObjectId(complaint_id)})
        if not complaint:
            return ResponseHandler.error(
                message="Complaint not found",
                status_code=status.HTTP_404_NOT_FOUND
            )

        if complaint.get("status") != "OPEN":
            return ResponseHandler.error(
                message="Only OPEN complaints can be started",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Find the inspector's ward
        ward = await db.wards.find_one({
            "inspector_id": ObjectId(current_user["user_id"]),
            "is_active": True
        })

        # Randomly assign a worker from the ward if any exist
        assigned_worker_id = None
        if ward:
            workers = await db.users.find({
                "ward_id": ward["_id"],
                "role": "WORKER"
            }).to_list(length=1000)
            if workers:
                selected = random.choice(workers)
                assigned_worker_id = selected["_id"]

        update_fields: Dict[str, Any] = {
            "status": "IN_PROGRESS",
            "updated_at": datetime.utcnow()
        }
        if assigned_worker_id:
            update_fields["worker_id"] = assigned_worker_id

        await db.complaints.update_one(
            {"_id": ObjectId(complaint_id)},
            {"$set": update_fields}
        )

        await db.complaint_history.insert_one({
            "complaint_id": ObjectId(complaint_id),
            "action": "STATUS_CHANGED",
            "old_status": "OPEN",
            "new_status": "IN_PROGRESS",
            "performed_by": ObjectId(current_user["user_id"]),
            "role": "INSPECTOR",
            "remarks": "Work started by inspector",
            "timestamp": datetime.utcnow()
        })

        return ResponseHandler.success(
            message="Complaint moved to IN_PROGRESS",
            data={"complaint_id": complaint_id, "status": "IN_PROGRESS"}
        )
    except Exception as e:
        logger.error(f"Error starting work on complaint: {str(e)}")
        return ResponseHandler.error(
            message="Failed to start work",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.put(
    "/complaints/{complaint_id}/reject",
    summary="Reject a complaint",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def reject_complaint_simplified(
    complaint_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Move complaint from OPEN to REJECTED"""
    try:
        complaint = await db.complaints.find_one({"_id": ObjectId(complaint_id)})
        if not complaint:
            return ResponseHandler.error(
                message="Complaint not found",
                status_code=status.HTTP_404_NOT_FOUND
            )

        if complaint.get("status") != "OPEN":
            return ResponseHandler.error(
                message="Only OPEN complaints can be rejected here",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        await db.complaints.update_one(
            {"_id": ObjectId(complaint_id)},
            {"$set": {"status": "REJECTED", "updated_at": datetime.utcnow()}}
        )

        await db.complaint_history.insert_one({
            "complaint_id": ObjectId(complaint_id),
            "action": "REJECTED",
            "old_status": "OPEN",
            "new_status": "REJECTED",
            "performed_by": ObjectId(current_user["user_id"]),
            "role": "INSPECTOR",
            "remarks": "Complaint rejected by inspector after physical inspection",
            "timestamp": datetime.utcnow()
        })

        return ResponseHandler.success(
            message="Complaint rejected successfully",
            data={"complaint_id": complaint_id, "status": "REJECTED"}
        )
    except Exception as e:
        logger.error(f"Error rejecting complaint: {str(e)}")
        return ResponseHandler.error(
            message="Failed to reject complaint",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.put(
    "/complaints/{complaint_id}/resolve",
    summary="Resolve a complaint",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def resolve_complaint(
    complaint_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Move complaint from IN_PROGRESS to RESOLVED"""
    try:
        complaint = await db.complaints.find_one({"_id": ObjectId(complaint_id)})
        if not complaint:
            return ResponseHandler.error(
                message="Complaint not found",
                status_code=status.HTTP_404_NOT_FOUND
            )

        if complaint.get("status") != "IN_PROGRESS":
            return ResponseHandler.error(
                message="Only IN_PROGRESS complaints can be resolved",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        await db.complaints.update_one(
            {"_id": ObjectId(complaint_id)},
            {"$set": {
                "status": "RESOLVED",
                "closed_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }}
        )

        await db.complaint_history.insert_one({
            "complaint_id": ObjectId(complaint_id),
            "action": "STATUS_CHANGED",
            "old_status": "IN_PROGRESS",
            "new_status": "RESOLVED",
            "performed_by": ObjectId(current_user["user_id"]),
            "role": "INSPECTOR",
            "remarks": "Issue verified and resolved by inspector",
            "timestamp": datetime.utcnow()
        })

        return ResponseHandler.success(
            message="Complaint resolved successfully",
            data={"complaint_id": complaint_id, "status": "RESOLVED"}
        )
    except Exception as e:
        logger.error(f"Error resolving complaint: {str(e)}")
        return ResponseHandler.error(
            message="Failed to resolve complaint",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
