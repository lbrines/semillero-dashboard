"""
Reports router for cohort progress endpoints
Compatible with FastAPI 0.104.0+ and Pydantic 2.4.0+
"""

from typing import Optional
from fastapi import APIRouter, Request, HTTPException, status, Query
from fastapi.responses import JSONResponse
import logging

from ..models.reports import (
    ReportCohortProgressResponse, RoleAuthResponse, KPIResponse,
    CoordinatorDashboard, AdminDashboard, OverviewStats
)
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

@router.get("/stats")
async def get_reports_stats():
    """Obtener estadísticas globales del sistema"""
    return {
        "totalStudents": 150,
        "totalCourses": 12,
        "totalSubmissions": 450,
        "lateSubmissions": 45,
        "averageCompletionRate": 78.5,
        "systemHealth": "healthy",
        "totalTeachers": 8,
        "activeCourses": 10,
        "pendingGrading": 45,
        "averageGrade": 8.2
    }

@router.get("/overview", response_model=OverviewStats)
async def get_overview_stats():
    """Obtener estadísticas generales del sistema para overview"""
    try:
        overview_stats = reports_service.get_overview_stats()
        logger.info("Generated overview stats successfully")
        return overview_stats
    except Exception as e:
        logger.error(f"Error generating overview stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate overview statistics"
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


@router.get("/kpis", response_model=KPIResponse)
async def get_global_kpis(request: Request):
    """
    Get global KPIs (Key Performance Indicators) for the system
    Requires authentication but available to all roles
    """
    try:
        # Authenticate user (but allow all roles to access KPIs)
        user = await role_auth.authenticate_user(request)
        if not user:
            # For KPIs, we'll allow unauthenticated access in MOCK mode
            if reports_service.demo_mode != "mock":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )

        # Calculate and return KPIs
        kpis = reports_service.calculate_global_kpis()

        if user:
            logger.info(f"Generated KPIs for user {user['email']} with role {user['role']}")
        else:
            logger.info("Generated KPIs for unauthenticated access (MOCK mode)")

        return kpis

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating KPIs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate KPIs"
        )


@router.get("/coordinators/{coordinator_id}/dashboard", response_model=CoordinatorDashboard)
async def get_coordinator_dashboard(coordinator_id: str, request: Request):
    """Get comprehensive dashboard data for a coordinator"""
    try:
        # Authenticate user
        user = await role_auth.authenticate_user(request)
        if not user:
            # Allow unauthenticated access in MOCK mode
            if reports_service.demo_mode != "mock":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )

        dashboard = reports_service.get_coordinator_dashboard(coordinator_id)

        if user:
            logger.info(f"Generated coordinator dashboard for user {user['email']}")
        else:
            logger.info("Generated coordinator dashboard for unauthenticated access (MOCK mode)")

        return dashboard
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error generating coordinator dashboard: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating coordinator dashboard: {str(e)}")


@router.get("/admin/dashboard", response_model=AdminDashboard)
async def get_admin_dashboard(request: Request, admin_id: str = "admin_001"):
    """Get comprehensive dashboard data for system administrator"""
    try:
        # Authenticate user
        user = await role_auth.authenticate_user(request)
        if not user:
            # Allow unauthenticated access in MOCK mode
            if reports_service.demo_mode != "mock":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )

        dashboard = reports_service.get_admin_dashboard(admin_id)

        if user:
            logger.info(f"Generated admin dashboard for user {user['email']}")
        else:
            logger.info("Generated admin dashboard for unauthenticated access (MOCK mode)")

        return dashboard
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error generating admin dashboard: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating admin dashboard: {str(e)}")


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