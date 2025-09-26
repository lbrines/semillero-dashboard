from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from ..services.base import BaseDataDriver
from .dependencies import get_data_driver

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

@router.get("/teachers/{email}/courses-google")
async def get_teacher_courses_google(
    email: str,
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener cursos de un profesor desde Google Classroom (WOW opcional)"""
    # Por ahora, redirigir al modo MOCK
    return await get_teacher_courses(email, data_driver)
