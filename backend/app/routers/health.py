from fastapi import APIRouter, Depends
from .dependencies import get_data_driver
from ..services.base import BaseDataDriver
import os

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

@router.get("/driver/info")
async def driver_info():
    """Información del driver actual"""
    try:
        data_driver = get_data_driver()
        demo_mode = os.getenv("DEMO_MODE", "mock")
        
        return {
            "driver_type": data_driver.driver_type,
            "demo_mode": demo_mode,
            "status": "active",
            "features": {
                "authentication": "mock" if demo_mode == "mock" else "google_oauth",
                "data_source": "fixtures" if demo_mode == "mock" else "google_classroom",
                "real_time": False if demo_mode == "mock" else True
            }
        }
    except Exception as e:
        return {
            "driver_type": "unknown",
            "demo_mode": "error",
            "status": "error",
            "error": str(e)
        }


# LECCIÓN APRENDIDA: Health checks para monitoreo
# - Endpoint básico para load balancers
# - Health check detallado con estado del driver
# - Validación de conectividad con datos
