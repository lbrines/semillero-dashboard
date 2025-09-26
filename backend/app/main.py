from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from .routers import courses, students, coursework, submissions, users, health, auth, teachers, reports
from .services.base import DataDriverFactory

# Crear aplicación FastAPI
app = FastAPI(
    title="Semillero Dashboard API",
    description="API para integración con Google Classroom",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_url,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://frontend:3000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(courses.router, prefix="/api/v1", tags=["courses"])
app.include_router(students.router, prefix="/api/v1", tags=["students"])
app.include_router(coursework.router, prefix="/api/v1", tags=["coursework"])
app.include_router(submissions.router, prefix="/api/v1", tags=["submissions"])
app.include_router(users.router, prefix="/api/v1", tags=["users"])
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(teachers.router, prefix="/api/v1", tags=["teachers"])
app.include_router(reports.router, prefix="/api/v1", tags=["reports"])

# Crear driver de datos global
data_driver = DataDriverFactory.create_driver()

@app.get("/")
async def root():
    """Endpoint raíz"""
    return {
        "message": "Semillero Dashboard API",
        "version": "0.1.0",
        "driver": data_driver.driver_type,
        "docs": "/docs"
    }


# LECCIÓN APRENDIDA: FastAPI con configuración Docker-First
# - CORS configurado para frontend
# - Documentación automática en /docs
# - Driver de datos global configurado
# - Routers organizados por funcionalidad
