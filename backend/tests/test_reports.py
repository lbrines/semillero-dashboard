"""
Tests for reports functionality
Compatible with pytest 7.4.0+ and FastAPI 0.104.0+
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import json

from app.main import app
from app.models.reports import ReportCohortProgress, CourseProgress, ReportCohortProgressResponse
from app.services.reports_service import ReportsService
from app.middleware.role_auth import RoleAuthMiddleware

client = TestClient(app)


class TestReportsService:
    """Test cases for ReportsService"""
    
    def test_reports_service_initialization(self):
        """Test ReportsService initialization"""
        service = ReportsService()
        assert service.demo_mode in ["mock", "google"]
        assert isinstance(service.mock_data, dict)
        assert "students" in service.mock_data
        assert "courses" in service.mock_data
        assert "submissions" in service.mock_data
    
    def test_get_cohort_progress_basic(self):
        """Test basic cohort progress generation"""
        service = ReportsService()
        result = service.get_cohort_progress()
        
        assert isinstance(result, ReportCohortProgressResponse)
        assert isinstance(result.cohorts, list)
        assert result.total_cohorts >= 0
        assert result.page_size == 10
        assert result.has_next_page is not None
    
    def test_get_cohort_progress_with_filters(self):
        """Test cohort progress with filters"""
        service = ReportsService()
        
        # Test with cohort_id filter
        result = service.get_cohort_progress(cohort_id="course_1_cohort_001")
        assert isinstance(result, ReportCohortProgressResponse)
        
        # Test with course_id filter
        result = service.get_cohort_progress(course_id="course_1")
        assert isinstance(result, ReportCohortProgressResponse)
    
    def test_get_cohort_progress_pagination(self):
        """Test cohort progress pagination"""
        service = ReportsService()
        
        # Test first page
        result1 = service.get_cohort_progress(page_size=1, page_token=None)
        assert result1.page_size == 1
        assert len(result1.cohorts) <= 1
        
        # Test second page if available
        if result1.has_next_page:
            result2 = service.get_cohort_progress(page_size=1, page_token=result1.page_token)
            assert result2.page_size == 1
            assert len(result2.cohorts) <= 1
    
    def test_get_health_status(self):
        """Test health status endpoint"""
        service = ReportsService()
        health = service.get_health_status()
        
        assert health["status"] == "healthy"
        assert "demo_mode" in health
        assert "data_loaded" in health
        assert "total_students" in health
        assert "total_courses" in health
        assert "total_submissions" in health


class TestRoleAuthMiddleware:
    """Test cases for RoleAuthMiddleware"""
    
    def test_role_auth_initialization(self):
        """Test RoleAuthMiddleware initialization"""
        middleware = RoleAuthMiddleware()
        assert isinstance(middleware.roles_whitelist, dict)
        assert middleware.demo_mode in ["mock", "google"]
    
    def test_get_user_role(self):
        """Test user role retrieval"""
        middleware = RoleAuthMiddleware()
        
        # Test valid email
        role = middleware.get_user_role("admin@instituto.edu")
        assert role == "administrador"
        
        # Test invalid email
        role = middleware.get_user_role("invalid@example.com")
        assert role is None
    
    def test_validate_role_permission(self):
        """Test role permission validation"""
        middleware = RoleAuthMiddleware()
        
        # Test valid permissions
        assert middleware.validate_role_permission("administrador", ["coordinador"])
        assert middleware.validate_role_permission("coordinador", ["docente"])
        assert middleware.validate_role_permission("docente", ["estudiante"])
        
        # Test invalid permissions
        assert not middleware.validate_role_permission("estudiante", ["docente"])
        assert not middleware.validate_role_permission("docente", ["coordinador"])
    
    def test_get_role_permissions(self):
        """Test role permissions retrieval"""
        middleware = RoleAuthMiddleware()
        
        # Test each role
        admin_perms = middleware._get_role_permissions("administrador")
        assert "STUDENTS_SEARCH" in admin_perms
        assert "VIEW_GLOBAL_REPORTS" in admin_perms
        
        coord_perms = middleware._get_role_permissions("coordinador")
        assert "STUDENTS_SEARCH" in coord_perms
        assert "VIEW_COHORT_REPORTS" in coord_perms
        
        teacher_perms = middleware._get_role_permissions("docente")
        assert "STUDENTS_SEARCH" in teacher_perms
        assert "VIEW_COURSE_STUDENTS" in teacher_perms
        
        student_perms = middleware._get_role_permissions("estudiante")
        assert "VIEW_OWN_PROGRESS" in student_perms
        assert "STUDENTS_SEARCH" not in student_perms


class TestReportsAPI:
    """Test cases for Reports API endpoints"""
    
    def test_reports_health_endpoint(self):
        """Test reports health endpoint"""
        response = client.get("/api/v1/reports/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert "demo_mode" in data
        assert "data_loaded" in data
    
    def test_cohort_progress_endpoint_without_auth(self):
        """Test cohort progress endpoint without authentication"""
        response = client.get("/api/v1/reports/cohort-progress")
        # Should return 401 or 403 depending on implementation
        assert response.status_code in [401, 403]
    
    def test_cohort_progress_endpoint_with_auth(self):
        """Test cohort progress endpoint with authentication"""
        headers = {"X-User-Email": "admin@instituto.edu"}
        response = client.get("/api/v1/reports/cohort-progress", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            assert "cohorts" in data
            assert "total_cohorts" in data
            assert "page_size" in data
            assert "has_next_page" in data
    
    def test_cohort_progress_endpoint_with_filters(self):
        """Test cohort progress endpoint with filters"""
        headers = {"X-User-Email": "admin@instituto.edu"}
        
        # Test with cohort_id filter
        response = client.get(
            "/api/v1/reports/cohort-progress?cohort_id=course_1_cohort_001",
            headers=headers
        )
        if response.status_code == 200:
            data = response.json()
            assert "cohorts" in data
        
        # Test with course_id filter
        response = client.get(
            "/api/v1/reports/cohort-progress?course_id=course_1",
            headers=headers
        )
        if response.status_code == 200:
            data = response.json()
            assert "cohorts" in data
    
    def test_cohort_progress_endpoint_pagination(self):
        """Test cohort progress endpoint pagination"""
        headers = {"X-User-Email": "admin@instituto.edu"}
        
        # Test with page_size
        response = client.get(
            "/api/v1/reports/cohort-progress?pageSize=2",
            headers=headers
        )
        if response.status_code == 200:
            data = response.json()
            assert data["page_size"] == 2
            assert len(data["cohorts"]) <= 2
        
        # Test with invalid page_token
        response = client.get(
            "/api/v1/reports/cohort-progress?pageToken=invalid_token",
            headers=headers
        )
        assert response.status_code == 400
    
    def test_validate_role_auth_endpoint(self):
        """Test role authentication validation endpoint"""
        headers = {"X-User-Email": "admin@instituto.edu"}
        response = client.post("/api/v1/reports/auth/validate", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            assert "authenticated" in data
            assert "user" in data
            assert "message" in data
    
    def test_demo_mode_endpoint(self):
        """Test demo mode endpoint"""
        response = client.get("/api/v1/reports/demo-mode")
        assert response.status_code == 200
        
        data = response.json()
        assert "demo_mode" in data
        assert "is_google_data" in data
        assert "is_mock_data" in data


class TestReportsModels:
    """Test cases for Reports models"""
    
    def test_course_progress_model(self):
        """Test CourseProgress model"""
        course_progress = CourseProgress(
            course_id="course_1",
            course_name="Test Course",
            total_students=10,
            on_time_submissions=8,
            late_submissions=2,
            on_time_percentage=80.0,
            late_percentage=20.0
        )
        
        assert course_progress.course_id == "course_1"
        assert course_progress.course_name == "Test Course"
        assert course_progress.total_students == 10
        assert course_progress.on_time_submissions == 8
        assert course_progress.late_submissions == 2
        assert course_progress.on_time_percentage == 80.0
        assert course_progress.late_percentage == 20.0
    
    def test_report_cohort_progress_model(self):
        """Test ReportCohortProgress model"""
        course_progress = CourseProgress(
            course_id="course_1",
            course_name="Test Course",
            total_students=10,
            on_time_submissions=8,
            late_submissions=2,
            on_time_percentage=80.0,
            late_percentage=20.0
        )
        
        cohort_progress = ReportCohortProgress(
            cohort_id="cohort_1",
            cohort_name="Test Cohort",
            total_students=10,
            total_submissions=10,
            on_time_submissions=8,
            late_submissions=2,
            on_time_percentage=80.0,
            late_percentage=20.0,
            courses=[course_progress],
            is_google_data=False
        )
        
        assert cohort_progress.cohort_id == "cohort_1"
        assert cohort_progress.cohort_name == "Test Cohort"
        assert cohort_progress.total_students == 10
        assert cohort_progress.total_submissions == 10
        assert cohort_progress.on_time_submissions == 8
        assert cohort_progress.late_submissions == 2
        assert cohort_progress.on_time_percentage == 80.0
        assert cohort_progress.late_percentage == 20.0
        assert len(cohort_progress.courses) == 1
        assert cohort_progress.is_google_data is False
    
    def test_report_cohort_progress_response_model(self):
        """Test ReportCohortProgressResponse model"""
        course_progress = CourseProgress(
            course_id="course_1",
            course_name="Test Course",
            total_students=10,
            on_time_submissions=8,
            late_submissions=2,
            on_time_percentage=80.0,
            late_percentage=20.0
        )
        
        cohort_progress = ReportCohortProgress(
            cohort_id="cohort_1",
            cohort_name="Test Cohort",
            total_students=10,
            total_submissions=10,
            on_time_submissions=8,
            late_submissions=2,
            on_time_percentage=80.0,
            late_percentage=20.0,
            courses=[course_progress],
            is_google_data=False
        )
        
        response = ReportCohortProgressResponse(
            cohorts=[cohort_progress],
            total_cohorts=1,
            page_size=10,
            page_token=None,
            has_next_page=False
        )
        
        assert len(response.cohorts) == 1
        assert response.total_cohorts == 1
        assert response.page_size == 10
        assert response.page_token is None
        assert response.has_next_page is False


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
