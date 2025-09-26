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


class ChartDataPoint(BaseModel):
    """Model for chart data points"""
    name: str = Field(..., description="Cohort or category name")
    onTime: int = Field(..., description="On-time submissions count")
    late: int = Field(..., description="Late submissions count")
    percentage: float = Field(..., description="On-time percentage")


class TrendsData(BaseModel):
    """Model for trends data over time"""
    period: str = Field(..., description="Time period (week, month)")
    onTimeSubmissions: int = Field(..., description="On-time submissions in period")
    lateSubmissions: int = Field(..., description="Late submissions in period")
    totalSubmissions: int = Field(..., description="Total submissions in period")


class ReportCohortProgressResponse(BaseModel):
    """Response model for cohort progress reports"""
    cohorts: List[ReportCohortProgress] = Field(..., description="List of cohort progress reports")
    total_cohorts: int = Field(..., description="Total number of cohorts")
    page_size: int = Field(..., description="Page size for pagination")
    page_token: Optional[str] = Field(None, description="Token for next page")
    has_next_page: bool = Field(..., description="Indicates if there are more pages")
    chartData: List[ChartDataPoint] = Field(..., description="Data formatted for Tremor charts")
    trends: List[TrendsData] = Field(..., description="Trends data over time periods")
    summary: dict = Field(..., description="Summary statistics for dashboard")


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


class KPIResponse(BaseModel):
    """Model for global KPIs response"""
    totalStudents: int = Field(..., description="Total number of students")
    totalCourses: int = Field(..., description="Total number of active courses")
    totalSubmissions: int = Field(..., description="Total number of submissions")
    lateSubmissions: int = Field(..., description="Total number of late submissions")
    averageCompletionRate: float = Field(..., description="Average completion rate percentage")
    studentsAtRisk: int = Field(..., description="Number of students at risk (completion rate < 50%)")
    totalTeachers: int = Field(..., description="Total number of teachers")
    activeCourses: int = Field(..., description="Number of active courses")
    completedAssignments: int = Field(..., description="Total number of completed assignments")
    pendingAssignments: int = Field(..., description="Total number of pending assignments")
    onTimeSubmissions: int = Field(..., description="Total number of on-time submissions")
    onTimePercentage: float = Field(..., description="On-time submissions percentage")
    demo_mode: str = Field(..., description="Current demo mode (mock or google)")
    is_google_data: bool = Field(default=False, description="Indicates if data comes from Google Classroom API")


class UpcomingDeadline(BaseModel):
    """Model for upcoming assignment deadlines"""
    assignment_id: str = Field(..., description="Assignment identifier")
    assignment_title: str = Field(..., description="Assignment title")
    course_name: str = Field(..., description="Course name")
    due_date: str = Field(..., description="Due date in ISO format")
    days_remaining: int = Field(..., description="Days remaining until deadline")


class RecentActivity(BaseModel):
    """Model for recent student activity"""
    activity_type: str = Field(..., description="Type of activity (submission, grade, etc.)")
    assignment_title: str = Field(..., description="Assignment title")
    course_name: str = Field(..., description="Course name")
    activity_date: str = Field(..., description="Activity date in ISO format")
    status: str = Field(..., description="Activity status")


class StudentDashboard(BaseModel):
    """Model for student dashboard response"""
    student_id: str = Field(..., description="Student identifier")
    student_name: str = Field(..., description="Student full name")
    myCourses: int = Field(..., description="Number of enrolled courses")
    completedSubmissions: int = Field(..., description="Number of completed submissions")
    pendingSubmissions: int = Field(..., description="Number of pending submissions")
    averageGrade: float = Field(..., description="Average grade across all assignments")
    completionRate: float = Field(..., description="Overall completion rate percentage")
    lateSubmissions: int = Field(..., description="Number of late submissions")
    upcomingDeadlines: List[UpcomingDeadline] = Field(..., description="List of upcoming deadlines")
    recentActivity: List[RecentActivity] = Field(..., description="List of recent activities")
    isAtRisk: bool = Field(..., description="Whether student is at academic risk")
    demo_mode: str = Field(..., description="Current demo mode (mock or google)")


