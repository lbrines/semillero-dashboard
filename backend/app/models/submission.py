from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class StudentSubmission(BaseModel):
    """Modelo para StudentSubmission de Google Classroom API"""
    id: str = Field(..., description="ID único de la entrega")
    course_id: str = Field(..., description="ID del curso")
    course_work_id: str = Field(..., description="ID del trabajo de curso")
    user_id: str = Field(..., description="ID del usuario")
    creation_time: datetime = Field(..., description="Fecha de creación")
    update_time: datetime = Field(..., description="Fecha de última actualización")
    state: str = Field(..., description="Estado de la entrega")
    late: Optional[bool] = Field(None, description="Entrega tardía")
    draft_grade: Optional[float] = Field(None, description="Calificación borrador")
    assigned_grade: Optional[float] = Field(None, description="Calificación asignada")
    alternate_link: Optional[str] = Field(None, description="Enlace alternativo")
    course_work_type: Optional[str] = Field(None, description="Tipo de trabajo de curso")
    associated_with_developer: Optional[bool] = Field(None, description="Asociado con desarrollador")
    submission_history: Optional[List[dict]] = Field(None, description="Historial de envíos")
    short_answer_submission: Optional[dict] = Field(None, description="Envío de respuesta corta")
    multiple_choice_submission: Optional[dict] = Field(None, description="Envío de opción múltiple")
    attachment: Optional[List[dict]] = Field(None, description="Adjuntos")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class StudentSubmissionListResponse(BaseModel):
    """Respuesta para lista de entregas de estudiantes"""
    student_submissions: List[StudentSubmission] = Field(..., description="Lista de entregas")
    next_page_token: Optional[str] = Field(None, description="Token para siguiente página")
    total_items: Optional[int] = Field(None, description="Total de elementos")


# LECCIÓN APRENDIDA: Modelos para tracking de entregas y calificaciones
# - Validación de estados de entrega
# - Campos para calificaciones y fechas
# - Historial de envíos para auditoría
