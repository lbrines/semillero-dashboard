from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from ..services.base import BaseDataDriver
from .dependencies import get_data_driver
from ..models.course import CourseListResponse, Course

router = APIRouter()

@router.get("/courses", response_model=CourseListResponse)
async def get_courses(
    page_size: int = Query(10, ge=1, le=100, description="Número de cursos por página"),
    page_token: Optional[str] = Query(None, description="Token para siguiente página"),
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener lista de cursos con paginación"""
    try:
        result = await data_driver.get_courses(page_size=page_size, page_token=page_token)
        return CourseListResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching courses: {str(e)}")

@router.get("/courses/{course_id}", response_model=Course)
async def get_course(
    course_id: str,
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener un curso específico"""
    try:
        course = await data_driver.get_course(course_id)
        if course is None:
            raise HTTPException(status_code=404, detail="Course not found")
        return Course(**course)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching course: {str(e)}")


# LECCIÓN APRENDIDA: Endpoints RESTful con validación
# - Validación de parámetros con Query
# - Manejo de errores HTTP específicos
# - Modelos Pydantic para validación de respuesta
# - Dependency injection para driver de datos
