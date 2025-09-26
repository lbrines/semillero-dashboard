from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from ..services.base import BaseDataDriver
from .dependencies import get_data_driver
from ..models.coursework import CourseWorkListResponse

router = APIRouter()

@router.get("/courses/{course_id}/coursework", response_model=CourseWorkListResponse)
async def get_coursework(
    course_id: str,
    page_size: int = Query(10, ge=1, le=100, description="Número de trabajos por página"),
    page_token: Optional[str] = Query(None, description="Token para siguiente página"),
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener trabajos de curso específico"""
    try:
        result = await data_driver.get_coursework(course_id, page_size=page_size, page_token=page_token)
        return CourseWorkListResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching coursework: {str(e)}")


# LECCIÓN APRENDIDA: Endpoints para trabajos de curso
# - Ruta anidada para relación curso-trabajos
# - Validación de paginación
# - Respuesta estructurada con modelos Pydantic
