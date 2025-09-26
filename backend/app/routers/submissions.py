from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from ..services.base import BaseDataDriver
from .dependencies import get_data_driver
from ..models.submission import StudentSubmissionListResponse

router = APIRouter()

@router.get("/courses/{course_id}/coursework/{coursework_id}/submissions", response_model=StudentSubmissionListResponse)
async def get_submissions(
    course_id: str,
    coursework_id: str,
    page_size: int = Query(10, ge=1, le=100, description="Número de entregas por página"),
    page_token: Optional[str] = Query(None, description="Token para siguiente página"),
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener entregas de estudiantes para un trabajo específico"""
    try:
        result = await data_driver.get_submissions(course_id, coursework_id, page_size=page_size, page_token=page_token)
        return StudentSubmissionListResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching submissions: {str(e)}")


# LECCIÓN APRENDIDA: Endpoints para entregas de estudiantes
# - Ruta anidada para relación curso-trabajo-entregas
# - Validación de múltiples parámetros de ruta
# - Manejo de errores específicos
