from fastapi import APIRouter, Depends
from .dependencies import get_data_driver
from ..services.base import BaseDataDriver

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "API is running"}

@router.get("/health/detailed")
async def detailed_health_check(data_driver: BaseDataDriver = Depends(get_data_driver)):
    """Health check detallado con estado del driver"""
    try:
        # Probar conexión con driver
        await data_driver.get_courses(page_size=1)
        driver_status = "connected"
    except Exception as e:
        driver_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "message": "API is running",
        "driver": {
            "type": data_driver.driver_type,
            "status": driver_status
        }
    }


# LECCIÓN APRENDIDA: Health checks para monitoreo
# - Endpoint básico para load balancers
# - Health check detallado con estado del driver
# - Validación de conectividad con datos
