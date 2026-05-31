"""Dashboard API routes"""
from fastapi import APIRouter, Depends, status, HTTPException, Query
from typing import Optional

from app.core.response import SuccessResponse
from app.dependencies.auth_dependency import get_current_user
from app.core.exceptions import CivifixException
from app.services.dashboard_service import DashboardService
from app.db.mongodb import get_database
from app.schemas.dashboard_schema import (
    DashboardOverviewSchema,
    DashboardActivitySchema,
    DashboardMetricsSchema
)
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


def get_dashboard_service(db=Depends(get_database)):
    """Dependency for dashboard service"""
    return DashboardService(db)


@router.get(
    "/overview",
    response_model=dict,
    summary="Get Dashboard Overview",
    tags=["Dashboard"]
)
async def get_dashboard_overview(
    current_user: dict = Depends(get_current_user),
    service: DashboardService = Depends(get_dashboard_service)
):
    """Get dashboard overview with statistics"""
    try:
        stats = await service.get_dashboard_stats(current_user["user_id"])
        return SuccessResponse.create(
            data={
                "stats": stats,
                "message": "Dashboard stats fetched successfully"
            },
            message="Dashboard stats fetched successfully"
        )
    except CivifixException as e:
        logger.error(f"Dashboard error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/activities",
    response_model=dict,
    summary="Get Recent Activities",
    tags=["Dashboard"]
)
async def get_recent_activities(
    limit: int = Query(10, ge=1, le=50),
    current_user: dict = Depends(get_current_user),
    service: DashboardService = Depends(get_dashboard_service)
):
    """Get recent complaint activities"""
    try:
        activities = await service.get_recent_activities(
            current_user["user_id"],
            limit=limit
        )
        return SuccessResponse.create(
            data=activities,
            message="Recent activities fetched successfully"
        )
    except CivifixException as e:
        logger.error(f"Activities error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/metrics",
    response_model=dict,
    summary="Get Complaint Metrics",
    tags=["Dashboard"]
)
async def get_complaint_metrics(
    current_user: dict = Depends(get_current_user),
    service: DashboardService = Depends(get_dashboard_service)
):
    """Get complaint metrics by status"""
    try:
        metrics = await service.get_complaints_metrics(current_user["user_id"])
        return SuccessResponse.create(
            data=metrics,
            message="Metrics fetched successfully"
        )
    except CivifixException as e:
        logger.error(f"Metrics error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/summary",
    response_model=dict,
    summary="Get Full Dashboard Summary",
    tags=["Dashboard"]
)
async def get_dashboard_summary(
    current_user: dict = Depends(get_current_user),
    service: DashboardService = Depends(get_dashboard_service)
):
    """Get complete dashboard summary with stats, activities, and metrics"""
    try:
        stats = await service.get_dashboard_stats(current_user["user_id"])
        activities = await service.get_recent_activities(current_user["user_id"], limit=5)
        metrics = await service.get_complaints_metrics(current_user["user_id"])

        return SuccessResponse.create(
            data={
                "stats": stats,
                "recent_activities": activities["activities"],
                "metrics": metrics["metrics"]
            },
            message="Dashboard summary fetched successfully"
        )
    except CivifixException as e:
        logger.error(f"Dashboard summary error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
