"""Dashboard API schemas"""
from pydantic import BaseModel
from typing import Optional, List


class DashboardStatsSchema(BaseModel):
    total_complaints: int
    resolved_complaints: int
    pending_complaints: int
    in_progress_complaints: int


class DashboardOverviewSchema(BaseModel):
    stats: DashboardStatsSchema
    message: str


class RecentActivitySchema(BaseModel):
    id: str
    type: str
    title: str
    description: Optional[str]
    timestamp: str
    status: str


class DashboardActivitySchema(BaseModel):
    activities: List[RecentActivitySchema]
    total: int
    message: str


class ComplaintMetricSchema(BaseModel):
    name: str
    count: int
    percentage: float


class DashboardMetricsSchema(BaseModel):
    metrics: List[ComplaintMetricSchema]
    message: str
