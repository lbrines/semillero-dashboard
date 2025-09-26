import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from typing import Optional, Dict, Any


class GoogleAuthService:
    """Servicio de autenticación con Google Classroom API"""
    
    def __init__(self):
        self.scopes = [
            'https://www.googleapis.com/auth/classroom.courses.readonly',
            'https://www.googleapis.com/auth/classroom.rosters.readonly',
            'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
            'https://www.googleapis.com/auth/classroom.profile.emails'
        ]
        self.credentials_file = os.getenv('GOOGLE_CREDENTIALS_FILE', 'credentials.json')
        self.tokens_file = os.getenv('TOKENS_FILE', 'tokens.json')
        self.service = None
    
    def authenticate(self) -> bool:
        """Autenticar con Google Classroom API"""
        try:
            creds = None
            
            # Cargar credenciales existentes
            if os.path.exists(self.tokens_file):
                creds = Credentials.from_authorized_user_file(self.tokens_file, self.scopes)
            
            # Si no hay credenciales válidas, autenticar
            if not creds or not creds.valid:
                if creds and creds.expired and creds.refresh_token:
                    creds.refresh(Request())
                else:
                    if not os.path.exists(self.credentials_file):
                        print(f"Credentials file not found: {self.credentials_file}")
                        return False
                    
                    flow = Flow.from_client_secrets_file(self.credentials_file, self.scopes)
                    creds = flow.run_local_server(port=0)
                
                # Guardar credenciales para la próxima vez
                with open(self.tokens_file, 'w') as token:
                    token.write(creds.to_json())
            
            self.service = build('classroom', 'v1', credentials=creds)
            return True
            
        except Exception as e:
            print(f"Error authenticating with Google Classroom API: {e}")
            return False
    
    def get_authorization_url(self) -> Optional[str]:
        """Obtener URL de autorización para OAuth"""
        try:
            if not os.path.exists(self.credentials_file):
                return None
            
            flow = Flow.from_client_secrets_file(
                self.credentials_file, 
                self.scopes,
                redirect_uri=os.getenv('GOOGLE_CLASSROOM_REDIRECT_URI', 'http://localhost:8000/api/v1/auth/google/callback')
            )
            
            auth_url, _ = flow.authorization_url(prompt='consent')
            return auth_url
            
        except Exception as e:
            print(f"Error getting authorization URL: {e}")
            return None
    
    def exchange_code_for_token(self, code: str) -> Optional[Credentials]:
        """Intercambiar código de autorización por token"""
        try:
            flow = Flow.from_client_secrets_file(
                self.credentials_file,
                self.scopes,
                redirect_uri=os.getenv('GOOGLE_CLASSROOM_REDIRECT_URI', 'http://localhost:8000/api/v1/auth/google/callback')
            )
            
            flow.fetch_token(code=code)
            creds = flow.credentials
            
            # Guardar credenciales
            with open(self.tokens_file, 'w') as token:
                token.write(creds.to_json())
            
            return creds
            
        except Exception as e:
            print(f"Error exchanging code for token: {e}")
            return None
    
    def get_service(self):
        """Obtener servicio de Google Classroom API"""
        if not self.service:
            if not self.authenticate():
                return None
        return self.service


# LECCIÓN APRENDIDA: Servicio de autenticación Google OAuth 2.0
# - Flujo completo de autenticación
# - Manejo de refresh tokens
# - Persistencia de credenciales
# - Manejo de errores robusto
