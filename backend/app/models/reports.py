"""
Report models for cohort progress tracking
Compatible with FastAPI 0.104.0+ and Pydantic 2.4.0+
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class CourseProgress(BaseModel):
    """Model for course progress within a cohort"""
    course_id: str = Field(..., description="Course identifier")
    course_name: str = Field(..., description="Course name")
    total_students: int = Field(..., description="Total students in course")
    on_time_submissions: int = Field(..., description="On-time submissions count")
    late_submissions: int = Field(..., description="Late submissions count")
    on_time_percentage: float = Field(..., description="On-time submissions percentage")
    late_percentage: float = Field(..., description="Late submissions percentage")


class ReportCohortProgress(BaseModel):
    """Model for cohort progress report with Pydantic validation"""
    cohort_id: str = Field(..., description="Cohort identifier")
    cohort_name: str = Field(..., description="Cohort name")
    total_students: int = Field(..., description="Total students in cohort")
    total_submissions: int = Field(..., description="Total submissions in cohort")
    on_time_submissions: int = Field(..., description="On-time submissions count")
    late_submissions: int = Field(..., description="Late submissions count")
    on_time_percentage: float = Field(..., description="On-time submissions percentage")
    late_percentage: float = Field(..., description="Late submissions percentage")
    courses: List[CourseProgress] = Field(..., description="Course progress breakdown")
    is_google_data: bool = Field(default=False, description="Indicates if data comes from Google Classroom API")


class ReportCohortProgressResponse(BaseModel):
    """Response model for cohort progress reports"""
    cohorts: List[ReportCohortProgress] = Field(..., description="List of cohort progress reports")
    total_cohorts: int = Field(..., description="Total number of cohorts")
    page_size: int = Field(..., description="Page size for pagination")
    page_token: Optional[str] = Field(None, description="Token for next page")
    has_next_page: bool = Field(..., description="Indicates if there are more pages")


class RoleUser(BaseModel):
    """Model for user role information"""
    email: str = Field(..., description="User email address")
    role: str = Field(..., description="User role (estudiante, docente, coordinador, administrador)")
    permissions: List[str] = Field(..., description="List of user permissions")


class RoleAuthRequest(BaseModel):
    """Model for role authentication request"""
    email: str = Field(..., description="User email for role validation")
    token: Optional[str] = Field(None, description="JWT token for authentication")


class RoleAuthResponse(BaseModel):
    """Model for role authentication response"""
    authenticated: bool = Field(..., description="Authentication status")
    user: Optional[RoleUser] = Field(None, description="User information if authenticated")
    message: str = Field(..., description="Response message")
