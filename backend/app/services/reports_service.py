"""
Reports service for cohort progress calculations
Compatible with FastAPI 0.104.0+ and Pydantic 2.4.0+
"""

from typing import List, Optional, Dict, Any
import json
import os
from ..models.reports import (
    ReportCohortProgress, CourseProgress, ReportCohortProgressResponse, KPIResponse,
    StudentDashboard, TeacherDashboard, CoordinatorDashboard, AdminDashboard,
    UpcomingDeadline, RecentActivity, ChartDataPoint, TrendsData
)
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

            # Generate chart data for Tremor
            chart_data = []
            trends_data = []
            total_on_time = 0
            total_late = 0

            for cohort in cohorts:
                chart_data.append(ChartDataPoint(
                    name=cohort.cohort_name.replace("Cohorte ", "").replace(" 2024-1", ""),
                    onTime=cohort.on_time_submissions,
                    late=cohort.late_submissions,
                    percentage=cohort.on_time_percentage
                ))
                total_on_time += cohort.on_time_submissions
                total_late += cohort.late_submissions

            # Mock trends data (in real app, this would be calculated from historical data)
            trends_data = [
                TrendsData(
                    period="Enero 2024",
                    onTimeSubmissions=6,
                    lateSubmissions=2,
                    totalSubmissions=8
                ),
                TrendsData(
                    period="Febrero 2024",
                    onTimeSubmissions=total_on_time,
                    lateSubmissions=total_late,
                    totalSubmissions=total_on_time + total_late
                )
            ]

            # Summary statistics
            summary = {
                "totalSubmissions": total_on_time + total_late,
                "overallOnTimePercentage": (total_on_time / (total_on_time + total_late) * 100) if (total_on_time + total_late) > 0 else 0,
                "bestPerformingCohort": max(cohorts, key=lambda c: c.on_time_percentage).cohort_name if cohorts else "N/A",
                "worstPerformingCohort": min(cohorts, key=lambda c: c.on_time_percentage).cohort_name if cohorts else "N/A"
            }

            return ReportCohortProgressResponse(
                cohorts=paginated_cohorts,
                total_cohorts=len(cohorts),
                page_size=page_size,
                page_token=next_page_token,
                has_next_page=has_next_page,
                chartData=chart_data,
                trends=trends_data,
                summary=summary
            )
            
        except Exception as e:
            logger.error(f"Error generating cohort progress: {e}")
            return ReportCohortProgressResponse(
                cohorts=[],
                total_cohorts=0,
                page_size=page_size,
                page_token=None,
                has_next_page=False,
                chartData=[],
                trends=[],
                summary={"totalSubmissions": 0, "overallOnTimePercentage": 0, "bestPerformingCohort": "N/A", "worstPerformingCohort": "N/A"}
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
    
    def calculate_global_kpis(self) -> KPIResponse:
        """Calculate global KPIs from mock data"""
        try:
            students = self.mock_data["students"]
            courses = self.mock_data["courses"]
            submissions = self.mock_data["submissions"]

            # Basic counts
            total_students = len(students)
            total_courses = len(courses)
            total_submissions = len(submissions)

            # Submission analysis
            on_time_submissions = len([s for s in submissions if not s.get("is_late", False)])
            late_submissions = len([s for s in submissions if s.get("is_late", False)])

            # Calculate percentages
            on_time_percentage = (on_time_submissions / total_submissions * 100) if total_submissions > 0 else 0

            # Calculate completion rates per student
            completion_rates = []
            for student in students:
                student_submissions = [s for s in submissions if s.get("user_id") == student.get("user_id")]
                # Assume 3 assignments per student per course
                expected_submissions = 3
                completion_rate = (len(student_submissions) / expected_submissions * 100) if expected_submissions > 0 else 0
                completion_rates.append(completion_rate)

            # Average completion rate
            average_completion_rate = sum(completion_rates) / len(completion_rates) if completion_rates else 0

            # Students at risk (completion rate < 50%)
            students_at_risk = len([rate for rate in completion_rates if rate < 50])

            # Teachers count (assume 1 teacher per course for mock data)
            total_teachers = total_courses

            # Active courses (all courses are considered active in mock)
            active_courses = total_courses

            # Completed vs pending assignments
            completed_assignments = len([s for s in submissions if s.get("status") == "TURNED_IN"])
            pending_assignments = total_submissions - completed_assignments

            return KPIResponse(
                totalStudents=total_students,
                totalCourses=total_courses,
                totalSubmissions=total_submissions,
                lateSubmissions=late_submissions,
                averageCompletionRate=round(average_completion_rate, 1),
                studentsAtRisk=students_at_risk,
                totalTeachers=total_teachers,
                activeCourses=active_courses,
                completedAssignments=completed_assignments,
                pendingAssignments=pending_assignments,
                onTimeSubmissions=on_time_submissions,
                onTimePercentage=round(on_time_percentage, 1),
                demo_mode=self.demo_mode,
                is_google_data=(self.demo_mode == "google")
            )

        except Exception as e:
            logger.error(f"Error calculating global KPIs: {e}")
            # Return fallback KPIs in case of error
            return KPIResponse(
                totalStudents=0,
                totalCourses=0,
                totalSubmissions=0,
                lateSubmissions=0,
                averageCompletionRate=0.0,
                studentsAtRisk=0,
                totalTeachers=0,
                activeCourses=0,
                completedAssignments=0,
                pendingAssignments=0,
                onTimeSubmissions=0,
                onTimePercentage=0.0,
                demo_mode=self.demo_mode,
                is_google_data=False
            )

    def get_student_dashboard(self, student_id: str) -> StudentDashboard:
        """Get student dashboard data from mock data"""
        try:
            # Find student
            student = None
            for s in self.mock_data["students"]:
                if s.get("user_id") == student_id:
                    student = s
                    break

            if not student:
                raise ValueError(f"Student {student_id} not found")

            # Get student's course
            course = None
            for c in self.mock_data["courses"]:
                if c.get("id") == student.get("course_id"):
                    course = c
                    break

            # Get student submissions
            student_submissions = [
                sub for sub in self.mock_data["submissions"]
                if sub.get("user_id") == student_id
            ]

            # Calculate metrics
            completed_submissions = len([s for s in student_submissions if s.get("status") == "TURNED_IN"])
            late_submissions = len([s for s in student_submissions if s.get("is_late")])
            total_expected = 3  # Mock: 3 assignments per course
            pending_submissions = max(0, total_expected - completed_submissions)

            # Calculate average grade
            graded_submissions = [s for s in student_submissions if s.get("grade")]
            average_grade = sum(s.get("grade", 0) for s in graded_submissions) / len(graded_submissions) if graded_submissions else 0

            # Calculate completion rate
            completion_rate = (completed_submissions / total_expected * 100) if total_expected > 0 else 0

            # Mock upcoming deadlines
            upcoming_deadlines = [
                UpcomingDeadline(
                    assignment_id="assignment_upcoming_1",
                    assignment_title="Proyecto Final Módulo 2",
                    course_name=course.get("name", "Unknown Course") if course else "Unknown Course",
                    due_date="2024-02-15T23:59:59Z",
                    days_remaining=7
                )
            ]

            # Mock recent activity
            recent_activity = [
                RecentActivity(
                    activity_type="submission",
                    assignment_title="Tarea Práctica 1",
                    course_name=course.get("name", "Unknown Course") if course else "Unknown Course",
                    activity_date="2024-01-20T14:30:00Z",
                    status="Entregada a tiempo"
                ),
                RecentActivity(
                    activity_type="grade",
                    assignment_title="Diagnóstico Inicial",
                    course_name=course.get("name", "Unknown Course") if course else "Unknown Course",
                    activity_date="2024-01-18T10:15:00Z",
                    status="Calificada: 85/100"
                )
            ]

            return StudentDashboard(
                student_id=student_id,
                student_name=f"{student.get('profile', {}).get('name', {}).get('given_name', 'Unknown')} {student.get('profile', {}).get('name', {}).get('family_name', 'Student')}",
                myCourses=1,  # Mock: 1 course per student
                completedSubmissions=completed_submissions,
                pendingSubmissions=pending_submissions,
                averageGrade=round(average_grade, 1),
                completionRate=round(completion_rate, 1),
                lateSubmissions=late_submissions,
                upcomingDeadlines=upcoming_deadlines,
                recentActivity=recent_activity,
                isAtRisk=completion_rate < 50 or average_grade < 60,
                demo_mode=self.demo_mode
            )

        except Exception as e:
            logger.error(f"Error getting student dashboard for {student_id}: {e}")
            raise ValueError(f"Failed to generate student dashboard: {e}")

    def get_teacher_dashboard(self, teacher_id: str) -> TeacherDashboard:
        """Get teacher dashboard data from mock data"""
        try:
            # In mock data, assume teacher_id corresponds to a course owner
            teacher_courses = []
            for course in self.mock_data["courses"]:
                if teacher_id in course.get("owner_id", ""):
                    teacher_courses.append(course)

            if not teacher_courses:
                # Mock: assign first course to any teacher
                teacher_courses = [self.mock_data["courses"][0]] if self.mock_data["courses"] else []

            # Calculate metrics
            my_classes = len(teacher_courses)
            total_students = 0
            pending_grading = 0
            all_grades = []

            for course in teacher_courses:
                # Count students in this course
                course_students = [s for s in self.mock_data["students"] if s.get("course_id") == course.get("id")]
                total_students += len(course_students)

                # Count pending grading (submissions without grades)
                course_submissions = [s for s in self.mock_data["submissions"] if s.get("course_id") == course.get("id")]
                pending_grading += len([s for s in course_submissions if not s.get("grade")])

                # Collect all grades
                all_grades.extend([s.get("grade", 0) for s in course_submissions if s.get("grade")])

            average_class_grade = sum(all_grades) / len(all_grades) if all_grades else 0

            # Mock student progress summary
            student_progress = [
                {"student_name": "Ana Martínez", "completion_rate": 85, "average_grade": 87, "status": "En buen estado"},
                {"student_name": "Pedro López", "completion_rate": 60, "average_grade": 72, "status": "Requiere atención"}
            ]

            # Mock upcoming deadlines
            upcoming_deadlines = [
                UpcomingDeadline(
                    assignment_id="assignment_teacher_1",
                    assignment_title="Entrega Final Módulo 1",
                    course_name=teacher_courses[0].get("name", "Unknown Course") if teacher_courses else "Unknown Course",
                    due_date="2024-02-10T23:59:59Z",
                    days_remaining=5
                )
            ]

            return TeacherDashboard(
                teacher_id=teacher_id,
                teacher_name=f"Profesor {teacher_id}",
                myClasses=my_classes,
                totalStudents=total_students,
                pendingGrading=pending_grading,
                averageClassGrade=round(average_class_grade, 1),
                studentProgress=student_progress,
                upcomingDeadlines=upcoming_deadlines,
                demo_mode=self.demo_mode
            )

        except Exception as e:
            logger.error(f"Error getting teacher dashboard for {teacher_id}: {e}")
            raise ValueError(f"Failed to generate teacher dashboard: {e}")

    def get_coordinator_dashboard(self, coordinator_id: str) -> CoordinatorDashboard:
        """Get coordinator dashboard data from mock data"""
        try:
            # Calculate global metrics for coordinator view
            total_cohorts = len(set(s.get("course_id") for s in self.mock_data["students"]))
            total_students = len(self.mock_data["students"])
            total_teachers = len(self.mock_data["courses"])  # Assume 1 teacher per course

            # Calculate average progress
            all_completion_rates = []
            for student in self.mock_data["students"]:
                student_submissions = [s for s in self.mock_data["submissions"] if s.get("user_id") == student.get("user_id")]
                completion_rate = (len(student_submissions) / 3 * 100)  # 3 assignments expected
                all_completion_rates.append(completion_rate)

            average_cohort_progress = sum(all_completion_rates) / len(all_completion_rates) if all_completion_rates else 0
            cohorts_at_risk = len([rate for rate in all_completion_rates if rate < 50])

            # Mock upcoming milestones
            upcoming_milestones = [
                {"milestone": "Fin Módulo 1", "date": "2024-02-15", "courses_affected": 2},
                {"milestone": "Evaluaciones Finales", "date": "2024-03-01", "courses_affected": 2}
            ]

            return CoordinatorDashboard(
                coordinator_id=coordinator_id,
                coordinator_name=f"Coordinador {coordinator_id}",
                totalCohorts=total_cohorts,
                totalStudents=total_students,
                totalTeachers=total_teachers,
                averageCohortProgress=round(average_cohort_progress, 1),
                cohortsAtRisk=cohorts_at_risk,
                upcomingMilestones=upcoming_milestones,
                demo_mode=self.demo_mode
            )

        except Exception as e:
            logger.error(f"Error getting coordinator dashboard for {coordinator_id}: {e}")
            raise ValueError(f"Failed to generate coordinator dashboard: {e}")

    def get_admin_dashboard(self, admin_id: str) -> AdminDashboard:
        """Get admin dashboard data from mock data"""
        try:
            # Global system metrics
            total_institutions = 1  # Mock: single institution
            total_coordinators = 2  # Mock: 2 coordinators (one per specialization)
            total_teachers = len(self.mock_data["courses"])
            total_students = len(self.mock_data["students"])

            # System health metrics
            system_health = {
                "api_status": "healthy",
                "database_status": "healthy",
                "response_time_ms": 45,
                "uptime_hours": 168,
                "active_users": total_students + total_teachers
            }

            # Recent alerts
            recent_alerts = [
                {"type": "warning", "message": "2 estudiantes con entregas tardías", "timestamp": "2024-01-20T15:30:00Z"},
                {"type": "info", "message": "Nuevo módulo disponible", "timestamp": "2024-01-19T09:00:00Z"}
            ]

            return AdminDashboard(
                admin_id=admin_id,
                admin_name=f"Administrador {admin_id}",
                totalInstitutions=total_institutions,
                totalCoordinators=total_coordinators,
                totalTeachers=total_teachers,
                totalStudents=total_students,
                systemHealth=system_health,
                recentAlerts=recent_alerts,
                demo_mode=self.demo_mode
            )

        except Exception as e:
            logger.error(f"Error getting admin dashboard for {admin_id}: {e}")
            raise ValueError(f"Failed to generate admin dashboard: {e}")

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
