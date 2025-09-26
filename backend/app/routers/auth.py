from fastapi import APIRouter, HTTPException, Query
from ..services.google_auth import GoogleAuthService
from typing import Optional

router = APIRouter()

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
