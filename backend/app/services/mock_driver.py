import json
import os
from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta
import random
from .base import BaseDataDriver


class MockDataDriver(BaseDataDriver):
    """Driver MOCK para datos de prueba"""
    
    def __init__(self):
        super().__init__()
        self.data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'mock')
        self._load_mock_data()
    
    def _load_mock_data(self):
        """Cargar datos MOCK desde archivos JSON"""
        try:
            # Cargar cursos
            with open(os.path.join(self.data_dir, 'courses.json'), 'r', encoding='utf-8') as f:
                self.courses = json.load(f)
            
            # Cargar estudiantes
            with open(os.path.join(self.data_dir, 'students.json'), 'r', encoding='utf-8') as f:
                self.students = json.load(f)
            
            # Cargar trabajos de curso
            with open(os.path.join(self.data_dir, 'coursework.json'), 'r', encoding='utf-8') as f:
                self.coursework = json.load(f)
            
            # Cargar entregas
            with open(os.path.join(self.data_dir, 'submissions.json'), 'r', encoding='utf-8') as f:
                self.submissions = json.load(f)
            
            # Cargar perfiles de usuario
            with open(os.path.join(self.data_dir, 'user_profiles.json'), 'r', encoding='utf-8') as f:
                self.user_profiles = json.load(f)
                
        except FileNotFoundError as e:
            print(f"Warning: Mock data file not found: {e}")
            # Inicializar con datos vacíos si no existen archivos
            self.courses = []
            self.students = []
            self.coursework = []
            self.submissions = []
            self.user_profiles = []
    
    async def get_courses(self, page_size: int = 10, page_token: Optional[str] = None) -> Dict[str, Any]:
        """Obtener lista de cursos con paginación"""
        start_index = 0
        if page_token:
            try:
                start_index = int(page_token)
            except ValueError:
                start_index = 0
        
        end_index = start_index + page_size
        courses_page = self.courses[start_index:end_index]
        
        next_page_token = None
        if end_index < len(self.courses):
            next_page_token = str(end_index)
        
        return {
            'courses': courses_page,
            'next_page_token': next_page_token,
            'total_items': len(self.courses)
        }
    
    async def get_course(self, course_id: str) -> Dict[str, Any]:
        """Obtener un curso específico"""
        for course in self.courses:
            if course['id'] == course_id:
                return course
        return None
    
    async def get_students(self, course_id: str, page_size: int = 10, page_token: Optional[str] = None) -> Dict[str, Any]:
        """Obtener estudiantes de un curso con paginación"""
        course_students = [s for s in self.students if s['course_id'] == course_id]
        
        # Mapear campos para compatibilidad con modelos Pydantic
        mapped_students = []
        for student in course_students:
            mapped_student = {
                'user_id': student['user_id'],
                'course_id': student['course_id'],
                'profile': {
                    'id': student['profile']['id'],
                    'name': {
                        'given_name': student['profile']['name']['given_name'],
                        'family_name': student['profile']['name']['family_name'],
                        'full_name': student['profile']['name']['full_name']
                    },
                    'email_address': student['profile']['email_address'],
                    'photo_url': student['profile']['photo_url'],
                    'verified_teacher': student['profile']['verified_teacher']
                }
            }
            mapped_students.append(mapped_student)
        
        start_index = 0
        if page_token:
            try:
                start_index = int(page_token)
            except ValueError:
                start_index = 0
        
        end_index = start_index + page_size
        students_page = mapped_students[start_index:end_index]
        
        next_page_token = None
        if end_index < len(mapped_students):
            next_page_token = str(end_index)
        
        return {
            'students': students_page,
            'next_page_token': next_page_token,
            'total_items': len(mapped_students)
        }
    
    async def get_coursework(self, course_id: str, page_size: int = 10, page_token: Optional[str] = None) -> Dict[str, Any]:
        """Obtener trabajos de curso con paginación"""
        course_work = [cw for cw in self.coursework if cw['course_id'] == course_id]
        
        start_index = 0
        if page_token:
            try:
                start_index = int(page_token)
            except ValueError:
                start_index = 0
        
        end_index = start_index + page_size
        coursework_page = course_work[start_index:end_index]
        
        next_page_token = None
        if end_index < len(course_work):
            next_page_token = str(end_index)
        
        return {
            'course_work': coursework_page,
            'next_page_token': next_page_token,
            'total_items': len(course_work)
        }
    
    async def get_submissions(self, course_id: str, coursework_id: str, page_size: int = 10, page_token: Optional[str] = None) -> Dict[str, Any]:
        """Obtener entregas de estudiantes con paginación"""
        course_submissions = [s for s in self.submissions if s['course_id'] == course_id and s['course_work_id'] == coursework_id]
        
        start_index = 0
        if page_token:
            try:
                start_index = int(page_token)
            except ValueError:
                start_index = 0
        
        end_index = start_index + page_size
        submissions_page = course_submissions[start_index:end_index]
        
        next_page_token = None
        if end_index < len(course_submissions):
            next_page_token = str(end_index)
        
        return {
            'student_submissions': submissions_page,
            'next_page_token': next_page_token,
            'total_items': len(course_submissions)
        }
    
    async def get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """Obtener perfil de usuario"""
        for profile in self.user_profiles:
            if profile['id'] == user_id:
                return profile
        return None


# LECCIÓN APRENDIDA: Driver MOCK con paginación realista
# - Carga de datos desde archivos JSON
# - Paginación consistente con Google Classroom API
# - Manejo de errores para archivos faltantes
# - Filtrado por course_id para relaciones
