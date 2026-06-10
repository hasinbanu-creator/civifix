"""Dashboard service"""
from datetime import datetime
from typing import Dict, Any, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.complaint_repository import ComplaintRepository
import logging

logger = logging.getLogger(__name__)


class DashboardService:
    """Service for dashboard operations"""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.complaint_repo = ComplaintRepository(db)

    async def get_dashboard_stats(self, current_user: dict = None) -> Dict[str, Any]:
        """Get dashboard statistics (role-aware)"""
        try:
            from bson import ObjectId
            complaints_collection = self.db["complaints"]

            # Build role-aware query
            query = {}
            if current_user:
                role = current_user.get("role")
                user_id = current_user.get("user_id")
                district = current_user.get("district")

                if role == "CITIZEN":
                    query["user_id"] = ObjectId(user_id)
                elif role == "INSPECTOR":
                    query["inspector_id"] = ObjectId(user_id)
                elif role == "WORKER":
                    query["worker_id"] = ObjectId(user_id)
                elif role == "DISTRICT_ADMIN":
                    if district:
                        query["district_id"] = ObjectId(district)
                # SUPER_ADMIN and others have no extra filter

            # Get counts by status
            total = await complaints_collection.count_documents(query)
            resolved = await complaints_collection.count_documents({**query, "status": "RESOLVED"})
            pending = await complaints_collection.count_documents({**query, "status": "PENDING"})
            in_progress = await complaints_collection.count_documents({**query, "status": "IN_PROGRESS"})

            return {
                "total_complaints": total,
                "resolved_complaints": resolved,
                "pending_complaints": pending,
                "in_progress_complaints": in_progress
            }
        except Exception as e:
            logger.error(f"Error getting dashboard stats: {str(e)}")
            raise

    async def get_recent_activities(self, current_user: dict = None, limit: int = 10) -> Dict[str, Any]:
        """Get recent activities/complaints (role-aware)"""
        try:
            from bson import ObjectId
            complaints_collection = self.db["complaints"]

            query = {}
            if current_user:
                role = current_user.get("role")
                user_id = current_user.get("user_id")
                district = current_user.get("district")

                if role == "CITIZEN":
                    query["user_id"] = ObjectId(user_id)
                elif role == "INSPECTOR":
                    query["inspector_id"] = ObjectId(user_id)
                elif role == "WORKER":
                    query["worker_id"] = ObjectId(user_id)
                elif role == "DISTRICT_ADMIN":
                    if district:
                        query["district_id"] = ObjectId(district)

            complaints = await complaints_collection.find(query)\
                .sort("created_at", -1)\
                .limit(limit)\
                .to_list(length=limit)

            activities = []
            for complaint in complaints:
                activities.append({
                    "id": str(complaint.get("_id")),
                    "type": "COMPLAINT",
                    "title": complaint.get("title", ""),
                    "description": complaint.get("description", ""),
                    "timestamp": complaint.get("created_at", datetime.utcnow()).isoformat(),
                    "status": complaint.get("status", "PENDING")
                })

            return {
                "activities": activities,
                "total": len(activities)
            }
        except Exception as e:
            logger.error(f"Error getting recent activities: {str(e)}")
            raise

    async def get_complaints_metrics(self, current_user: dict = None) -> Dict[str, Any]:
        """Get complaint metrics by status (role-aware)"""
        try:
            from bson import ObjectId
            complaints_collection = self.db["complaints"]

            query = {}
            if current_user:
                role = current_user.get("role")
                user_id = current_user.get("user_id")
                district = current_user.get("district")

                if role == "CITIZEN":
                    query["user_id"] = ObjectId(user_id)
                elif role == "INSPECTOR":
                    query["inspector_id"] = ObjectId(user_id)
                elif role == "WORKER":
                    query["worker_id"] = ObjectId(user_id)
                elif role == "DISTRICT_ADMIN":
                    if district:
                        query["district_id"] = ObjectId(district)

            total = await complaints_collection.count_documents(query)

            statuses = ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"]
            metrics = []

            for status in statuses:
                count = await complaints_collection.count_documents({**query, "status": status})
                percentage = (count / total * 100) if total > 0 else 0
                metrics.append({
                    "name": status,
                    "count": count,
                    "percentage": round(percentage, 2)
                })

            return {
                "metrics": metrics
            }
        except Exception as e:
            logger.error(f"Error getting complaints metrics: {str(e)}")
            raise

    async def get_inspector_dashboard(self, current_user: dict) -> Dict[str, Any]:
        """Get inspector-specific dashboard with ward info and complaints"""
        try:
            from bson import ObjectId
            inspector_id = ObjectId(current_user.get("user_id"))

            # Get inspector's ward
            wards_collection = self.db["wards"]
            ward = await wards_collection.find_one({"inspector_id": inspector_id})

            if not ward:
                return {
                    "ward_info": None,
                    "stats": {"total_complaints": 0, "pending": 0, "in_progress": 0, "resolved": 0},
                    "ward_complaints": [],
                    "assigned_workers": 0,
                    "pending_approvals": 0
                }

            ward_id = ward.get("_id")
            complaints_collection = self.db["complaints"]

            # Get statistics
            query = {"ward_id": ward_id}
            total = await complaints_collection.count_documents(query)
            pending = await complaints_collection.count_documents({**query, "status": "PENDING"})
            in_progress = await complaints_collection.count_documents({**query, "status": "IN_PROGRESS"})
            resolved = await complaints_collection.count_documents({**query, "status": "RESOLVED"})
            pending_approvals = await complaints_collection.count_documents(
                {**query, "status": "APPROVAL"}
            )

            # Get recent complaints in ward
            complaints = await complaints_collection.find(query)\
                .sort("created_at", -1)\
                .limit(10)\
                .to_list(length=10)

            ward_complaints = []
            for complaint in complaints:
                ward_complaints.append({
                    "_id": str(complaint.get("_id")),
                    "complaint_id": complaint.get("complaint_id"),
                    "title": complaint.get("title"),
                    "description": complaint.get("description"),
                    "status": complaint.get("status"),
                    "priority": complaint.get("priority", "MEDIUM"),
                    "created_at": complaint.get("created_at", datetime.utcnow()).isoformat()
                })

            # Get assigned workers count
            users_collection = self.db["users"]
            workers_count = await users_collection.count_documents({
                "ward_id": ward_id,
                "role": "WORKER",
                "is_active": True
            })

            return {
                "ward_info": {
                    "ward_id": str(ward.get("_id")),
                    "ward_name": ward.get("ward_name"),
                    "ward_number": ward.get("ward_number"),
                    "inspector_id": str(ward.get("inspector_id")),
                    "description": ward.get("description")
                },
                "stats": {
                    "total_complaints": total,
                    "pending": pending,
                    "in_progress": in_progress,
                    "resolved": resolved
                },
                "ward_complaints": ward_complaints,
                "assigned_workers": workers_count,
                "pending_approvals": pending_approvals
            }
        except Exception as e:
            logger.error(f"Error getting inspector dashboard: {str(e)}")
            raise

    async def get_district_admin_dashboard(self, current_user: dict) -> Dict[str, Any]:
        """Get district admin dashboard with wards, inspectors, and stats"""
        try:
            from bson import ObjectId
            district_id = ObjectId(current_user.get("district"))

            complaints_collection = self.db["complaints"]
            wards_collection = self.db["wards"]
            users_collection = self.db["users"]

            # Get statistics
            query = {"district_id": district_id}
            total = await complaints_collection.count_documents(query)
            resolved = await complaints_collection.count_documents({**query, "status": "RESOLVED"})
            pending = await complaints_collection.count_documents({**query, "status": "PENDING"})
            rejected = await complaints_collection.count_documents({**query, "status": "REJECTED"})

            # Get ward summary
            total_wards = await wards_collection.count_documents({"district_id": district_id})
            active_wards = await wards_collection.count_documents({
                "district_id": district_id,
                "is_active": True
            })
            unassigned_wards = await wards_collection.count_documents({
                "district_id": district_id,
                "inspector_id": None
            })

            # Get recent activities
            activities = await complaints_collection.find(query)\
                .sort("created_at", -1)\
                .limit(10)\
                .to_list(length=10)

            recent_activities = []
            for activity in activities:
                recent_activities.append({
                    "id": str(activity.get("_id")),
                    "title": activity.get("title"),
                    "status": activity.get("status"),
                    "created_at": activity.get("created_at", datetime.utcnow()).isoformat()
                })

            # Get top performers (inspectors by resolved complaints)
            pipeline = [
                {"$match": {**query, "status": "RESOLVED"}},
                {"$group": {"_id": "$inspector_id", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 5}
            ]
            top_results = await complaints_collection.aggregate(pipeline).to_list(length=5)

            top_performers = []
            for result in top_results:
                if result.get("_id"):
                    inspector = await users_collection.find_one({"_id": ObjectId(result["_id"])})
                    if inspector:
                        top_performers.append({
                            "name": inspector.get("name"),
                            "complaints_resolved": result.get("count", 0)
                        })

            return {
                "district_info": {
                    "district_id": str(district_id),
                },
                "stats": {
                    "total_complaints": total,
                    "resolved": resolved,
                    "pending": pending,
                    "rejected": rejected
                },
                "wards_summary": {
                    "total_wards": total_wards,
                    "active_wards": active_wards,
                    "unassigned_wards": unassigned_wards
                },
                "top_performers": top_performers,
                "recent_activities": recent_activities
            }
        except Exception as e:
            logger.error(f"Error getting district admin dashboard: {str(e)}")
            raise

    async def get_worker_dashboard(self, current_user: dict) -> Dict[str, Any]:
        """Get worker dashboard with assigned tasks"""
        try:
            from bson import ObjectId
            worker_id = ObjectId(current_user.get("user_id"))

            complaints_collection = self.db["complaints"]

            # Get assigned tasks statistics
            query = {"worker_id": worker_id}
            total = await complaints_collection.count_documents(query)
            pending = await complaints_collection.count_documents({**query, "status": "PENDING"})
            completed = await complaints_collection.count_documents({**query, "status": "RESOLVED"})

            # Calculate completion rate
            completion_rate = (completed / total * 100) if total > 0 else 0

            # Get recent assignments
            assignments = await complaints_collection.find(query)\
                .sort("assigned_at", -1)\
                .limit(10)\
                .to_list(length=10)

            recent_assignments = []
            for assignment in assignments:
                recent_assignments.append({
                    "_id": str(assignment.get("_id")),
                    "complaint_id": assignment.get("complaint_id"),
                    "title": assignment.get("title"),
                    "status": assignment.get("status"),
                    "priority": assignment.get("priority", "MEDIUM"),
                    "assigned_at": assignment.get("assigned_at", datetime.utcnow()).isoformat(),
                    "deadline": assignment.get("deadline", datetime.utcnow()).isoformat() if assignment.get("deadline") else None
                })

            return {
                "assigned_tasks": {
                    "total": total,
                    "pending": pending,
                    "completed": completed
                },
                "completion_rate": round(completion_rate, 2),
                "recent_assignments": recent_assignments
            }
        except Exception as e:
            logger.error(f"Error getting worker dashboard: {str(e)}")
            raise
