"""Worker API routes"""
from fastapi import APIRouter, Depends, status, HTTPException, Query
from typing import Dict, Any
from bson import ObjectId
import logging

from app.core.response import ResponseHandler
from app.dependencies.auth_dependency import get_current_user
from app.dependencies.role_dependency import require_role
from app.db.mongodb import db

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/complaints",
    summary="Get assigned complaints",
    dependencies=[Depends(require_role("WORKER"))]
)
async def get_assigned_complaints(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: str = Query(None),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get complaints assigned to worker"""
    try:
        query = {"assigned_to": ObjectId(current_user["user_id"])}

        if status:
            query["status"] = status

        skip = (page - 1) * limit
        complaints = await db.complaints.find(query)\
            .skip(skip)\
            .limit(limit)\
            .sort("created_at", -1)\
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
                "priority": complaint.get("priority", "MEDIUM"),
                "created_at": complaint.get("created_at").isoformat() if complaint.get("created_at") else None,
                "updated_at": complaint.get("updated_at").isoformat() if complaint.get("updated_at") else None,
                "assigned_at": complaint.get("assigned_at").isoformat() if complaint.get("assigned_at") else None
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
        logger.error(f"Error fetching assigned complaints: {str(e)}")
        return ResponseHandler.error(
            message="Failed to retrieve complaints",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
