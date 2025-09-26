from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CourseWork(BaseModel):
    """Modelo para CourseWork de Google Classroom API"""
    id: str = Field(..., description="ID único del trabajo de curso")
    title: str = Field(..., description="Título del trabajo")
    description: Optional[str] = Field(None, description="Descripción del trabajo")
    materials: Optional[List[dict]] = Field(None, description="Materiales del trabajo")
    state: str = Field(..., description="Estado del trabajo")
    alternate_link: Optional[str] = Field(None, description="Enlace alternativo")
    creation_time: datetime = Field(..., description="Fecha de creación")
    update_time: datetime = Field(..., description="Fecha de última actualización")
    due_date: Optional[datetime] = Field(None, description="Fecha de entrega")
    due_time: Optional[str] = Field(None, description="Hora de entrega")
    scheduled_time: Optional[datetime] = Field(None, description="Hora programada")
    max_points: Optional[float] = Field(None, description="Puntos máximos")
    work_type: str = Field(..., description="Tipo de trabajo")
    associated_with_developer: Optional[bool] = Field(None, description="Asociado con desarrollador")
    assignee_mode: Optional[str] = Field(None, description="Modo de asignación")
    individual_students_options: Optional[dict] = Field(None, description="Opciones de estudiantes individuales")
    submission_modification_mode: Optional[str] = Field(None, description="Modo de modificación de envío")
    creator_user_id: Optional[str] = Field(None, description="ID del usuario creador")
    topic_id: Optional[str] = Field(None, description="ID del tema")
    grade_category: Optional[dict] = Field(None, description="Categoría de calificación")
    assignment: Optional[dict] = Field(None, description="Asignación")
    multiple_choice_question: Optional[dict] = Field(None, description="Pregunta de opción múltiple")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class CourseWorkListResponse(BaseModel):
    """Respuesta para lista de trabajos de curso"""
    course_work: List[CourseWork] = Field(..., description="Lista de trabajos de curso")
    next_page_token: Optional[str] = Field(None, description="Token para siguiente página")
    total_items: Optional[int] = Field(None, description="Total de elementos")


# LECCIÓN APRENDIDA: Modelos complejos con múltiples campos opcionales
# - Validación automática de tipos datetime
# - Configuración para serialización JSON
# - Documentación detallada de cada campo
