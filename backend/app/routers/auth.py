from fastapi import APIRouter, HTTPException, Query
from ..services.google_auth import GoogleAuthService
from ..middleware.role_auth import RoleAuthMiddleware
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class EmailValidationRequest(BaseModel):
    email: str

class EmailValidationResponse(BaseModel):
    valid: bool
    role: Optional[str] = None
    name: Optional[str] = None
    message: str

@router.get("/auth/google/authorize")
async def get_google_auth_url():
    """Obtener URL de autorización de Google"""
    auth_service = GoogleAuthService()
    auth_url = auth_service.get_authorization_url()
    
    if not auth_url:
        raise HTTPException(status_code=500, detail="Could not generate authorization URL")
    
    return {"authorization_url": auth_url}

@router.get("/auth/google/callback")
async def google_auth_callback(code: str = Query(..., description="Authorization code from Google")):
    """Callback para autenticación de Google"""
    auth_service = GoogleAuthService()
    creds = auth_service.exchange_code_for_token(code)
    
    if not creds:
        raise HTTPException(status_code=400, detail="Could not exchange code for token")
    
    # Crear servicio con las credenciales
    service = auth_service.get_service()
    if not service:
        raise HTTPException(status_code=500, detail="Could not create Google Classroom service")
    
    return {"message": "Authentication successful", "status": "authenticated"}

@router.post("/auth/validate-email", response_model=EmailValidationResponse)
async def validate_email(request: EmailValidationRequest):
    """Validar email contra whitelist de roles"""
    try:
        role_middleware = RoleAuthMiddleware()
        user_role = role_middleware.get_user_role(request.email)
        
        if user_role:
            # Generar nombre basado en el rol y email
            name = _generate_user_name(request.email, user_role)
            
            return EmailValidationResponse(
                valid=True,
                role=user_role,
                name=name,
                message=f"Email autorizado para rol: {user_role}"
            )
        else:
            return EmailValidationResponse(
                valid=False,
                message="Email no autorizado. Contacta al administrador."
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error validando email: {str(e)}"
        )

def _generate_user_name(email: str, role: str) -> str:
    """Generar nombre de usuario basado en email y rol"""
    email_prefix = email.split('@')[0]
    
    # Mapeo de roles a nombres en español
    role_names = {
        "student": "Estudiante",
        "teacher": "Profesor", 
        "coordinator": "Coordinador",
        "admin": "Administrador"
    }
    
    role_name = role_names.get(role, "Usuario")
    return f"{role_name} {email_prefix.title()}"

@router.get("/auth/status")
async def get_auth_status():
    """Obtener estado de autenticación"""
    auth_service = GoogleAuthService()
    service = auth_service.get_service()
    
    if service:
        return {"status": "authenticated", "message": "Google Classroom API connected"}
    else:
        return {"status": "not_authenticated", "message": "Google Classroom API not connected"}


# LECCIÓN APRENDIDA: Endpoints de autenticación OAuth 2.0
# - Flujo completo de autorización
# - Callback para intercambio de código
# - Estado de autenticación
# - Manejo de errores específicos
