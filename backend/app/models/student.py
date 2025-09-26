from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class Student(BaseModel):
    """Modelo para Student de Google Classroom API"""
    user_id: str = Field(..., description="ID único del usuario")
    course_id: str = Field(..., description="ID del curso")
    profile: 'UserProfile' = Field(..., description="Perfil del usuario")
    student_work_folder: Optional[dict] = Field(None, description="Carpeta de trabajo del estudiante")


class UserProfile(BaseModel):
    """Modelo para UserProfile de Google Classroom API"""
    id: str = Field(..., description="ID único del usuario")
    name: 'Name' = Field(..., description="Nombre del usuario")
    email_address: str = Field(..., description="Dirección de email")
    photo_url: Optional[str] = Field(None, description="URL de la foto")
    permissions: Optional[List['Permission']] = Field(None, description="Permisos del usuario")
    verified_teacher: Optional[bool] = Field(None, description="Profesor verificado")


class Name(BaseModel):
    """Modelo para Name de Google Classroom API"""
    given_name: Optional[str] = Field(None, description="Nombre")
    family_name: Optional[str] = Field(None, description="Apellido")
    full_name: Optional[str] = Field(None, description="Nombre completo")


class Permission(BaseModel):
    """Modelo para Permission de Google Classroom API"""
    permission: str = Field(..., description="Tipo de permiso")
    role: Optional[str] = Field(None, description="Rol del usuario")


class StudentListResponse(BaseModel):
    """Respuesta para lista de estudiantes"""
    students: List[Student] = Field(..., description="Lista de estudiantes")
    next_page_token: Optional[str] = Field(None, description="Token para siguiente página")
    total_items: Optional[int] = Field(None, description="Total de elementos")


# LECCIÓN APRENDIDA: Modelos anidados para estructuras complejas de Google Classroom API
# - Referencias forward usando strings para evitar problemas de importación
# - Validación automática de tipos anidados
# - Documentación clara de cada campo
