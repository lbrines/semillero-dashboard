from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
import os


class BaseDataDriver(ABC):
    """Clase base abstracta para drivers de datos"""
    
    def __init__(self):
        self.driver_type = self.__class__.__name__.lower().replace('driver', '')
    
    @abstractmethod
    async def get_courses(self, page_size: int = 10, page_token: Optional[str] = None) -> Dict[str, Any]:
        """Obtener lista de cursos"""
        pass
    
    @abstractmethod
    async def get_course(self, course_id: str) -> Dict[str, Any]:
        """Obtener un curso específico"""
        pass
    
    @abstractmethod
    async def get_students(self, course_id: str, page_size: int = 10, page_token: Optional[str] = None) -> Dict[str, Any]:
        """Obtener estudiantes de un curso"""
        pass
    
    @abstractmethod
    async def get_coursework(self, course_id: str, page_size: int = 10, page_token: Optional[str] = None) -> Dict[str, Any]:
        """Obtener trabajos de curso"""
        pass
    
    @abstractmethod
    async def get_submissions(self, course_id: str, coursework_id: str, page_size: int = 10, page_token: Optional[str] = None) -> Dict[str, Any]:
        """Obtener entregas de estudiantes"""
        pass
    
    @abstractmethod
    async def get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """Obtener perfil de usuario"""
        pass


class DataDriverFactory:
    """Factory para crear drivers de datos"""
    
    @staticmethod
    def create_driver(driver_type: str = None) -> BaseDataDriver:
        """Crear driver de datos según el tipo especificado"""
        if driver_type is None:
            driver_type = os.getenv('DATA_DRIVER', 'mock')
        
        if driver_type == 'mock':
            from .mock_driver import MockDataDriver
            return MockDataDriver()
        elif driver_type == 'google':
            from .google_driver import GoogleDataDriver
            return GoogleDataDriver()
        else:
            raise ValueError(f"Driver type '{driver_type}' not supported")


# LECCIÓN APRENDIDA: Patrón Factory para drivers de datos
# - Abstracción clara entre MOCK y GOOGLE
# - Fácil extensión para nuevos drivers
# - Configuración via variable de entorno
