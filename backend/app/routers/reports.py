"""
Reports router for cohort progress endpoints
Compatible with FastAPI 0.104.0+ and Pydantic 2.4.0+
"""

from typing import Optional
from fastapi import APIRouter, Request, HTTPException, status, Query
from fastapi.responses import JSONResponse
import logging

from ..models.reports import ReportCohortProgressResponse, RoleAuthResponse
from ..services.reports_service import reports_service
from ..middleware.role_auth import role_auth

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/health", response_model=dict)
async def reports_health():
    """Health check for reports service"""
    try:
        health_status = reports_service.get_health_status()
        return health_status
    except Exception as e:
        logger.error(f"Reports health check error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Reports service health check failed"
        )


@router.get("/cohort-progress", response_model=ReportCohortProgressResponse)
async def get_cohort_progress(
    request: Request,
    cohort_id: Optional[str] = Query(None, description="Filter by specific cohort ID"),
    course_id: Optional[str] = Query(None, description="Filter by specific course ID"),
    pageSize: int = Query(10, ge=1, le=100, description="Number of results per page", alias="pageSize"),
    pageToken: Optional[str] = Query(None, description="Token for pagination", alias="pageToken")
):
    """
    Get cohort progress reports with filtering and pagination
    Requires authentication and appropriate role permissions
    """
    try:
        # Authenticate user
        user = await role_auth.authenticate_user(request)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )
        
        # Validate role permissions (coordinador and administrador can access reports)
        if not role_auth.validate_role_permission(user["role"], ["coordinador", "administrador"]):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Required roles: coordinador, administrador"
            )
        
        # Validate page token if provided
        if pageToken:
            try:
                int(pageToken)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid page token format"
                )
        
        # Get cohort progress data
        cohort_progress = reports_service.get_cohort_progress(
            cohort_id=cohort_id,
            course_id=course_id,
            page_size=pageSize,
            page_token=pageToken
        )
        
        logger.info(f"Generated cohort progress report for user {user['email']} with role {user['role']}")
        
        return cohort_progress
        
    except HTTPException:
        raise
    except ValueError as e:
        if "Invalid page token" in str(e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid page token format"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate cohort progress report"
        )
    except Exception as e:
        logger.error(f"Error generating cohort progress: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate cohort progress report"
        )


@router.post("/auth/validate", response_model=RoleAuthResponse)
async def validate_role_auth(request: Request):
    """
    Validate user role authentication
    Used for testing and debugging role-based access
    """
    try:
        # Authenticate user
        user = await role_auth.authenticate_user(request)
        
        if user:
            return RoleAuthResponse(
                authenticated=True,
                user={
                    "email": user["email"],
                    "role": user["role"],
                    "permissions": user["permissions"]
                },
                message=f"User {user['email']} authenticated with role {user['role']}"
            )
        else:
            return RoleAuthResponse(
                authenticated=False,
                user=None,
                message="Authentication failed"
            )
            
    except Exception as e:
        logger.error(f"Role validation error: {e}")
        return RoleAuthResponse(
            authenticated=False,
            user=None,
            message=f"Role validation error: {str(e)}"
        )


@router.get("/demo-mode", response_model=dict)
async def get_demo_mode():
    """Get current demo mode configuration"""
    try:
        return {
            "demo_mode": reports_service.demo_mode,
            "is_google_data": reports_service.demo_mode == "google",
            "is_mock_data": reports_service.demo_mode == "mock"
        }
    except Exception as e:
        logger.error(f"Demo mode check error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get demo mode information"
        )