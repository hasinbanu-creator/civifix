"""Dashboard API routes"""
from fastapi import APIRouter, Depends, status, HTTPException, Query
from typing import Optional, Dict, Any
from app.core.response import SuccessResponse, ResponseHandler
from app.dependencies.auth_dependency import get_current_user
from app.dependencies.role_dependency import require_role
from app.core.exceptions import CivifixException
from app.services.dashboard_service import DashboardService
from app.db.mongodb import get_database, db
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
        stats = await service.get_dashboard_stats(current_user)
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
            current_user,
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
        metrics = await service.get_complaints_metrics(current_user)
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
        stats = await service.get_dashboard_stats(current_user)
        activities = await service.get_recent_activities(current_user, limit=5)
        metrics = await service.get_complaints_metrics(current_user)

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


@router.get(
    "/inspector/dashboard",
    response_model=dict,
    summary="Get Inspector Dashboard",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def get_inspector_dashboard(
    current_user: Dict[str, Any] = Depends(get_current_user),
    service: DashboardService = Depends(get_dashboard_service)
):
    """Get inspector dashboard with ward info, complaints, and workers"""
    try:
        dashboard = await service.get_inspector_dashboard(current_user)
        return ResponseHandler.success(
            message="Inspector dashboard fetched successfully",
            data=dashboard
        )
    except Exception as e:
        logger.error(f"Error fetching inspector dashboard: {str(e)}")
        return ResponseHandler.error(
            message="Failed to fetch inspector dashboard",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.get(
    "/district-admin/dashboard",
    response_model=dict,
    summary="Get District Admin Dashboard",
    dependencies=[Depends(require_role("DISTRICT_ADMIN"))]
)
async def get_district_admin_dashboard(
    current_user: Dict[str, Any] = Depends(get_current_user),
    service: DashboardService = Depends(get_dashboard_service)
):
    """Get district admin dashboard with wards, inspectors, and stats"""
    try:
        dashboard = await service.get_district_admin_dashboard(current_user)
        return ResponseHandler.success(
            message="District admin dashboard fetched successfully",
            data=dashboard
        )
    except Exception as e:
        logger.error(f"Error fetching district admin dashboard: {str(e)}")
        return ResponseHandler.error(
            message="Failed to fetch district admin dashboard",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.get(
    "/worker/dashboard",
    response_model=dict,
    summary="Get Worker Dashboard",
    dependencies=[Depends(require_role("WORKER"))]
)
async def get_worker_dashboard(
    current_user: Dict[str, Any] = Depends(get_current_user),
    service: DashboardService = Depends(get_dashboard_service)
):
    """Get worker dashboard with assigned tasks"""
    try:
        dashboard = await service.get_worker_dashboard(current_user)
        return ResponseHandler.success(
            message="Worker dashboard fetched successfully",
            data=dashboard
        )
    except Exception as e:
        logger.error(f"Error fetching worker dashboard: {str(e)}")
        return ResponseHandler.error(
            message="Failed to fetch worker dashboard",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
