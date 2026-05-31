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

    async def get_dashboard_stats(self, user_id: str = None) -> Dict[str, Any]:
        """Get dashboard statistics"""
        try:
            complaints_collection = self.db["complaints"]

            # Build query
            query = {}
            if user_id:
                from bson import ObjectId
                query["user_id"] = ObjectId(user_id)

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

    async def get_recent_activities(self, user_id: str = None, limit: int = 10) -> Dict[str, Any]:
        """Get recent activities/complaints"""
        try:
            complaints_collection = self.db["complaints"]

            query = {}
            if user_id:
                from bson import ObjectId
                query["user_id"] = ObjectId(user_id)

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

    async def get_complaints_metrics(self, user_id: str = None) -> Dict[str, Any]:
        """Get complaint metrics by status"""
        try:
            complaints_collection = self.db["complaints"]

            query = {}
            if user_id:
                from bson import ObjectId
                query["user_id"] = ObjectId(user_id)

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
