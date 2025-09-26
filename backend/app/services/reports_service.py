"""
Reports service for cohort progress calculations
Compatible with FastAPI 0.104.0+ and Pydantic 2.4.0+
"""

from typing import List, Optional, Dict, Any
import json
import os
from ..models.reports import ReportCohortProgress, CourseProgress, ReportCohortProgressResponse
import logging

logger = logging.getLogger(__name__)


class ReportsService:
    """Service for generating cohort progress reports from mock data"""
    
    def __init__(self):
        self.demo_mode = os.getenv("DEMO_MODE", "mock")
        self.mock_data = self._load_mock_data()
    
    def _load_mock_data(self) -> Dict[str, Any]:
        """Load mock data for reports generation"""
        try:
            # Load students data
            students_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "mock", "students.json")
            with open(students_path, 'r', encoding='utf-8') as f:
                students_data = json.load(f)
            
            # Load courses data
            courses_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "mock", "courses.json")
            with open(courses_path, 'r', encoding='utf-8') as f:
                courses_data = json.load(f)
            
            # Load submissions data (mock)
            submissions_data = self._generate_mock_submissions(students_data, courses_data)
            
            return {
                "students": students_data,
                "courses": courses_data,
                "submissions": submissions_data
            }
        except Exception as e:
            logger.error(f"Error loading mock data: {e}")
            return {"students": [], "courses": [], "submissions": []}
    
    def _generate_mock_submissions(self, students: List[Dict], courses: List[Dict]) -> List[Dict]:
        """Generate mock submissions data for reports"""
        submissions = []
        
        # Generate submissions for each student in each course
        for student in students:
            for course in courses:
                if student.get("course_id") == course.get("id"):
                    # Generate 2-4 submissions per student per course
                    num_submissions = 3  # Fixed for consistent reports
                    
                    for i in range(num_submissions):
                        submission = {
                            "id": f"submission_{student['user_id']}_{course['id']}_{i+1}",
                            "user_id": student["user_id"],
                            "course_id": course["id"],
                            "assignment_id": f"assignment_{course['id']}_{i+1}",
                            "submission_time": "2024-01-15T10:00:00Z",
                            "due_time": "2024-01-15T23:59:59Z",
                            "is_late": i == 2,  # Third submission is late
                            "grade": 85 + (i * 5),
                            "status": "TURNED_IN"
                        }
                        submissions.append(submission)
        
        return submissions
    
    def get_cohort_progress(
        self, 
        cohort_id: Optional[str] = None,
        course_id: Optional[str] = None,
        page_size: int = 10,
        page_token: Optional[str] = None
    ) -> ReportCohortProgressResponse:
        """Get cohort progress reports with filtering and pagination"""
        
        try:
            # Generate cohort data from mock data
            cohorts = self._generate_cohort_data(cohort_id, course_id)
            logger.info(f"Generated {len(cohorts)} cohorts, page_size={page_size}, page_token={page_token}")
            
            # Apply pagination
            start_index = 0
            if page_token:
                try:
                    start_index = int(page_token)
                except ValueError:
                    raise ValueError("Invalid page token")
            
            end_index = start_index + page_size
            paginated_cohorts = cohorts[start_index:end_index]
            
            # Check if there are more pages
            has_next_page = end_index < len(cohorts)
            next_page_token = str(end_index) if has_next_page else None
            
            return ReportCohortProgressResponse(
                cohorts=paginated_cohorts,
                total_cohorts=len(cohorts),
                page_size=page_size,
                page_token=next_page_token,
                has_next_page=has_next_page
            )
            
        except Exception as e:
            logger.error(f"Error generating cohort progress: {e}")
            return ReportCohortProgressResponse(
                cohorts=[],
                total_cohorts=0,
                page_size=page_size,
                page_token=None,
                has_next_page=False
            )
    
    def _generate_cohort_data(
        self, 
        cohort_id: Optional[str] = None,
        course_id: Optional[str] = None
    ) -> List[ReportCohortProgress]:
        """Generate cohort progress data from mock data"""
        
        cohorts = []
        
        # Group students by course to create cohorts
        course_groups = {}
        for student in self.mock_data["students"]:
            course_id_student = student.get("course_id")
            if course_id_student not in course_groups:
                course_groups[course_id_student] = []
            course_groups[course_id_student].append(student)
        
        # Create cohort progress for each course
        for course_id_key, students in course_groups.items():
            if course_id and course_id_key != course_id:
                continue
            
            # Find course information
            course_info = None
            for course in self.mock_data["courses"]:
                if course.get("id") == course_id_key:
                    course_info = course
                    break
            
            if not course_info:
                continue
            
            # Generate cohort ID and name
            cohort_id_generated = f"{course_id_key}_cohort_001"
            cohort_name = f"Cohorte {course_info.get('name', 'Unknown')} 2024-1"
            
            if cohort_id and cohort_id_generated != cohort_id:
                continue
            
            # Calculate submissions for this cohort
            cohort_submissions = [
                sub for sub in self.mock_data["submissions"]
                if sub.get("course_id") == course_id_key
            ]
            
            on_time_submissions = len([s for s in cohort_submissions if not s.get("is_late", False)])
            late_submissions = len([s for s in cohort_submissions if s.get("is_late", False)])
            total_submissions = len(cohort_submissions)
            
            # Calculate percentages
            on_time_percentage = (on_time_submissions / total_submissions * 100) if total_submissions > 0 else 0
            late_percentage = (late_submissions / total_submissions * 100) if total_submissions > 0 else 0
            
            # Create course progress
            course_progress = CourseProgress(
                course_id=course_id_key,
                course_name=course_info.get("name", "Unknown Course"),
                total_students=len(students),
                on_time_submissions=on_time_submissions,
                late_submissions=late_submissions,
                on_time_percentage=round(on_time_percentage, 2),
                late_percentage=round(late_percentage, 2)
            )
            
            # Create cohort progress
            cohort_progress = ReportCohortProgress(
                cohort_id=cohort_id_generated,
                cohort_name=cohort_name,
                total_students=len(students),
                total_submissions=total_submissions,
                on_time_submissions=on_time_submissions,
                late_submissions=late_submissions,
                on_time_percentage=round(on_time_percentage, 2),
                late_percentage=round(late_percentage, 2),
                courses=[course_progress],
                is_google_data=(self.demo_mode == "google")
            )
            
            cohorts.append(cohort_progress)
        
        return cohorts
    
    def get_health_status(self) -> Dict[str, Any]:
        """Get reports service health status"""
        return {
            "status": "healthy",
            "demo_mode": self.demo_mode,
            "data_loaded": len(self.mock_data["students"]) > 0,
            "total_students": len(self.mock_data["students"]),
            "total_courses": len(self.mock_data["courses"]),
            "total_submissions": len(self.mock_data["submissions"])
        }


# Global instance
reports_service = ReportsService()
