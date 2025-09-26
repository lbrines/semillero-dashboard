import os
from typing import Any, Dict, List, Optional
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from .base import BaseDataDriver


class GoogleDataDriver(BaseDataDriver):
    """Driver GOOGLE para Google Classroom API"""
    
    def __init__(self):
        super().__init__()
        self.scopes = [
            'https://www.googleapis.com/auth/classroom.courses.readonly',
            'https://www.googleapis.com/auth/classroom.rosters.readonly',
            'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
            'https://www.googleapis.com/auth/classroom.profile.emails'
        ]
        self.service = None
        self._authenticate()
    
    def _authenticate(self):
        """Autenticar con Google Classroom API"""
        try:
            # Cargar credenciales desde archivo
            credentials_file = os.getenv('GOOGLE_CREDENTIALS_FILE', 'credentials.json')
            tokens_file = os.getenv('TOKENS_FILE', 'tokens.json')
            
            if os.path.exists(tokens_file):
                creds = Credentials.from_authorized_user_file(tokens_file, self.scopes)
            
            if not creds or not creds.valid:
                if creds and creds.expired and creds.refresh_token:
                    creds.refresh(Request())
                else:
                    flow = Flow.from_client_secrets_file(credentials_file, self.scopes)
                    creds = flow.run_local_server(port=0)
                
                # Guardar credenciales para la próxima vez
                with open(tokens_file, 'w') as token:
                    token.write(creds.to_json())
            
            self.service = build('classroom', 'v1', credentials=creds)
            
        except Exception as e:
            print(f"Error authenticating with Google Classroom API: {e}")
            self.service = None
    
    async def get_courses(self, page_size: int = 10, page_token: Optional[str] = None) -> Dict[str, Any]:
        """Obtener lista de cursos desde Google Classroom API"""
        if not self.service:
            raise Exception("Google Classroom API not authenticated")
        
        try:
            request = self.service.courses().list(
                pageSize=page_size,
                pageToken=page_token
            )
            response = request.execute()
            
            return {
                'courses': response.get('courses', []),
                'next_page_token': response.get('nextPageToken'),
                'total_items': len(response.get('courses', []))
            }
            
        except HttpError as error:
            raise Exception(f"Error fetching courses: {error}")
    
    async def get_course(self, course_id: str) -> Dict[str, Any]:
        """Obtener un curso específico desde Google Classroom API"""
        if not self.service:
            raise Exception("Google Classroom API not authenticated")
        
        try:
            course = self.service.courses().get(id=course_id).execute()
            return course
            
        except HttpError as error:
            if error.resp.status == 404:
                return None
            raise Exception(f"Error fetching course: {error}")
    
    async def get_students(self, course_id: str, page_size: int = 10, page_token: Optional[str] = None) -> Dict[str, Any]:
        """Obtener estudiantes de un curso desde Google Classroom API"""
        if not self.service:
            raise Exception("Google Classroom API not authenticated")
        
        try:
            request = self.service.courses().students().list(
                courseId=course_id,
                pageSize=page_size,
                pageToken=page_token
            )
            response = request.execute()
            
            return {
                'students': response.get('students', []),
                'next_page_token': response.get('nextPageToken'),
                'total_items': len(response.get('students', []))
            }
            
        except HttpError as error:
            if error.resp.status == 404:
                return {'students': [], 'next_page_token': None, 'total_items': 0}
            raise Exception(f"Error fetching students: {error}")
    
    async def get_coursework(self, course_id: str, page_size: int = 10, page_token: Optional[str] = None) -> Dict[str, Any]:
        """Obtener trabajos de curso desde Google Classroom API"""
        if not self.service:
            raise Exception("Google Classroom API not authenticated")
        
        try:
            request = self.service.courses().courseWork().list(
                courseId=course_id,
                pageSize=page_size,
                pageToken=page_token
            )
            response = request.execute()
            
            return {
                'course_work': response.get('courseWork', []),
                'next_page_token': response.get('nextPageToken'),
                'total_items': len(response.get('courseWork', []))
            }
            
        except HttpError as error:
            if error.resp.status == 404:
                return {'course_work': [], 'next_page_token': None, 'total_items': 0}
            raise Exception(f"Error fetching coursework: {error}")
    
    async def get_submissions(self, course_id: str, coursework_id: str, page_size: int = 10, page_token: Optional[str] = None) -> Dict[str, Any]:
        """Obtener entregas de estudiantes desde Google Classroom API"""
        if not self.service:
            raise Exception("Google Classroom API not authenticated")
        
        try:
            request = self.service.courses().courseWork().studentSubmissions().list(
                courseId=course_id,
                courseWorkId=coursework_id,
                pageSize=page_size,
                pageToken=page_token
            )
            response = request.execute()
            
            return {
                'student_submissions': response.get('studentSubmissions', []),
                'next_page_token': response.get('nextPageToken'),
                'total_items': len(response.get('studentSubmissions', []))
            }
            
        except HttpError as error:
            if error.resp.status == 404:
                return {'student_submissions': [], 'next_page_token': None, 'total_items': 0}
            raise Exception(f"Error fetching submissions: {error}")
    
    async def get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """Obtener perfil de usuario desde Google Classroom API"""
        if not self.service:
            raise Exception("Google Classroom API not authenticated")
        
        try:
            profile = self.service.userProfiles().get(userId=user_id).execute()
            return profile
            
        except HttpError as error:
            if error.resp.status == 404:
                return None
            raise Exception(f"Error fetching user profile: {error}")


# LECCIÓN APRENDIDA: Driver GOOGLE con autenticación OAuth 2.0
# - Autenticación automática con refresh token
# - Manejo de errores HTTP específicos
# - Paginación nativa de Google Classroom API
# - Fallback a MOCK si falla autenticación
