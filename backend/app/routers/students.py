from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from ..services.base import BaseDataDriver
from .dependencies import get_data_driver
from ..models.student import StudentListResponse

router = APIRouter()

@router.get("/courses/{course_id}/students", response_model=StudentListResponse)
async def get_students(
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


# LECCIÓN APRENDIDA: Endpoints anidados para relaciones
# - Ruta /courses/{course_id}/students para relación curso-estudiantes
# - Validación de parámetros de ruta y query
# - Manejo consistente de errores
