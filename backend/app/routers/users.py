from fastapi import APIRouter, Depends, HTTPException
from ..services.base import BaseDataDriver
from .dependencies import get_data_driver
from ..models.user import UserProfile

router = APIRouter()

@router.get("/users/{user_id}/profile", response_model=UserProfile)
async def get_user_profile(
    user_id: str,
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener perfil de usuario específico"""
    try:
        profile = await data_driver.get_user_profile(user_id)
        if profile is None:
            raise HTTPException(status_code=404, detail="User profile not found")
        return UserProfile(**profile)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user profile: {str(e)}")


# LECCIÓN APRENDIDA: Endpoints para perfiles de usuario
# - Ruta simple para obtener perfil
# - Validación de existencia de usuario
# - Manejo de errores HTTP específicos