class TeacherDashboard(BaseModel):
    """Model for teacher dashboard response"""
    teacher_id: str = Field(..., description="Teacher identifier")
    teacher_name: str = Field(..., description="Teacher full name")
    myClasses: int = Field(..., description="Number of classes taught")
    totalStudents: int = Field(..., description="Total number of students across all classes")
    pendingGrading: int = Field(..., description="Number of submissions pending grading")
    averageClassGrade: float = Field(..., description="Average grade across all classes")
    studentProgress: List[dict] = Field(..., description="Progress summary of students")
    upcomingDeadlines: List[UpcomingDeadline] = Field(..., description="List of upcoming assignment deadlines")
    demo_mode: str = Field(..., description="Current demo mode (mock or google)")


class StudentProgress(BaseModel):
    """Model for student progress in coordinator dashboard"""
    name: str = Field(..., description="Student name")
    course: str = Field(..., description="Course name")
    completionRate: int = Field(..., description="Completion rate percentage")
    averageGrade: float = Field(..., description="Average grade")
    status: str = Field(..., description="Student status")

class CoordinatorDashboard(BaseModel):
    """Model for coordinator dashboard response"""
    coordinator_id: str = Field(..., description="Coordinator identifier")
    coordinator_name: str = Field(..., description="Coordinator full name")
    totalCohorts: int = Field(..., description="Total number of cohorts managed")
    totalStudents: int = Field(..., description="Total students across all cohorts")
    totalTeachers: int = Field(..., description="Total teachers managed")
    averageCohortProgress: float = Field(..., description="Average progress across all cohorts")
    cohortsAtRisk: int = Field(..., description="Number of cohorts requiring attention")
    completionRate: float = Field(..., description="Overall completion rate")
    punctualityRate: float = Field(..., description="Overall punctuality rate")
    studentsAtRisk: int = Field(..., description="Number of students at risk")
    averageGrade: float = Field(..., description="Average grade across all students")
    studentProgress: List[StudentProgress] = Field(..., description="List of student progress data")
    upcomingMilestones: List[dict] = Field(..., description="List of upcoming milestones")
    demo_mode: str = Field(..., description="Current demo mode (mock or google)")


class AdminDashboard(BaseModel):
    """Model for admin dashboard response"""
    admin_id: str = Field(..., description="Admin identifier")
    admin_name: str = Field(..., description="Admin full name")
    totalInstitutions: int = Field(..., description="Total institutions managed")
    totalCoordinators: int = Field(..., description="Total coordinators")
    totalTeachers: int = Field(..., description="Total teachers")
    totalStudents: int = Field(..., description="Total students")
    systemHealth: dict = Field(..., description="System health metrics")
    recentAlerts: List[dict] = Field(..., description="Recent system alerts")
    demo_mode: str = Field(..., description="Current demo mode (mock or google)")


class OverviewStats(BaseModel):
    """Model for overview statistics"""
    retentionRate: float = Field(..., description="Student retention rate percentage")
    completionRate: float = Field(..., description="Course completion rate percentage")
    averageGrade: float = Field(..., description="Average grade across all courses")
    studentsAtRisk: int = Field(..., description="Number of students at risk")
    totalActiveCourses: int = Field(..., description="Total number of active courses")
    totalStudents: int = Field(..., description="Total number of students")
    totalTeachers: int = Field(..., description="Total number of teachers")
    totalSubmissions: int = Field(..., description="Total number of submissions")
    lateSubmissions: int = Field(..., description="Number of late submissions")
    averageCompletionTime: float = Field(..., description="Average completion time in days")
    demo_mode: Optional[str] = Field(None, description="Current demo mode (mock or google)")
