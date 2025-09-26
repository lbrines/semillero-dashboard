from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from ..services.base import BaseDataDriver
from .dependencies import get_data_driver
from ..models.student import StudentListResponse, Student
from ..models.reports import StudentDashboard
from ..services.reports_service import reports_service

router = APIRouter()

@router.get("/students", response_model=StudentListResponse)
async def get_all_students(
    page_size: int = Query(10, ge=1, le=100, description="Número de estudiantes por página"),
    page_token: Optional[str] = Query(None, description="Token para siguiente página"),
    course_id: Optional[str] = Query(None, description="Filtrar por curso"),
    search: Optional[str] = Query(None, description="Buscar por nombre o email"),
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener todos los estudiantes con filtros opcionales"""
    try:
        # Para el driver mock, obtenemos todos los estudiantes de todos los cursos
        all_students = []
        courses_result = await data_driver.get_courses(page_size=100)
        
        for course in courses_result.get("courses", []):
            students_result = await data_driver.get_students(course["id"], page_size=100)
            for student in students_result.get("students", []):
                # Agregar información del curso al estudiante
                student["courseId"] = course["id"]
                student["courseName"] = course["name"]
                all_students.append(student)
        
        # Aplicar filtros
        if course_id:
            all_students = [s for s in all_students if s.get("course_id") == course_id]
        
        if search:
            search_lower = search.lower()
            all_students = [s for s in all_students if 
                          (s.get("profile", {}).get("name", {}).get("given_name", "").lower().find(search_lower) != -1) or
                          (s.get("profile", {}).get("name", {}).get("family_name", "").lower().find(search_lower) != -1) or
                          (s.get("profile", {}).get("email_address", "").lower().find(search_lower) != -1)]
        
        # Aplicar paginación
        start_idx = 0
        if page_token:
            try:
                start_idx = int(page_token)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid page token")
        
        end_idx = start_idx + page_size
        paginated_students = all_students[start_idx:end_idx]
        
        next_page_token = str(end_idx) if end_idx < len(all_students) else None
        
        return StudentListResponse(
            students=paginated_students,
            nextPageToken=next_page_token
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching students: {str(e)}")

@router.get("/students/{student_id}", response_model=Student)
async def get_student(
    student_id: str,
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener un estudiante específico por ID"""
    try:
        # Buscar el estudiante en todos los cursos
        courses_result = await data_driver.get_courses(page_size=100)
        
        for course in courses_result.get("courses", []):
            students_result = await data_driver.get_students(course["id"], page_size=100)
            for student in students_result.get("students", []):
                if student.get("user_id") == student_id:
                    return Student(**student)
        
        raise HTTPException(status_code=404, detail="Student not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching student: {str(e)}")

@router.get("/students/{student_id}/progress")
async def get_student_progress(
    student_id: str,
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener progreso de un estudiante específico"""
    try:
        # Buscar el estudiante
        student = None
        course_id = None
        courses_result = await data_driver.get_courses(page_size=100)
        
        for course in courses_result.get("courses", []):
            students_result = await data_driver.get_students(course["id"], page_size=100)
            for s in students_result.get("students", []):
                if s.get("user_id") == student_id:
                    student = s
                    course_id = course["id"]
                    break
            if student:
                break
        
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Obtener submissions del estudiante
        coursework_result = await data_driver.get_coursework(course_id, page_size=100)
        total_assignments = len(coursework_result.get("courseWork", []))
        
        completed_assignments = 0
        late_submissions = 0
        total_grade = 0
        graded_count = 0
        
        for assignment in coursework_result.get("courseWork", []):
            submissions_result = await data_driver.get_submissions(
                course_id, 
                assignment["id"], 
                page_size=100
            )
            
            for submission in submissions_result.get("studentSubmissions", []):
                if submission.get("user_id") == student_id:
                    if submission.get("state") == "TURNED_IN":
                        completed_assignments += 1
                        if submission.get("late"):
                            late_submissions += 1
                        
                        # Calcular promedio de calificaciones
                        if "assignedGrade" in submission and submission["assignedGrade"] is not None:
                            total_grade += submission["assignedGrade"]
                            graded_count += 1
        
        average_grade = total_grade / graded_count if graded_count > 0 else 0
        completion_rate = (completed_assignments / total_assignments * 100) if total_assignments > 0 else 0
        
        return {
            "studentId": student_id,
            "totalAssignments": total_assignments,
            "completedAssignments": completed_assignments,
            "completionRate": round(completion_rate, 1),
            "averageGrade": round(average_grade, 1),
            "lateSubmissions": late_submissions,
            "onTimeSubmissions": completed_assignments - late_submissions,
            "isAtRisk": completion_rate < 50 or average_grade < 60
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching student progress: {str(e)}")

@router.get("/courses/{course_id}/students", response_model=StudentListResponse)
async def get_students_by_course(
    course_id: str,
    page_size: int = Query(10, ge=1, le=100, description="Número de estudiantes por página"),
    page_token: Optional[str] = Query(None, description="Token para siguiente página"),
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener estudiantes de un curso específico"""
    try:
        result = await data_driver.get_students(course_id, page_size=page_size, page_token=page_token)
        return StudentListResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching students: {str(e)}")

@router.get("/students/{student_id}/dashboard", response_model=StudentDashboard)
async def get_student_dashboard(student_id: str):
    """Get comprehensive dashboard data for a specific student"""
    try:
        dashboard = reports_service.get_student_dashboard(student_id)
        return dashboard
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating student dashboard: {str(e)}")


@router.get("/students/stats")
async def get_student_stats():
    """Obtener estadísticas de un estudiante específico - DEPRECATED: Use /students/{id}/dashboard instead"""
    return {
        "myCourses": 2,
        "completedSubmissions": 8,
        "pendingSubmissions": 3,
        "averageGrade": 8.5,
        "completionRate": 75.0,
        "lateSubmissions": 1
    }


# LECCIÓN APRENDIDA: Endpoints anidados para relaciones
# - Ruta /courses/{course_id}/students para relación curso-estudiantes
# - Validación de parámetros de ruta y query
# - Manejo consistente de errores
