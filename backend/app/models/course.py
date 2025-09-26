from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class Course(BaseModel):
    """Modelo para Course de Google Classroom API"""
    id: str = Field(..., description="ID único del curso")
    name: str = Field(..., description="Nombre del curso")
    section: Optional[str] = Field(None, description="Sección del curso")
    description_heading: Optional[str] = Field(None, description="Encabezado de descripción")
    description: Optional[str] = Field(None, description="Descripción del curso")
    room: Optional[str] = Field(None, description="Aula del curso")
    owner_id: str = Field(..., description="ID del propietario del curso")
    creation_time: datetime = Field(..., description="Fecha de creación")
    update_time: datetime = Field(..., description="Fecha de última actualización")
    enrollment_code: Optional[str] = Field(None, description="Código de inscripción")
    course_state: str = Field(..., description="Estado del curso")
    alternate_link: Optional[str] = Field(None, description="Enlace alternativo")
    teacher_group_email: Optional[str] = Field(None, description="Email del grupo de profesores")
    course_group_email: Optional[str] = Field(None, description="Email del grupo del curso")
    teacher_folder: Optional[dict] = Field(None, description="Carpeta del profesor")
    course_material_sets: Optional[List[dict]] = Field(None, description="Conjuntos de material del curso")
    guardians_enabled: Optional[bool] = Field(None, description="Guardianes habilitados")
    calendar_id: Optional[str] = Field(None, description="ID del calendario")
    gradebook_settings: Optional[dict] = Field(None, description="Configuración del libro de calificaciones")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class CourseListResponse(BaseModel):
    """Respuesta para lista de cursos"""
    courses: List[Course] = Field(..., description="Lista de cursos")
    next_page_token: Optional[str] = Field(None, description="Token para siguiente página")
    total_items: Optional[int] = Field(None, description="Total de elementos")


# LECCIÓN APRENDIDA: Modelos Pydantic alineados 1:1 con Google Classroom API
# - Campos opcionales marcados como Optional
# - Validación automática de tipos
# - Documentación integrada con Field descriptions
# - Configuración para serialización de datetime
