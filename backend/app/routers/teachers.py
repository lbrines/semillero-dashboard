from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from ..services.base import BaseDataDriver
from .dependencies import get_data_driver
from ..models.reports import TeacherDashboard
from ..services.reports_service import reports_service

router = APIRouter()

class TeacherAuthRequest(BaseModel):
    email: EmailStr

class TeacherAuthResponse(BaseModel):
    email: str
    name: str
    role: str
    courses: List[str]

class TeacherCoursesResponse(BaseModel):
    email: str
    courses: List[dict]

@router.get("/teachers/stats")
async def get_teachers_stats():
    """Obtener estadísticas generales de profesores"""
    return {
        "totalTeachers": 8,
        "activeTeachers": 6,
        "totalCourses": 12,
        "averageStudentsPerTeacher": 25,
        "pendingGrading": 45,
        "averageGrade": 8.2
    }

@router.post("/teachers/identify", response_model=TeacherAuthResponse)
async def identify_teacher(
    request: TeacherAuthRequest,
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Identificar profesor por email (modo MOCK)"""
    try:
        # Lista de profesores autorizados (MOCK)
        authorized_teachers = {
            "profesor1@instituto.edu": {
                "name": "Dr. María González",
                "role": "coordinador",
                "courses": ["ecommerce_001", "marketing_001"]
            },
            "profesor2@instituto.edu": {
                "name": "Prof. Carlos Rodríguez",
                "role": "docente",
                "courses": ["ecommerce_001"]
            },
            "admin@instituto.edu": {
                "name": "Administrador Sistema",
                "role": "administrador",
                "courses": ["ecommerce_001", "marketing_001"]
            },
            "coord@instituto.edu": {
                "name": "Coordinador Académico",
                "role": "coordinador",
                "courses": ["ecommerce_001", "marketing_001"]
            }
        }
        
        email = request.email.lower()
        if email not in authorized_teachers:
            raise HTTPException(
                status_code=403, 
                detail="Email no registrado como profesor autorizado"
            )
        
        teacher_info = authorized_teachers[email]
        
        return TeacherAuthResponse(
            email=email,
            name=teacher_info["name"],
            role=teacher_info["role"],
            courses=teacher_info["courses"]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error identifying teacher: {str(e)}")

@router.get("/teachers/{email}/courses", response_model=TeacherCoursesResponse)
async def get_teacher_courses(
    email: str,
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener cursos de un profesor específico (modo MOCK)"""
    try:
        # Lista de profesores autorizados (MOCK)
        authorized_teachers = {
            "profesor1@instituto.edu": {
                "name": "Dr. María González",
                "role": "coordinador",
                "courses": ["ecommerce_001", "marketing_001"]
            },
            "profesor2@instituto.edu": {
                "name": "Prof. Carlos Rodríguez",
                "role": "docente",
                "courses": ["ecommerce_001"]
            },
            "admin@instituto.edu": {
                "name": "Administrador Sistema",
                "role": "administrador",
                "courses": ["ecommerce_001", "marketing_001"]
            },
            "coord@instituto.edu": {
                "name": "Coordinador Académico",
                "role": "coordinador",
                "courses": ["ecommerce_001", "marketing_001"]
            }
        }
        
        email_lower = email.lower()
        if email_lower not in authorized_teachers:
            raise HTTPException(
                status_code=404, 
                detail="Profesor no encontrado"
            )
        
        teacher_info = authorized_teachers[email_lower]
        course_ids = teacher_info["courses"]
        
        # Obtener información detallada de los cursos
        courses_result = await data_driver.get_courses(page_size=100)
        teacher_courses = []
        
        for course in courses_result.get("courses", []):
            if course["id"] in course_ids:
                teacher_courses.append({
                    "id": course["id"],
                    "name": course["name"],
                    "section": course.get("section", ""),
                    "description": course.get("description", ""),
                    "courseState": course.get("courseState", "ACTIVE")
                })
        
        return TeacherCoursesResponse(
            email=email_lower,
            courses=teacher_courses
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching teacher courses: {str(e)}")

@router.post("/teachers/identify-google")
async def identify_teacher_google(
    request: TeacherAuthRequest,
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Identificar profesor con Google OAuth (WOW opcional)"""
    # Por ahora, redirigir al modo MOCK
    return await identify_teacher(request, data_driver)

@router.get("/teachers/{teacher_id}/dashboard", response_model=TeacherDashboard)
async def get_teacher_dashboard(teacher_id: str):
    """Get comprehensive dashboard data for a specific teacher"""
    try:
        dashboard = reports_service.get_teacher_dashboard(teacher_id)
        return dashboard
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating teacher dashboard: {str(e)}")

@router.get("/teachers/{teacher_id}")
async def get_teacher_by_id(teacher_id: str):
    """Obtener información específica de un profesor por ID"""
    try:
        # Mock data para profesores
        teachers_data = {
            "teacher_1": {
                "teacher_id": "teacher_1",
                "name": "Dr. María González",
                "email": "profesor1@instituto.edu",
                "role": "coordinador",
                "courses": ["ecommerce_001", "marketing_001"],
                "active": True
            },
            "teacher_2": {
                "teacher_id": "teacher_2",
                "name": "Prof. Carlos Rodríguez",
                "email": "profesor2@instituto.edu",
                "role": "docente",
                "courses": ["ecommerce_001"],
                "active": True
            },
            "admin_1": {
                "teacher_id": "admin_1",
                "name": "Administrador Sistema",
                "email": "admin@instituto.edu",
                "role": "administrador",
                "courses": ["ecommerce_001", "marketing_001"],
                "active": True
            },
            "coord_1": {
                "teacher_id": "coord_1",
                "name": "Coordinador Académico",
                "email": "coord@instituto.edu",
                "role": "coordinador",
                "courses": ["ecommerce_001", "marketing_001"],
                "active": True
            }
        }
        
        if teacher_id not in teachers_data:
            raise HTTPException(status_code=404, detail="Teacher not found")
        
        return teachers_data[teacher_id]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching teacher: {str(e)}")

@router.get("/teachers/{email}/courses-google")
async def get_teacher_courses_google(
    email: str,
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener cursos de un profesor desde Google Classroom (WOW opcional)"""
    # Por ahora, redirigir al modo MOCK
    return await get_teacher_courses(email, data_driver)
