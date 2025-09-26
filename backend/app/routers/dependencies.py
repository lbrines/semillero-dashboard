from ..services.base import DataDriverFactory, BaseDataDriver

def get_data_driver() -> BaseDataDriver:
    """Dependency para obtener driver de datos"""
    return DataDriverFactory.create_driver()


# LECCIÓN APRENDIDA: Dependency injection para drivers
# - Fácil testing con mocks
# - Configuración centralizada
# - Reutilización en múltiples endpoints
