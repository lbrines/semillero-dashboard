# CONTRATO1LLM — Backend FastAPI Docker-First

## ROL
Eres un **Backend Engineer** especializado en **Python 3.11+** con **FastAPI** y **Docker-First approach**. Tu objetivo es crear infraestructura de datos conmutables para Google Classroom API usando contenedores Docker.

## CONTEXTO
Crear backend FastAPI con drivers MOCK/GOOGLE que se ejecute completamente en Docker. Todo el ciclo de vida (desarrollo, testing, deployment) debe funcionar con contenedores.

## OBJETIVO PRINCIPAL
Implementar backend FastAPI con capa de datos conmutables (MOCK/GOOGLE) alineada 1:1 con Google Classroom API usando enfoque Docker-First.

---

## FUENTES DE VERDAD (OBLIGATORIAS)
- **Google Classroom API**: https://developers.google.com/classroom
- **REST Reference**: https://developers.google.com/classroom/reference/rest
- **Endpoints a implementar**:
  - `courses.list`
  - `courses.students.list`
  - `courses.courseWork.list`
  - `courses.courseWork.studentSubmissions.list`
  - `userProfiles.get`

## REQUISITOS TÉCNICOS (VERSIONES ESPECÍFICAS)

### Backend
- **Python**: 3.11+
- **FastAPI**: 0.104.0+
- **Pydantic**: 2.4.0+

### DevOps
- **Docker**: 24.0.0+
- **Docker Compose**: 2.20.0+

## VALIDACIÓN OBLIGATORIA CON DOCUMENTACIÓN OFICIAL

### Requisito Mandatorio
Antes de ejecutar cualquier tarea de programación, es **OBLIGATORIO** validar la solución propuesta con la documentación oficial de las versiones especificadas. Este paso preventivo no es opcional y debe documentarse como parte del proceso de desarrollo.

### Proceso de Validación Requerido
1. **Consultar documentación oficial** de cada tecnología involucrada
2. **Verificar compatibilidad** entre las diferentes versiones de las bibliotecas
3. **Documentar hallazgos** relevantes, especialmente incompatibilidades o workarounds necesarios
4. **Crear pruebas de concepto** para funcionalidades críticas o de alto riesgo

### Documentación del Proceso
Para cada tarea significativa, debe incluirse una breve nota que confirme:
- Documentación oficial consultada (con enlaces)
- Posibles problemas identificados y soluciones aplicadas
- Confirmación de compatibilidad entre las versiones utilizadas

### Referencias Específicas para Backend
- [Documentación oficial de FastAPI](https://fastapi.tiangolo.com/)
- [Documentación oficial de Pydantic 2.x](https://docs.pydantic.dev/)
- [Documentación oficial de Google Classroom API](https://developers.google.com/classroom/reference/rest)
- [Documentación oficial de Docker para Python](https://docs.docker.com/language/python/)
- [Documentación oficial de OAuth 2.0](https://oauth.net/2/)

---

## PROMPTS POR FASE

### PROMPT FASE 1: Setup Inicial Docker-First

**TAREA**: Crear proyecto FastAPI con Docker-First approach para estructura separada backend/frontend.

**ENTREGABLES**:
- `pyproject.toml` con dependencias
- `Dockerfile` multi-stage (dev + prod)
- `docker-compose.yml` para orquestación backend (puerto 8000)
- `.env.example` con variables de entorno
- CORS configurado para frontend en puerto 3000

**EJEMPLO pyproject.toml**:
```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "classroom-backend"
version = "0.1.0"
dependencies = [
    "fastapi>=0.104.0",
    "pydantic>=2.5.0",
    "httpx>=0.25.0",
    "uvicorn[standard]>=0.24.0",
    "pytest>=7.4.0",
    "pytest-asyncio>=0.21.0",
    # Dependencias para Google Classroom API
    "google-auth>=2.23.0",
    "google-auth-oauthlib>=1.1.0",
    "google-auth-httplib2>=0.1.1",
    "google-api-python-client>=2.100.0",
]

# LECCIÓN APRENDIDA: Versiones específicas evitan problemas de compatibilidad
# - fastapi>=0.104.0 - Versión estable probada
# - pydantic>=2.5.0 - Compatibilidad con FastAPI
# - httpx>=0.25.0 - Cliente HTTP async robusto

[project.optional-dependencies]
dev = [
    "black>=23.0.0",
    "isort>=5.12.0",
    "pylint>=3.0.0",
]

# LECCIÓN APRENDIDA: Herramientas de calidad de código desde el inicio
# - black>=23.0.0 - Formateo automático
# - isort>=5.12.0 - Orden de imports
# - pylint>=3.0.0 - Análisis de código
```

**EJEMPLO Dockerfile**:
```dockerfile
FROM python:3.11-alpine AS dev
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

FROM python:3.11-alpine AS prod
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# LECCIÓN APRENDIDA: Multi-stage builds optimizan tamaño y seguridad
# - dev stage: Para desarrollo con hot reload
# - prod stage: Para producción optimizada
# - Alpine Linux: Imagen base minimalista y segura
```

**EJEMPLO docker-compose.yml**:
```yaml
version: '3.8'
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: dev
    ports:
      - "8000:8000"
    environment:
      - DATA_DRIVER=mock
      - FRONTEND_URL=http://localhost:3000
    volumes:
      - ./backend:/app
    networks:
      - classroom-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

networks:
  classroom-network:
    driver: bridge
```

**EJEMPLO .env.example**:
```env
# Driver de datos (mock o google)
DATA_DRIVER=mock

# Modo demo (mock o google)
DEMO_MODE=mock

# Idioma por defecto (es o en)
DEFAULT_LANGUAGE=es

# Frontend URL para CORS
FRONTEND_URL=http://localhost:3000

# Credenciales Google Classroom API
GOOGLE_CLASSROOM_CLIENT_ID=your_client_id_here
GOOGLE_CLASSROOM_CLIENT_SECRET=your_client_secret_here
GOOGLE_CLASSROOM_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback

# Scopes de Google Classroom API
GOOGLE_CLASSROOM_SCOPES=https://www.googleapis.com/auth/classroom.courses.readonly,https://www.googleapis.com/auth/classroom.rosters.readonly,https://www.googleapis.com/auth/classroom.coursework.me.readonly,https://www.googleapis.com/auth/classroom.profile.emails

# Archivo de tokens (para desarrollo)
TOKENS_FILE=tokens.json
```

**VALIDACIÓN** (MEJORADA CON PRUEBAS FUNCIONALES OBLIGATORIAS):
```bash
# 1. Pruebas funcionales obligatorias antes de cerrar cada fase
echo "=== PRUEBAS FUNCIONALES BACKEND ==="

# Verificar que el backend responde
curl -I http://localhost:8000/health
echo "✅ Health check: $(curl -s http://localhost:8000/health | jq -r '.status')"

# Listar cursos y validar que devuelve array no vacío
echo "=== TEST: Listar cursos ==="
COURSES_RESPONSE=$(curl -s http://localhost:8000/api/v1/courses)
echo "Response: $COURSES_RESPONSE"
COURSES_COUNT=$(echo $COURSES_RESPONSE | jq '.courses | length')
if [ "$COURSES_COUNT" -gt 0 ]; then
  echo "✅ Cursos encontrados: $COURSES_COUNT"
else
  echo "❌ ERROR: No se encontraron cursos"
  exit 1
fi

# Listar estudiantes y validar que devuelve array no vacío
echo "=== TEST: Listar estudiantes ==="
FIRST_COURSE_ID=$(echo $COURSES_RESPONSE | jq -r '.courses[0].id')
STUDENTS_RESPONSE=$(curl -s "http://localhost:8000/api/v1/courses/$FIRST_COURSE_ID/students")
echo "Response: $STUDENTS_RESPONSE"
STUDENTS_COUNT=$(echo $STUDENTS_RESPONSE | jq '.students | length')
if [ "$STUDENTS_COUNT" -gt 0 ]; then
  echo "✅ Estudiantes encontrados: $STUDENTS_COUNT"
else
  echo "❌ ERROR: No se encontraron estudiantes"
  exit 1
fi

# Listar submissions y validar que devuelve array no vacío
echo "=== TEST: Listar submissions ==="
SUBMISSIONS_RESPONSE=$(curl -s "http://localhost:8000/api/v1/courses/$FIRST_COURSE_ID/coursework")
echo "Response: $SUBMISSIONS_RESPONSE"
SUBMISSIONS_COUNT=$(echo $SUBMISSIONS_RESPONSE | jq '.courseWork | length')
if [ "$SUBMISSIONS_COUNT" -gt 0 ]; then
  echo "✅ Submissions encontrados: $SUBMISSIONS_COUNT"
else
  echo "❌ ERROR: No se encontraron submissions"
  exit 1
fi

# 2. Validación de paginación y errores
echo "=== TEST: Validación de paginación ==="
# Test pageSize=2
PAGINATED_RESPONSE=$(curl -s "http://localhost:8000/api/v1/courses?pageSize=2")
PAGINATED_COUNT=$(echo $PAGINATED_RESPONSE | jq '.courses | length')
if [ "$PAGINATED_COUNT" -eq 2 ]; then
  echo "✅ Paginación pageSize=2 funciona: $PAGINATED_COUNT cursos"
else
  echo "❌ ERROR: Paginación pageSize=2 falló"
  exit 1
fi

# Test pageToken inválido (debe devolver 400)
echo "=== TEST: pageToken inválido ==="
INVALID_TOKEN_RESPONSE=$(curl -s -w "%{http_code}" "http://localhost:8000/api/v1/courses?pageToken=invalid_token")
HTTP_CODE=$(echo $INVALID_TOKEN_RESPONSE | tail -c 4)
if [ "$HTTP_CODE" = "400" ]; then
  echo "✅ pageToken inválido devuelve 400 como esperado"
else
  echo "❌ ERROR: pageToken inválido devolvió $HTTP_CODE, esperaba 400"
  exit 1
fi

# 3. Indicadores de DEMO_MODE
echo "=== TEST: Indicadores DEMO_MODE ==="
DRIVER_INFO=$(curl -s http://localhost:8000/api/v1/driver/info)
echo "Driver info: $DRIVER_INFO"
DEMO_MODE=$(echo $DRIVER_INFO | jq -r '.demo_mode')
if [ "$DEMO_MODE" = "mock" ]; then
  echo "✅ DEMO_MODE correcto: $DEMO_MODE"
else
  echo "❌ ERROR: DEMO_MODE incorrecto: $DEMO_MODE"
  exit 1
fi

# 4. Checklist de smoke tests (7 pasos rápidos para QA manual)
echo "=== CHECKLIST DE SMOKE TESTS ==="
echo "1. ✅ make up - Sistema levantado"
echo "2. ✅ curl /health - Backend responde"
echo "3. ✅ curl /api/v1/courses - Lista cursos"
echo "4. ✅ curl /api/v1/courses/{id}/students - Lista estudiantes"
echo "5. ✅ curl /api/v1/driver/info - Muestra demo_mode=mock"
echo "6. ✅ Paginación funciona con pageSize=2"
echo "7. ✅ Errores 400 para pageToken inválido"

echo "=== VALIDACIÓN ROBUSTA DE SERVICIOS ==="
# Verificar que el backend responde
curl -I http://localhost:8000/health
echo "✅ Health check: $(curl -s http://localhost:8000/health | jq -r '.status')"

# Verificar CORS
curl -H "Origin: http://localhost:3000" -X OPTIONS http://localhost:8000/api/v1/courses
echo "✅ CORS: Preflight request handled"

# Verificar imports
docker-compose exec backend python -c "import app.main; print('✅ Imports: OK')"

# Verificar tests
docker-compose exec backend pytest --version
echo "✅ Tests: pytest available"

docker-compose up backend --detach
docker-compose ps backend
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(backend): add Docker-First FastAPI setup

- Add pyproject.toml with FastAPI dependencies
- Add multi-stage Dockerfile (dev + prod)
- Add docker-compose.yml for orchestration
- Add .env.example with environment variables
- Configure health check endpoint

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 2: Estructura de Carpetas

**TAREA**: Crear estructura de carpetas Docker-First.

**ENTREGABLES**:
- `/app/api/v1/` (endpoints FastAPI)
- `/app/models/` (Pydantic models)
- `/app/services/` (lógica de negocio)
- `/app/fixtures/` (datos de prueba)
- `/tests/` (tests unitarios)
- `/scripts/` (scripts de utilidad)

**EJEMPLO Estructura**:
```
app/
├── __init__.py
├── main.py
├── api/
│   └── v1/
│       ├── __init__.py
│       ├── courses.py
│       ├── students.py
│       ├── coursework.py
│       ├── submissions.py
│       └── user_profiles.py
├── models/
│   ├── __init__.py
│   ├── course.py
│   ├── student.py
│   ├── coursework.py
│   ├── submission.py
│   └── user_profile.py
├── services/
│   ├── __init__.py
│   ├── classroom.py
│   ├── classroom_mock.py
│   └── classroom_google.py
└── fixtures/
    ├── courses.json
    ├── students.json
    ├── coursework.json
    ├── submissions.json
    └── user_profiles.json

scripts/
└── seed.py

tests/
├── __init__.py
├── test_api.py
├── test_models.py
└── test_services.py
```

**📝 LECCIÓN APRENDIDA**: Separación clara de responsabilidades facilita mantenimiento
- `/app/api/v1/` - Endpoints REST (presentación)
- `/app/models/` - Pydantic models (validación)
- `/app/services/` - Lógica de negocio (dominio)
- `/app/fixtures/` - Datos de prueba (testing)

**EJEMPLO app/main.py** (ACTUALIZADO CON LECCIONES APRENDIDAS):
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from app.api.v1 import courses, students, coursework, submissions, user_profiles

app = FastAPI(
    title="Classroom Backend API",
    description="Backend API for Google Classroom integration",
    version="1.0.0"
)

# LECCIÓN APRENDIDA: CORS middleware personalizado para manejar OPTIONS
class CustomCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            response = JSONResponse({})
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-User-Email"
            response.headers["Access-Control-Max-Age"] = "86400"
            return response
        
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-User-Email"
        return response

# LECCIÓN APRENDIDA: Agregar CORS middleware personalizado
app.add_middleware(CustomCORSMiddleware)

# LECCIÓN APRENDIDA: Manejo de errores HTTP específicos
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code}
    )

app.include_router(courses.router, prefix="/api/v1", tags=["courses"])
app.include_router(students.router, prefix="/api/v1", tags=["students"])
app.include_router(coursework.router, prefix="/api/v1", tags=["coursework"])
app.include_router(submissions.router, prefix="/api/v1", tags=["submissions"])
app.include_router(user_profiles.router, prefix="/api/v1", tags=["user-profiles"])

# LECCIÓN APRENDIDA: Incluir endpoints de autenticación OAuth
from app.api.v1 import auth
app.include_router(auth.router, prefix="/api/v1", tags=["authentication"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "classroom-backend"}
```

**VALIDACIÓN** (ACTUALIZADA CON LECCIONES APRENDIDAS):
```bash
# LECCIÓN APRENDIDA: Verificar servicios antes de continuar
echo "1. Verificando servicios backend:"
curl -I http://localhost:8000/health

echo "2. Verificando CORS:"
curl -H "Origin: http://localhost:3000" -X OPTIONS http://localhost:8000/api/v1/courses

echo "3. Verificando imports:"
docker-compose exec backend python -c "import app.main"

echo "4. Verificando tests:"
docker-compose exec backend pytest --version

echo "5. Verificando contenedores:"
docker ps
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(backend): add folder structure and API organization

- Add /app/api/v1/ endpoints structure
- Add /app/models/ Pydantic models directory
- Add /app/services/ business logic layer
- Add /app/fixtures/ test data directory
- Add /tests/ unit tests directory
- Add /scripts/ utility scripts directory
- Configure main.py with CORS middleware

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 3: Pydantic Models

**TAREA**: Crear Pydantic models para Google Classroom API.

**ENTREGABLES**:
- `Course` model
- `Student` model
- `CourseWork` model
- `StudentSubmission` model
- `UserProfile` model

**EJEMPLO app/models/course.py**:
```python
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class Module(BaseModel):
    id: str = Field(..., description="ID único del módulo")
    name: str = Field(..., description="Nombre del módulo")

class Course(BaseModel):
    id: str = Field(..., description="Unique identifier for the course")
    name: str = Field(..., description="Name of the course")
    description: Optional[str] = Field(None, description="Description of the course")
    ownerId: str = Field(..., description="Identifier of the owner of the course")
    creationTime: datetime = Field(..., description="Creation time of the course")
    updateTime: datetime = Field(..., description="Time of the most recent update to this course")
    enrollmentCode: str = Field(..., description="Enrollment code to use when joining this course")
    courseState: str = Field(..., description="State of the course")
    alternateLink: str = Field(..., description="Absolute link to this course in the Classroom web UI")
    modules: Optional[List[Module]] = Field([], description="Módulos del curso")

class CourseList(BaseModel):
    courses: List[Course]
    nextPageToken: Optional[str] = None
```

**EJEMPLO app/models/student.py**:
```python
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class Student(BaseModel):
    userId: str = Field(..., description="Identifier of the user")
    courseId: str = Field(..., description="Identifier of the course")
    profile: Optional[dict] = Field(None, description="Global information for a user")

class StudentList(BaseModel):
    students: List[Student]
    nextPageToken: Optional[str] = None
```

**EJEMPLO app/models/user.py**:
```python
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "administrador"
    COORDINATOR = "coordinador"
    TEACHER = "docente"
    STUDENT = "estudiante"

class User(BaseModel):
    id: str = Field(..., description="ID único del usuario")
    email: str = Field(..., description="Email del usuario")
    role: UserRole = Field(..., description="Rol del usuario")
    name: str = Field(..., description="Nombre completo del usuario")

class UserAuth(User):
    password: str = Field(..., description="Contraseña del usuario")

class TokenResponse(BaseModel):
    access_token: str = Field(..., description="Token de acceso")
    token_type: str = Field(..., description="Tipo de token")
    expires_in: int = Field(..., description="Tiempo de expiración en segundos")
    user_id: str = Field(..., description="ID del usuario")
    user_role: str = Field(..., description="Rol del usuario")
```

**EJEMPLO app/models/coursework.py**:
```python
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class AssignmentType(str, Enum):
    DIAGNOSTIC = "Diagnóstico inicial"
    PRACTICE = "Práctica aplicada"
    PROJECT = "Proyecto final"

class CourseWork(BaseModel):
    id: str = Field(..., description="Unique identifier for the coursework")
    title: str = Field(..., description="Title of the coursework")
    description: Optional[str] = Field(None, description="Description of the coursework")
    state: str = Field(..., description="State of the coursework")
    alternateLink: str = Field(..., description="Absolute link to this coursework in the Classroom web UI")
    creationTime: str = Field(..., description="Creation time of the coursework")
    updateTime: str = Field(..., description="Time of the most recent update to this coursework")
    dueDate: Optional[dict] = Field(None, description="Due date for the coursework")
    maxPoints: Optional[float] = Field(None, description="Maximum points for the coursework")
    workType: str = Field(..., description="Type of the coursework")
    creatorUserId: str = Field(..., description="Identifier of the creator of the coursework")
    courseId: str = Field(..., description="Identifier of the course")
    moduleId: Optional[str] = Field(None, description="Identifier of the module")
    assignmentType: Optional[AssignmentType] = Field(None, description="Type of the assignment")

class CourseWorkList(BaseModel):
    courseWork: List[CourseWork]
    nextPageToken: Optional[str] = None
```

**EJEMPLO app/models/submission.py**:
```python
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class SubmissionState(str, Enum):
    SUBMITTED = "Entregada"
    PENDING = "Pendiente"
    LATE = "Atrasada"
    NOT_SUBMITTED = "No entregada"

class StudentSubmission(BaseModel):
    id: str = Field(..., description="Unique identifier for the student submission")
    courseId: str = Field(..., description="Identifier of the course")
    courseWorkId: str = Field(..., description="Identifier of the coursework")
    userId: str = Field(..., description="Identifier of the user")
    creationTime: str = Field(..., description="Creation time of the submission")
    updateTime: str = Field(..., description="Time of the most recent update to this submission")
    state: SubmissionState = Field(..., description="State of the submission")
    late: bool = Field(..., description="Whether the submission is late")
    draftGrade: Optional[float] = Field(None, description="Draft grade for the submission")
    assignedGrade: Optional[float] = Field(None, description="Assigned grade for the submission")
    alternateLink: str = Field(..., description="Absolute link to this submission in the Classroom web UI")
    courseWorkType: str = Field(..., description="Type of the coursework")

class StudentSubmissionList(BaseModel):
    studentSubmissions: List[StudentSubmission]
    nextPageToken: Optional[str] = None
```

**EJEMPLO tests/test_models.py**:
```python
import pytest
from datetime import datetime
from app.models.course import Course

def test_course_model():
    course_data = {
        "id": "course_001",
        "name": "Matemáticas Avanzadas",
        "description": "Curso de matemáticas para estudiantes avanzados",
        "ownerId": "teacher_001",
        "creationTime": "2024-01-15T10:00:00Z",
        "updateTime": "2024-01-15T10:00:00Z",
        "enrollmentCode": "MATH2024",
        "courseState": "ACTIVE",
        "alternateLink": "https://classroom.google.com/c/course_001"
    }
    
    course = Course(**course_data)
    assert course.id == "course_001"
    assert course.name == "Matemáticas Avanzadas"
    assert course.courseState == "ACTIVE"
```

**VALIDACIÓN**:
```bash
docker-compose exec backend pytest tests/test_models.py
docker-compose exec backend python -m pytest tests/test_models.py
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(backend): implement Pydantic models for Google Classroom API

- Add Course model with all required fields
- Add Student model with profile information
- Add CourseWork model for assignments
- Add StudentSubmission model for submissions
- Add UserProfile model for user data
- Add comprehensive model validation tests

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 4: Servicios de Datos

**TAREA**: Implementar servicios de datos conmutables.

**ENTREGABLES**:
- `classroom.py` (servicio principal)
- `classroom_mock.py` (driver mock)
- `classroom_google.py` (driver google stub)

**EJEMPLO app/services/classroom.py**:
```python
import os
from typing import List, Optional
from app.models.course import Course, CourseList
from app.models.student import Student, StudentList
from app.services.classroom_mock import ClassroomMock
from app.services.classroom_google import ClassroomGoogle

class ClassroomService:
    def __init__(self):
        self.driver = os.getenv("DATA_DRIVER", "mock")
        self.demo_mode = os.getenv("DEMO_MODE", "mock")
        if self.driver == "mock":
            self.service = ClassroomMock()
        elif self.driver == "google":
            self.service = ClassroomGoogle()
        else:
            raise ValueError(f"Unknown driver: {self.driver}")

    def list_courses(self, page_size: int = 10, page_token: Optional[str] = None, access_token: Optional[str] = None) -> CourseList:
        """Listar cursos con soporte dual MOCK/GOOGLE"""
        if self.driver == "google" and access_token:
            return self.service.list_courses(page_size, page_token, access_token)
        else:
            return self.service.list_courses(page_size, page_token)

    def list_students(self, course_id: str, page_size: int = 10, page_token: Optional[str] = None, access_token: Optional[str] = None) -> StudentList:
        """Listar estudiantes con soporte dual MOCK/GOOGLE"""
        if self.driver == "google" and access_token:
            return self.service.list_students(course_id, page_size, page_token, access_token)
        else:
            return self.service.list_students(course_id, page_size, page_token)

    def list_course_work(self, course_id: str, page_size: int = 10, page_token: Optional[str] = None, access_token: Optional[str] = None):
        """Listar tareas con soporte dual MOCK/GOOGLE"""
        if self.driver == "google" and access_token:
            return self.service.list_course_work(course_id, page_size, page_token, access_token)
        else:
            return self.service.list_course_work(course_id, page_size, page_token)

    def list_student_submissions(self, course_id: str, course_work_id: str, page_size: int = 10, page_token: Optional[str] = None, access_token: Optional[str] = None):
        """Listar entregas con soporte dual MOCK/GOOGLE"""
        if self.driver == "google" and access_token:
            return self.service.list_student_submissions(course_id, course_work_id, page_size, page_token, access_token)
        else:
            return self.service.list_student_submissions(course_id, course_work_id, page_size, page_token)

    def get_student_profile(self, user_id: str, access_token: Optional[str] = None):
        """Obtener perfil con soporte dual MOCK/GOOGLE"""
        if self.driver == "google" and access_token:
            return self.service.get_student_profile(user_id, access_token)
        else:
            return self.service.get_student_profile(user_id)

    def get_driver_info(self) -> dict:
        """Obtener información del driver activo"""
        return {
            "driver": self.driver,
            "demo_mode": self.demo_mode,
            "supports_oauth": self.driver == "google",
            "requires_auth": self.driver == "google"
        }

# Instancia global del servicio
classroom_service = ClassroomService()
```

**EJEMPLO app/services/classroom_mock.py**:
```python
import json
import os
from typing import List, Optional
from app.models.course import Course, CourseList
from app.models.student import Student, StudentList

class ClassroomMock:
    def __init__(self):
        self.fixtures_path = os.path.join(os.path.dirname(__file__), "..", "fixtures")
        self._load_mock_users()
        self._load_mock_courses()
        self._load_mock_coursework()
        self._load_mock_submissions()
        self._load_mock_profiles()
    
    def _load_mock_users(self):
        """Load mock users from fixtures"""
        filepath = os.path.join(self.fixtures_path, "mock-users.json")
        with open(filepath, 'r', encoding='utf-8') as f:
            self.users = json.load(f)["users"]

    def _load_fixture(self, filename: str) -> dict:
        """Load fixture data from JSON file"""
        filepath = os.path.join(self.fixtures_path, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)

    def list_courses(self, page_size: int = 10, page_token: Optional[str] = None) -> CourseList:
        """List courses from fixtures with pagination"""
        data = self._load_fixture("courses.json")
        courses = [Course(**course) for course in data["courses"]]
        
        # Simulate pagination
        start = 0 if page_token is None else int(page_token)
        end = start + page_size
        paginated_courses = courses[start:end]
        
        next_token = str(end) if end < len(courses) else None
        
        return CourseList(courses=paginated_courses, nextPageToken=next_token)

    def list_students(self, course_id: str, page_size: int = 10, page_token: Optional[str] = None) -> StudentList:
        """List students from a course using fixtures with pagination"""
        data = self._load_fixture("students.json")
        students = [Student(**student) for student in data["students"] if student["courseId"] == course_id]
        
        # Simulate pagination
        start = 0 if page_token is None else int(page_token)
        end = start + page_size
        paginated_students = students[start:end]
        
        next_token = str(end) if end < len(students) else None
        
        return StudentList(students=paginated_students, nextPageToken=next_token)
```

**EJEMPLO app/services/auth_mock.py**:
```python
import os
import json
from typing import Optional, Dict, Any
from app.models.user import User, UserRole

class AuthMock:
    def __init__(self):
        self.fixtures_path = os.path.join(os.path.dirname(__file__), "..", "fixtures")
        self._load_mock_users()
    
    def _load_mock_users(self):
        """Load mock users from fixtures"""
        filepath = os.path.join(self.fixtures_path, "mock-users.json")
        with open(filepath, 'r', encoding='utf-8') as f:
            self.users = json.load(f)["users"]
    
    def authenticate(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user and return token response"""
        user = next((u for u in self.users if u["email"] == email and u["password"] == password), None)
        
        if not user:
            return None
        
        # Create mock token response
        return {
            "access_token": f"mock_token_{user['id']}",
            "token_type": "bearer",
            "expires_in": 3600,
            "user_id": user["id"],
            "user_role": user["role"]
        }
    
    def validate_token(self, token: str) -> Optional[User]:
        """Validate token and return user"""
        if not token.startswith("mock_token_"):
            return None
        
        user_id = token.replace("mock_token_", "")
        user = next((u for u in self.users if u["id"] == user_id), None)
        
        if not user:
            return None
        
        # Remove password before returning
        user_copy = user.copy()
        user_copy.pop("password", None)
        
        return User(**user_copy)
    
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        user = next((u for u in self.users if u["id"] == user_id), None)
        
        if not user:
            return None
        
        # Remove password before returning
        user_copy = user.copy()
        user_copy.pop("password", None)
        
        return User(**user_copy)

# Instancia global del servicio
auth_mock = AuthMock()
```

**VALIDACIÓN**:
```bash
docker-compose exec backend python -c "from app.services.classroom import classroom_service"
docker-compose exec backend python -c "from app.services.classroom import list_courses, list_students"
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(backend): implement dual driver data services (MOCK/GOOGLE)

- Add ClassroomService with driver switching logic
- Add ClassroomMock service for test data
- Add ClassroomGoogle service stub for OAuth
- Implement pagination support in mock driver
- Add driver info endpoint for mode detection
- Support transparent switching via DATA_DRIVER env var

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 5: FastAPI Endpoints

**TAREA**: Implementar endpoints FastAPI.

**ENTREGABLES**:
- 5 endpoints de Google Classroom API
- Health check endpoint
- Validación con Pydantic
- Manejo de errores

**EJEMPLO app/api/v1/courses.py**:
```python
from fastapi import APIRouter, Query, HTTPException, Header
from typing import Optional
from app.services.classroom import classroom_service
from app.models.course import CourseList

router = APIRouter()

@router.get("/courses", response_model=CourseList)
async def get_courses(
    page_size: int = Query(10, ge=1, le=100, description="Maximum number of items to return"),
    page_token: Optional[str] = Query(None, description="Token specifying which result page to return"),
    authorization: Optional[str] = Header(None, description="Bearer token for Google API")
):
    try:
        # Extraer access token del header Authorization si está presente
        access_token = None
        if authorization and authorization.startswith("Bearer "):
            access_token = authorization[7:]  # Remover "Bearer " prefix
        
        return classroom_service.list_courses(page_size, page_token, access_token)
    except ValueError as e:
        # Error específico de autenticación requerida
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# LECCIÓN APRENDIDA: Mapeo explícito de excepciones a códigos HTTP apropiados
# - ValueError → 401 (Unauthorized)
# - KeyError → 404 (Not Found)  
# - ValidationError → 422 (Unprocessable Entity)
# - Exception → 500 (Internal Server Error)

@router.get("/courses/{course_id}/students")
async def get_course_students(
    course_id: str,
    page_size: int = Query(10, ge=1, le=100),
    page_token: Optional[str] = Query(None),
    authorization: Optional[str] = Header(None, description="Bearer token for Google API")
):
    try:
        # Extraer access token del header Authorization si está presente
        access_token = None
        if authorization and authorization.startswith("Bearer "):
            access_token = authorization[7:]  # Remover "Bearer " prefix
        
        return classroom_service.list_students(course_id, page_size, page_token, access_token)
    except ValueError as e:
        # Error específico de autenticación requerida
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/driver/info")
async def get_driver_info():
    """Obtener información del driver activo"""
    try:
        return classroom_service.get_driver_info()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**EJEMPLO app/api/v1/students.py**:
```python
from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from app.services.classroom import classroom_service

router = APIRouter()

@router.get("/courses/{course_id}/students")
async def get_students(
    course_id: str,
    page_size: int = Query(10, ge=1, le=100),
    page_token: Optional[str] = Query(None)
):
    try:
        return classroom_service.list_students(course_id, page_size, page_token)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**VALIDACIÓN**:
```bash
curl http://localhost:8000/api/v1/courses
curl http://localhost:8000/api/v1/courses/1/students
curl http://localhost:8000/health
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(backend): implement FastAPI endpoints for Google Classroom API

- Add /api/v1/courses endpoint with pagination
- Add /api/v1/courses/{id}/students endpoint
- Add /api/v1/courses/{id}/coursework endpoint
- Add /api/v1/courses/{id}/coursework/{id}/submissions endpoint
- Add /api/v1/user-profiles/{id} endpoint
- Add /api/v1/driver/info endpoint for mode detection
- Implement proper error handling with HTTPException

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 6: Fixtures y Seed

**TAREA**: Crear fixtures realistas y script de seed.

**ENTREGABLES**:
- `fixtures/*.json` (datos de prueba)
- `scripts/seed.py` (generador de datos)

**EJEMPLO app/fixtures/courses.json**:
```json
{
  "courses": [
    {
      "id": "ecommerce_001",
      "name": "Especialista en Ecommerce",
      "description": "Curso especializado en comercio electrónico y ventas online",
      "ownerId": "coord.ecommerce@instituto.edu",
      "creationTime": "2024-01-15T10:00:00Z",
      "updateTime": "2024-01-15T10:00:00Z",
      "enrollmentCode": "ECOMM2024",
      "courseState": "ACTIVE",
      "alternateLink": "https://classroom.google.com/c/ecommerce_001"
    },
    {
      "id": "marketing_001",
      "name": "Especialista en Marketing Digital",
      "description": "Curso especializado en marketing digital y estrategias online",
      "ownerId": "coord.marketing@instituto.edu",
      "creationTime": "2024-01-20T14:30:00Z",
      "updateTime": "2024-01-20T14:30:00Z",
      "enrollmentCode": "MARK2024",
      "courseState": "ACTIVE",
      "alternateLink": "https://classroom.google.com/c/marketing_001"
    }
  ]
}
```

**EJEMPLO app/fixtures/students.json**:
```json
{
  "students": [
    {
      "userId": "student_001",
      "courseId": "ecommerce_001",
      "profile": {
        "id": "student_001",
        "name": {
          "givenName": "Juan",
          "familyName": "Pérez"
        },
        "emailAddress": "juan.perez@example.com",
        "specialization": "ecommerce"
      }
    },
    {
      "userId": "student_002",
      "courseId": "marketing_001",
      "profile": {
        "id": "student_002",
        "name": {
          "givenName": "María",
          "familyName": "García"
        },
        "emailAddress": "maria.garcia@example.com",
        "specialization": "marketing"
      }
    }
  ]
}
```

**EJEMPLO app/fixtures/mock-users.json**:
```json
{
  "users": [
    {
      "id": "admin-001",
      "email": "admin@semillero.digital", 
      "password": "admin123",
      "role": "administrador",
      "name": "Administrador Sistema"
    },
    {
      "id": "coord-001", 
      "email": "coordinador@semillero.digital",
      "password": "coord123", 
      "role": "coordinador",
      "name": "María González"
    },
    {
      "id": "teacher-001",
      "email": "profesor1@semillero.digital",
      "password": "teacher123",
      "role": "docente", 
      "name": "Carlos Rodríguez"
    },
    {
      "id": "teacher-002",
      "email": "profesor2@semillero.digital",
      "password": "teacher123",
      "role": "docente",
      "name": "Laura Fernández"
    },
    {
      "id": "student-001",
      "email": "estudiante1@semillero.digital", 
      "password": "student123",
      "role": "estudiante",
      "name": "Ana Martínez"
    },
    {
      "id": "student-002",
      "email": "estudiante2@semillero.digital",
      "password": "student123", 
      "role": "estudiante",
      "name": "Pedro López"
    }
  ]
}
```

**EJEMPLO scripts/seed.py**:
```python
import json
import os
from datetime import datetime, timedelta
import random

def generate_courses():
    """Generar solo los dos cursos especializados con entregas a tiempo y atrasadas"""
    courses = [
        {
            "id": "ecommerce_001",
            "name": "Especialista en Ecommerce",
            "description": "Curso especializado en comercio electrónico y ventas online",
            "ownerId": "coord.ecommerce@instituto.edu",
            "creationTime": (datetime.now() - timedelta(days=30)).isoformat() + "Z",
            "updateTime": (datetime.now() - timedelta(days=1)).isoformat() + "Z",
            "enrollmentCode": "ECOMM2024",
            "courseState": "ACTIVE",
            "alternateLink": "https://classroom.google.com/c/ecommerce_001"
        },
        {
            "id": "marketing_001",
            "name": "Especialista en Marketing Digital",
            "description": "Curso especializado en marketing digital y estrategias online",
            "ownerId": "coord.marketing@instituto.edu",
            "creationTime": (datetime.now() - timedelta(days=25)).isoformat() + "Z",
            "updateTime": (datetime.now() - timedelta(days=2)).isoformat() + "Z",
            "enrollmentCode": "MARK2024",
            "courseState": "ACTIVE",
            "alternateLink": "https://classroom.google.com/c/marketing_001"
        }
    ]
    
    return {"courses": courses}

def generate_students(num_students: int = 40):
    """Generar estudiantes distribuidos entre las dos especializaciones"""
    students = []
    courses = ["ecommerce_001", "marketing_001"]
    specializations = ["ecommerce", "marketing"]
    
    for i in range(1, num_students + 1):
        course_id = courses[i % 2]  # Alternar entre cursos
        specialization = specializations[i % 2]
        
        student = {
            "userId": f"student_{i:03d}",
            "courseId": course_id,
            "profile": {
                "id": f"student_{i:03d}",
                "name": {
                    "givenName": f"Estudiante{i}",
                    "familyName": f"Apellido{i}"
                },
                "emailAddress": f"student{i:03d}@example.com",
                "specialization": specialization
            }
        }
        students.append(student)
    
    return {"students": students}

def main():
    fixtures_dir = os.path.join(os.path.dirname(__file__), "..", "app", "fixtures")
    
    # Generar cursos especializados
    courses_data = generate_courses()
    with open(os.path.join(fixtures_dir, "courses.json"), "w", encoding="utf-8") as f:
        json.dump(courses_data, f, indent=2, ensure_ascii=False)
    
    # Generar estudiantes distribuidos
    students_data = generate_students(40)
    with open(os.path.join(fixtures_dir, "students.json"), "w", encoding="utf-8") as f:
        json.dump(students_data, f, indent=2, ensure_ascii=False)
    
    print("Fixtures especializados generados exitosamente")

if __name__ == "__main__":
    main()
```

**VALIDACIÓN**:
```bash
docker-compose exec backend python scripts/seed.py
docker-compose exec backend python -c "import app.fixtures"
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(backend): add realistic fixtures and seed data generator

- Add courses.json with specialized courses (Ecommerce, Marketing)
- Add students.json with 40+ students distributed across courses
- Add coursework.json with assignments and due dates
- Add submissions.json with on-time and late submissions
- Add user_profiles.json with complete user information
- Add scripts/seed.py for data generation
- Ensure data variability for realistic KPIs

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 6.5: Contrato de Paginación y Errores

**TAREA**: Definir estándares de paginación y manejo de errores.

**ENTREGABLES**:
- Estándares de paginación con `nextPageToken`
- Ejemplos de errores HTTP estándar
- Validación de respuestas

**EJEMPLO Paginación**:
```python
# Respuesta con paginación
{
  "courses": [...],
  "nextPageToken": "eyJjdXJzb3IiOiIxMCJ9"  # Base64 encoded cursor
}

# Request con paginación
GET /api/v1/courses?page_size=10&page_token=eyJjdXJzb3IiOiIxMCJ9
```

**EJEMPLO Errores HTTP**:
```python
# Error 400 - Bad Request
{
  "detail": "Invalid page_size parameter. Must be between 1 and 100",
  "status_code": 400,
  "error_type": "validation_error"
}

# Error 404 - Not Found
{
  "detail": "Course with id 'course_999' not found",
  "status_code": 404,
  "error_type": "not_found"
}

# Error 422 - Unprocessable Entity
{
  "detail": [
    {
      "loc": ["query", "page_size"],
      "msg": "ensure this value is greater than or equal to 1",
      "type": "value_error.number.not_ge"
    }
  ],
  "status_code": 422,
  "error_type": "validation_error"
}
```

**VALIDACIÓN**:
```bash
# Test paginación
curl "http://localhost:8000/api/v1/courses?page_size=5"
curl "http://localhost:8000/api/v1/courses?page_size=5&page_token=eyJjdXJzb3IiOiI1In0"

# Test errores
curl "http://localhost:8000/api/v1/courses?page_size=0"  # 422
curl "http://localhost:8000/api/v1/courses/999/students"  # 404
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(backend): implement pagination and error handling standards

- Add nextPageToken pagination support
- Implement pageSize validation (1-100 range)
- Add 400 error for invalid pageToken
- Add 404 error for non-existent resources
- Add 422 error for invalid parameters
- Standardize JSON error responses
- Add comprehensive error handling tests

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 7: Google Driver Completo con OAuth 2.0

**TAREA**: Implementar driver Google completo con OAuth 2.0 real.

**ENTREGABLES**:
- `classroom_google.py` (implementación real con OAuth)
- `token_manager.py` (manejo de tokens)
- `auth.py` (endpoints OAuth)
- URLs + query params según REST Reference
- Error handling robusto

**EJEMPLO app/services/classroom_google.py**:
```python
import httpx
import os
from typing import List, Optional, Dict, Any
from app.models.course import Course, CourseList
from app.models.student import Student, StudentList
from app.services.token_manager import TokenManager

class ClassroomGoogle:
    def __init__(self):
        self.base_url = "https://classroom.googleapis.com/v1"
        self.client_id = os.getenv("GOOGLE_CLASSROOM_CLIENT_ID")
        self.client_secret = os.getenv("GOOGLE_CLASSROOM_CLIENT_SECRET")
        self.redirect_uri = os.getenv("GOOGLE_CLASSROOM_REDIRECT_URI")
        self.scopes = [
            "https://www.googleapis.com/auth/classroom.courses.readonly",
            "https://www.googleapis.com/auth/classroom.rosters.readonly",
            "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
            "https://www.googleapis.com/auth/classroom.profile.emails"
        ]
        self.token_manager = TokenManager()

    async def get_authorization_url(self) -> str:
        """Generar URL de autorización OAuth 2.0"""
        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "scope": " ".join(self.scopes),
            "response_type": "code",
            "access_type": "offline",
            "prompt": "consent"
        }
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"https://accounts.google.com/o/oauth2/auth?{query_string}"

    async def exchange_code_for_token(self, code: str) -> Dict[str, Any]:
        """Intercambiar código de autorización por tokens"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": self.redirect_uri
                }
            )
            response.raise_for_status()
            return response.json()

    async def refresh_access_token(self, refresh_token: str) -> Dict[str, Any]:
        """Renovar access token usando refresh token"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "refresh_token": refresh_token,
                    "grant_type": "refresh_token"
                }
            )
            response.raise_for_status()
            return response.json()

    async def make_authenticated_request(self, endpoint: str, access_token: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Realizar request autenticado a Classroom API"""
        url = f"{self.base_url}/{endpoint}"
        headers = {"Authorization": f"Bearer {access_token}"}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, params=params or {})
            response.raise_for_status()
            return response.json()

    async def list_courses(self, page_size: int = 10, page_token: Optional[str] = None, access_token: Optional[str] = None) -> CourseList:
        """Listar cursos desde Google Classroom API"""
        if not access_token:
            raise ValueError("Access token required for Google Classroom API")
        
        params = {
            "pageSize": page_size,
            "pageToken": page_token
        }
        
        # Realizar request autenticado
        response = await self.make_authenticated_request("courses", access_token, params)
        
        courses = [Course(**course) for course in response.get("courses", [])]
        return CourseList(
            courses=courses,
            nextPageToken=response.get("nextPageToken")
        )

    async def list_students(self, course_id: str, page_size: int = 10, page_token: Optional[str] = None, access_token: Optional[str] = None) -> StudentList:
        """Listar estudiantes de un curso desde Google Classroom API"""
        if not access_token:
            raise ValueError("Access token required for Google Classroom API")
        
        params = {
            "pageSize": page_size,
            "pageToken": page_token
        }
        
        response = await self.make_authenticated_request(f"courses/{course_id}/students", access_token, params)
        
        students = [Student(**student) for student in response.get("students", [])]
        return StudentList(
            students=students,
            nextPageToken=response.get("nextPageToken")
        )

    async def list_course_work(self, course_id: str, page_size: int = 10, page_token: Optional[str] = None, access_token: Optional[str] = None):
        """Listar tareas de un curso desde Google Classroom API"""
        if not access_token:
            raise ValueError("Access token required for Google Classroom API")
        
        params = {
            "pageSize": page_size,
            "pageToken": page_token
        }
        
        return await self.make_authenticated_request(f"courses/{course_id}/courseWork", access_token, params)

    async def list_student_submissions(self, course_id: str, course_work_id: str, page_size: int = 10, page_token: Optional[str] = None, access_token: Optional[str] = None):
        """Listar entregas de estudiantes desde Google Classroom API"""
        if not access_token:
            raise ValueError("Access token required for Google Classroom API")
        
        params = {
            "pageSize": page_size,
            "pageToken": page_token
        }
        
        return await self.make_authenticated_request(f"courses/{course_id}/courseWork/{course_work_id}/studentSubmissions", access_token, params)

    async def get_student_profile(self, user_id: str, access_token: Optional[str] = None):
        """Obtener perfil de usuario desde Google Classroom API"""
        if not access_token:
            raise ValueError("Access token required for Google Classroom API")
        
        return await self.make_authenticated_request(f"userProfiles/{user_id}", access_token)
```

**EJEMPLO app/services/token_manager.py**:
```python
import os
import json
from typing import Dict, Optional
from datetime import datetime, timedelta

class TokenManager:
    def __init__(self):
        self.tokens_file = os.getenv("TOKENS_FILE", "tokens.json")
    
    def store_token(self, user_id: str, tokens: Dict[str, Any]) -> None:
        """Almacenar tokens de usuario"""
        tokens_data = self._load_tokens()
        tokens_data[user_id] = {
            **tokens,
            "stored_at": datetime.now().isoformat()
        }
        self._save_tokens(tokens_data)
    
    def get_valid_token(self, user_id: str) -> Optional[str]:
        """Obtener token válido para usuario"""
        tokens_data = self._load_tokens()
        user_tokens = tokens_data.get(user_id)
        
        if not user_tokens:
            return None
        
        # Verificar si el token está expirado
        expires_at = user_tokens.get("expires_at")
        if expires_at and datetime.fromisoformat(expires_at) <= datetime.now():
            # Intentar renovar con refresh token
            refresh_token = user_tokens.get("refresh_token")
            if refresh_token:
                return self.refresh_if_needed(user_id)
            return None
        
        return user_tokens.get("access_token")
    
    def refresh_if_needed(self, user_id: str) -> Optional[str]:
        """Renovar token si es necesario - IMPLEMENTACIÓN COMPLETA"""
        tokens_data = self._load_tokens()
        user_tokens = tokens_data.get(user_id)
        
        if not user_tokens or not user_tokens.get("refresh_token"):
            return None
        
        # Implementar lógica real de renovación
        try:
            from app.services.classroom_google import ClassroomGoogle
            classroom_google = ClassroomGoogle()
            
            # LECCIÓN APRENDIDA: Refresh automático de tokens
            new_tokens = await classroom_google.refresh_access_token(
                user_tokens["refresh_token"]
            )
            
            # Actualizar tokens almacenados
            self.store_token(user_id, new_tokens)
            return new_tokens.get("access_token")
        except Exception:
            # Si falla el refresh, retornar None para forzar re-autenticación
            return None
    
    def _load_tokens(self) -> Dict[str, Any]:
        """Cargar tokens desde archivo"""
        if os.path.exists(self.tokens_file):
            with open(self.tokens_file, 'r') as f:
                return json.load(f)
        return {}
    
    def _save_tokens(self, tokens_data: Dict[str, Any]) -> None:
        """Guardar tokens en archivo"""
        with open(self.tokens_file, 'w') as f:
            json.dump(tokens_data, f, indent=2)
```

**EJEMPLO app/api/v1/auth.py**:
```python
from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any
from app.services.classroom_google import ClassroomGoogle
from app.services.token_manager import TokenManager

router = APIRouter()
classroom_google = ClassroomGoogle()
token_manager = TokenManager()

@router.get("/auth/google/authorize")
async def google_authorize():
    """Obtener URL de autorización OAuth 2.0"""
    try:
        auth_url = await classroom_google.get_authorization_url()
        return {"authorization_url": auth_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auth/google/callback")
async def google_callback(code: str = Query(...)):
    """Procesar callback OAuth 2.0"""
    try:
        tokens = await classroom_google.exchange_code_for_token(code)
        
        # Obtener información del usuario
        user_info = await classroom_google.make_authenticated_request(
            "userProfiles/me", 
            tokens["access_token"]
        )
        
        user_id = user_info["id"]
        
        # Almacenar tokens
        token_manager.store_token(user_id, tokens)
        
        return {
            "user_id": user_id,
            "access_token": tokens["access_token"],
            "expires_in": tokens.get("expires_in", 3600)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/auth/google/refresh")
async def refresh_token(refresh_token: str):
    """Renovar access token"""
    try:
        new_tokens = await classroom_google.refresh_access_token(refresh_token)
        return new_tokens
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```

**VALIDACIÓN**:
```bash
# Validación OAuth endpoints
curl http://localhost:8000/api/v1/auth/google/authorize
curl -X POST "http://localhost:8000/api/v1/auth/google/callback?code=test_code"

# Validación dual driver
DATA_DRIVER=mock docker-compose up backend --detach
DATA_DRIVER=google docker-compose up backend --detach

# Validación con tokens
curl -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:8000/api/v1/courses
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(backend): implement Google OAuth 2.0 driver with real API integration

- Add ClassroomGoogle service with OAuth 2.0 flow
- Add TokenManager for access/refresh token handling
- Add /api/v1/auth/google/authorize endpoint
- Add /api/v1/auth/google/callback endpoint
- Add /api/v1/auth/google/refresh endpoint
- Implement real Google Classroom API integration
- Add comprehensive OAuth error handling

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 8: Documentación y Validación

**TAREA**: Crear documentación y validación final.

**ENTREGABLES**:
- `README.md` completo
- Validación completa del sistema
- Comandos de testing

**EJEMPLO README.md**:
```markdown
# Classroom Backend API

Backend FastAPI para integración con Google Classroom API usando enfoque Docker-First.

## Tecnologías

- Python 3.11+
- FastAPI 0.104+
- Pydantic 2.5+
- Docker + Docker Compose
- httpx para requests HTTP
- pytest para testing

## Desarrollo

### Levantar el proyecto
```bash
docker-compose up backend
```

### Ejecutar tests
```bash
docker-compose exec backend pytest tests/
```

### Cambiar driver de datos
```bash
# Usar driver mock (default)
DATA_DRIVER=mock docker-compose up backend

# Usar driver google (stub)
DATA_DRIVER=google docker-compose up backend
```

### Generar fixtures
```bash
docker-compose exec backend python scripts/seed.py
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/v1/courses` - Listar cursos
- `GET /api/v1/courses/{course_id}/students` - Listar estudiantes de un curso
- `GET /api/v1/courses/{course_id}/coursework` - Listar tareas de un curso
- `GET /api/v1/courses/{course_id}/coursework/{course_work_id}/submissions` - Listar entregas
- `GET /api/v1/user-profiles/{user_id}` - Obtener perfil de usuario

## Estructura del Proyecto

```
app/
├── api/v1/          # Endpoints FastAPI
├── models/          # Pydantic models
├── services/        # Lógica de negocio
└── fixtures/        # Datos de prueba

scripts/
└── seed.py          # Generador de fixtures

tests/
├── test_api.py      # Tests de endpoints
├── test_models.py   # Tests de models
└── test_services.py # Tests de servicios
```

## Variables de Entorno

- `DATA_DRIVER`: Driver de datos (`mock` o `google`)
- `GOOGLE_CLASSROOM_API_KEY`: API key de Google Classroom
- `GOOGLE_CLASSROOM_CLIENT_ID`: Client ID de Google Classroom
- `GOOGLE_CLASSROOM_CLIENT_SECRET`: Client secret de Google Classroom

## Métricas de Éxito

### Indicadores Alcanzados
- ✅ 8 Fases Completadas: Todas las fases del contrato implementadas
- ✅ 0 Errores Críticos: Sistema funcionando sin errores
- ✅ 100% Cobertura API: Todos los endpoints implementados
- ✅ Dual Driver: MOCK y GOOGLE funcionando perfectamente
- ✅ OAuth 2.0: Flujo de autenticación completo
- ✅ Docker-First: Despliegue containerizado exitoso

### Estadísticas del Proyecto
- **Archivos Creados**: 25+ archivos
- **Líneas de Código**: 1000+ líneas
- **Endpoints API**: 6 endpoints principales
- **Modelos Pydantic**: 5 modelos de datos
- **Tiempo de Desarrollo**: ~4 horas
- **Tasa de Éxito**: 100% (sin fallos críticos)

## Principios Clave Aprendidos

### 1. Docker-First Mindset
> "Si no funciona en Docker, no funciona en producción"

### 2. Abstracción Temprana
> "Implementar interfaces antes que implementaciones específicas"

### 3. Configuración Externa
> "Nunca hardcodear configuración sensible"

### 4. Testing Incremental
> "Probar cada componente antes de integrar"

### 5. Documentación Viva
> "Documentar mientras se desarrolla, no después"

## Lección Principal del Proyecto

> **"La combinación de Docker-First + Abstracción de Datos + OAuth 2.0 + FastAPI es una stack ganadora para APIs de integración"**

### Impacto del Proyecto
- **Desarrollo Acelerado**: Docker-First redujo tiempo de setup
- **Calidad de Código**: Pydantic + FastAPI = código robusto
- **Flexibilidad**: Sistema dual permite desarrollo sin dependencias
- **Escalabilidad**: Arquitectura preparada para crecimiento
- **Mantenibilidad**: Código limpio y bien estructurado
```

**VALIDACIÓN**:
```bash
docker-compose up --detach
docker-compose ps
curl http://localhost:8000/api/v1/courses
docker-compose exec backend pytest tests/
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "docs(backend): add comprehensive documentation and validation

- Add complete README.md with Docker-First instructions
- Document all API endpoints with examples
- Add environment variables documentation
- Add project structure overview
- Add development and testing commands
- Add troubleshooting section
- Validate complete system functionality

Nerdearla Vibeathon - 2025"
```

---

## VALIDACIÓN DOCKER POR FASE

### CRITERIOS DE BLOQUEO
- ❌ **NO continuar** si Docker no funciona
- ❌ **NO continuar** si comandos Docker fallan
- ❌ **NO continuar** si la comunicación entre servicios no funciona
- ✅ **SÍ continuar** solo cuando Docker funciona perfectamente

### COMANDOS DE VALIDACIÓN POR FASE

#### FASE 1: Setup Inicial
```bash
docker-compose up backend --detach
docker-compose ps backend
curl http://localhost:8000/health
```

#### FASE 2: Estructura
```bash
docker-compose exec backend python -c "import app.main"
docker-compose exec backend pytest --version
```

#### FASE 3: Models
```bash
docker-compose exec backend pytest tests/test_models.py
docker-compose exec backend python -m pytest tests/test_models.py
```

#### FASE 4: Servicios
```bash
docker-compose exec backend python -c "from app.services.classroom import classroom_service"
docker-compose exec backend python -c "from app.services.classroom import list_courses, list_students"
```

#### FASE 5: Endpoints
```bash
curl http://localhost:8000/api/v1/courses
curl http://localhost:8000/api/v1/courses/1/students
```

#### FASE 6: Fixtures
```bash
docker-compose exec backend python scripts/seed.py
docker-compose exec backend python -c "import app.fixtures"
```

#### FASE 7: Google Driver
```bash
DATA_DRIVER=google docker-compose up backend --detach
DATA_DRIVER=mock docker-compose up backend --detach
```

#### FASE 8: Validación Final
```bash
docker-compose up --detach
docker-compose ps
curl http://localhost:8000/api/v1/courses
docker-compose exec backend pytest tests/
```

### COMANDOS DE LIMPIEZA
```bash
# Limpiar contenedores
docker-compose down
docker-compose down --volumes
docker system prune -f

# Reconstruir imágenes
docker-compose build --no-cache
docker-compose up --build
```

---

## CHECKLIST DE IMPLEMENTACIÓN

### FASE 1: Setup Inicial Docker-First
- [ ] `pyproject.toml` configurado con dependencias
- [ ] `Dockerfile` multi-stage creado (dev + prod)
- [ ] `docker-compose.yml` configurado
- [ ] `.env.example` creado
- [ ] **VALIDACIÓN**: `docker-compose up backend` levanta FastAPI
- [ ] **VALIDACIÓN**: `curl http://localhost:8000/health` responde

### FASE 2: Estructura de Carpetas
- [ ] Carpetas `/app/api/v1/`, `/app/models/`, `/app/services/` creadas
- [ ] `__init__.py` en cada carpeta
- [ ] `app/main.py` configurado
- [ ] **VALIDACIÓN**: `docker-compose exec backend python -c "import app.main"` ejecuta sin errores
- [ ] **VALIDACIÓN**: `docker-compose exec backend pytest --version` funciona

### FASE 3: Pydantic Models
- [ ] `Course` model creado
- [ ] `Student` model creado
- [ ] `CourseWork` model creado
- [ ] `StudentSubmission` model creado
- [ ] `UserProfile` model creado
- [ ] Tests de models creados
- [ ] **VALIDACIÓN**: `docker-compose exec backend pytest tests/test_models.py` pasa
- [ ] **VALIDACIÓN**: `docker-compose exec backend python -m pytest tests/test_models.py` pasa

### FASE 4: Servicios de Datos
- [ ] `classroom.py` implementado
- [ ] `classroom_mock.py` implementado
- [ ] `classroom_google.py` implementado
- [ ] Driver conmutables funcionando
- [ ] **VALIDACIÓN**: `docker-compose exec backend python -c "from app.services.classroom import classroom_service"` ejecuta
- [ ] **VALIDACIÓN**: `docker-compose exec backend python -c "from app.services.classroom import list_courses, list_students"` ejecuta

### FASE 5: FastAPI Endpoints
- [ ] Endpoint `/api/v1/courses` implementado
- [ ] Endpoint `/api/v1/courses/{course_id}/students` implementado
- [ ] Endpoint `/api/v1/courses/{course_id}/coursework` implementado
- [ ] Endpoint `/api/v1/courses/{course_id}/coursework/{course_work_id}/submissions` implementado
- [ ] Endpoint `/api/v1/user-profiles/{user_id}` implementado
- [ ] Health check `/health` implementado
- [ ] **VALIDACIÓN**: `curl http://localhost:8000/api/v1/courses` responde con datos
- [ ] **VALIDACIÓN**: `curl http://localhost:8000/api/v1/courses/1/students` responde

### FASE 6: Fixtures y Seed
- [ ] `fixtures/courses.json` creado
- [ ] `fixtures/students.json` creado
- [ ] `fixtures/coursework.json` creado
- [ ] `fixtures/submissions.json` creado
- [ ] `fixtures/user_profiles.json` creado
- [ ] `scripts/seed.py` implementado
- [ ] **VALIDACIÓN**: `docker-compose exec backend python scripts/seed.py` ejecuta sin errores
- [ ] **VALIDACIÓN**: `docker-compose exec backend python -c "import app.fixtures"` funciona

### FASE 7: Google Driver Stub
- [ ] `classroom_google.py` implementado como stub
- [ ] URLs + query params según REST Reference
- [ ] Error handling implementado
- [ ] **VALIDACIÓN**: `DATA_DRIVER=google docker-compose up backend` levanta sin errores
- [ ] **VALIDACIÓN**: `DATA_DRIVER=mock docker-compose up backend` levanta sin errores

### FASE 8: Documentación Docker-First
- [ ] `README.md` creado con instrucciones Docker-First
- [ ] Instrucciones `docker-compose` documentadas
- [ ] Comandos de testing documentados
- [ ] Variables de entorno documentadas
- [ ] **VALIDACIÓN**: `docker-compose up` levanta todo el sistema
- [ ] **VALIDACIÓN**: `docker-compose exec backend pytest tests/` pasa
- [ ] **VALIDACIÓN**: Sistema completo funciona en Docker

---

## INSTRUCCIONES PARA CHECKLIST

**IMPORTANTE**: Marcar cada tarea como completada `[x]` ÚNICAMENTE cuando:

1. ✅ **La tarea esté completamente implementada**
2. ✅ **Los comandos de validación Docker pasen exitosamente**
3. ✅ **Se haya confirmado que funciona correctamente**

**NO marcar** `[x]` si:
- ❌ La tarea está "en progreso" pero no terminada
- ❌ Los comandos de validación Docker fallan
- ❌ No se ha confirmado que funciona correctamente

**Proceso obligatorio**:
1. Implementar la tarea
2. Ejecutar comandos de validación Docker
3. Confirmar que funciona correctamente
4. **SOLO ENTONCES** marcar como `[x]`

---

## ESTÁNDARES DE CÓDIGO

- **Black** + **isort** + **pylint** activos
- Sin `Any` implícitos (type hints completos)
- Nombres y rutas exactamente como declarados
- Documentación en docstrings
- Tests unitarios para cada componente

---

## CRITERIOS DE ACEPTACIÓN FINAL (MEJORADOS CON PRUEBAS E2E)

### Pruebas Funcionales Obligatorias
- ✅ **Backend**: `curl http://localhost:8000/api/v1/courses` devuelve array no vacío con mínimo 2 cursos
- ✅ **Backend**: `curl http://localhost:8000/api/v1/courses/{id}/students` devuelve array no vacío con mínimo 5 estudiantes
- ✅ **Backend**: `curl http://localhost:8000/api/v1/courses/{id}/coursework` devuelve array no vacío con mínimo 2 entregas
- ✅ **Backend**: `curl http://localhost:8000/api/v1/driver/info` devuelve `{"demo_mode": "mock"}` cuando se ejecuta en demo

### Pruebas de Aceptación (End-to-End / E2E)
- ✅ **Al menos 1 prueba E2E exitosa**: Flujo completo backend → frontend → validación de datos
- ✅ **Tests Playwright o Vitest**: Simulan flujo real (login profesor → overview KPIs → students → profile → reports)
- ✅ **Criterios de aceptación requieren**: Al menos 1 prueba E2E exitosa antes de cerrar cada contrato

### Datos MOCK Reproducibles
- ✅ **Fixtures incluyen**: Mínimo 2 cursos, 2 profesores, 5 alumnos y 2 entregas (una a tiempo, otra atrasada)
- ✅ **Validación explícita**: KPIs y gráficos muestran números >0
- ✅ **Dataset especializado**: Solo "Especialista en Ecommerce" y "Especialista en Marketing Digital"

### Validación de Paginación y Errores
- ✅ **Paginación**: `curl "http://localhost:8000/api/v1/courses?pageSize=2"` devuelve exactamente 2 cursos
- ✅ **Errores**: `curl "http://localhost:8000/api/v1/courses?pageToken=invalid"` devuelve JSON de error con status `400`
- ✅ **Manejo de errores**: Endpoints con `pageToken` inválido devuelven status `400` o `404`

### Indicadores de DEMO_MODE
- ✅ **Backend**: `GET /api/v1/driver/info` devuelve `{"demo_mode": "mock"}` cuando se ejecuta en demo
- ✅ **Frontend**: Muestra badge visual (MOCK/GOOGLE) en la interfaz
- ✅ **Validación**: Sistema dual MOCK/GOOGLE funciona con conmutación transparente

### Checklist de Smoke Tests (7 pasos rápidos para QA manual)
- ✅ **1. make up** - Sistema levantado correctamente
- ✅ **2. curl /health** - Backend responde con status 200
- ✅ **3. curl /api/v1/courses** - Lista cursos con datos
- ✅ **4. curl /api/v1/courses/{id}/students** - Lista estudiantes con datos
- ✅ **5. curl /api/v1/driver/info** - Muestra demo_mode=mock
- ✅ **6. Paginación** - Funciona con pageSize=2
- ✅ **7. Errores** - Devuelve 400 para pageToken inválido

### Criterios Técnicos
- ✅ `docker-compose up backend` levanta FastAPI y la API responde en `http://localhost:8000`
- ✅ `docker-compose exec backend pytest tests/` pasa con cobertura >90%
- ✅ Driver `mock` funciona sin autenticación (datos de fixtures)
- ✅ Driver `google` funciona con OAuth 2.0 (datos reales de Classroom API)
- ✅ Conmutación transparente entre drivers via `DATA_DRIVER` environment variable
- ✅ Endpoints OAuth `/api/v1/auth/google/*` funcionan correctamente
- ✅ Endpoints principales soportan autenticación opcional via `Authorization` header
- ✅ `docker-compose exec backend python -m pytest tests/test_models.py` y `docker-compose exec backend python -m pytest tests/test_api.py` pasan
- ✅ README explica claramente cómo trabajar con Docker-First y ambos drivers
- ✅ Health check `/health` responde correctamente
- ✅ Sistema completo funciona en Docker sin dependencias externas
- ✅ Credenciales Google Classroom API validadas y funcionando

---

---

## LECCIONES APRENDIDAS INTEGRADAS

### 🔧 MEJORAS TÉCNICAS

#### **1. CORS Middleware Personalizado**
- **Problema**: CORS estándar no maneja OPTIONS correctamente
- **Solución**: Middleware personalizado con manejo explícito de preflight
- **Implementación**: `CustomCORSMiddleware` con headers completos

#### **2. Manejo de Errores HTTP**
- **Problema**: Errores genéricos no informativos
- **Solución**: Exception handler específico para HTTPException
- **Implementación**: Respuestas JSON estructuradas con status codes

#### **3. Validación de Servicios**
- **Problema**: No se verifica que servicios estén funcionando
- **Solución**: Comandos curl para verificar endpoints
- **Implementación**: Validación de health checks y CORS

### 📋 COMANDOS DE VALIDACIÓN ACTUALIZADOS

```bash
# Verificación de servicios
curl -I http://localhost:8000/health

# Testing de CORS
curl -H "Origin: http://localhost:3000" -X OPTIONS http://localhost:8000/api/v1/courses

# Validación completa
docker-compose up --detach
docker-compose ps
docker-compose exec backend pytest tests/
```

### 🎯 IMPACTO DE LAS MEJORAS

- **CORS**: 100% funcional con preflight requests
- **Errores**: Respuestas estructuradas y informativas
- **Validación**: Verificación automática de servicios
- **Debugging**: Comandos específicos para diagnóstico

---

**Estado**: 📋 CONTRATO1LLM actualizado - Integradas lecciones aprendidas de CORS y validación de servicios

---

## 📋 MAPA DE COMMITS SUGERIDOS - CONTRATO 1 (BACKEND)

### Commits por Fase (Conventional Commits + Sufijo Obligatorio)

#### **Fase 1: Setup Inicial Docker-First**
```bash
feat(backend): add Docker-First FastAPI setup

- Add pyproject.toml with FastAPI dependencies
- Add multi-stage Dockerfile (dev + prod)
- Add docker-compose.yml for orchestration
- Add .env.example with environment variables
- Configure health check endpoint

Nerdearla Vibeathon - 2025
```

#### **Fase 2: Estructura de Carpetas**
```bash
feat(backend): add folder structure and API organization

- Add /app/api/v1/ endpoints structure
- Add /app/models/ Pydantic models directory
- Add /app/services/ business logic layer
- Add /app/fixtures/ test data directory
- Add /tests/ unit tests directory
- Add /scripts/ utility scripts directory
- Configure main.py with CORS middleware

Nerdearla Vibeathon - 2025
```

#### **Fase 3: Pydantic Models**
```bash
feat(backend): implement Pydantic models for Google Classroom API

- Add Course model with all required fields
- Add Student model with profile information
- Add CourseWork model for assignments
- Add StudentSubmission model for submissions
- Add UserProfile model for user data
- Add comprehensive model validation tests

Nerdearla Vibeathon - 2025
```

#### **Fase 4: Servicios de Datos**
```bash
feat(backend): implement dual driver data services (MOCK/GOOGLE)

- Add ClassroomService with driver switching logic
- Add ClassroomMock service for test data
- Add ClassroomGoogle service stub for OAuth
- Implement pagination support in mock driver
- Add driver info endpoint for mode detection
- Support transparent switching via DATA_DRIVER env var

Nerdearla Vibeathon - 2025
```

#### **Fase 5: FastAPI Endpoints**
```bash
feat(backend): implement FastAPI endpoints for Google Classroom API

- Add /api/v1/courses endpoint with pagination
- Add /api/v1/courses/{id}/students endpoint
- Add /api/v1/courses/{id}/coursework endpoint
- Add /api/v1/courses/{id}/coursework/{id}/submissions endpoint
- Add /api/v1/user-profiles/{id} endpoint
- Add /api/v1/driver/info endpoint for mode detection
- Implement proper error handling with HTTPException

Nerdearla Vibeathon - 2025
```

#### **Fase 6: Fixtures y Seed**
```bash
feat(backend): add realistic fixtures and seed data generator

- Add courses.json with specialized courses (Ecommerce, Marketing)
- Add students.json with 40+ students distributed across courses
- Add coursework.json with assignments and due dates
- Add submissions.json with on-time and late submissions
- Add user_profiles.json with complete user information
- Add scripts/seed.py for data generation
- Ensure data variability for realistic KPIs

Nerdearla Vibeathon - 2025
```

#### **Fase 6.5: Paginación y Errores**
```bash
feat(backend): implement pagination and error handling standards

- Add nextPageToken pagination support
- Implement pageSize validation (1-100 range)
- Add 400 error for invalid pageToken
- Add 404 error for non-existent resources
- Add 422 error for invalid parameters
- Standardize JSON error responses
- Add comprehensive error handling tests

Nerdearla Vibeathon - 2025
```

#### **Fase 7: Google OAuth 2.0**
```bash
feat(backend): implement Google OAuth 2.0 driver with real API integration

- Add ClassroomGoogle service with OAuth 2.0 flow
- Add TokenManager for access/refresh token handling
- Add /api/v1/auth/google/authorize endpoint
- Add /api/v1/auth/google/callback endpoint
- Add /api/v1/auth/google/refresh endpoint
- Implement real Google Classroom API integration
- Add comprehensive OAuth error handling

Nerdearla Vibeathon - 2025
```

#### **Fase 8: Documentación**
```bash
docs(backend): add comprehensive documentation and validation

- Add complete README.md with Docker-First instructions
- Document all API endpoints with examples
- Add environment variables documentation
- Add project structure overview
- Add development and testing commands
- Add troubleshooting section
- Validate complete system functionality

Nerdearla Vibeathon - 2025
```

### Commits Adicionales Sugeridos

#### **Tests Unitarios**
```bash
test(backend): add comprehensive test suite

- Add unit tests for all Pydantic models
- Add service layer tests with pagination
- Add API endpoint tests with error handling
- Add OAuth integration tests
- Achieve 90%+ test coverage
- Add test fixtures and mock data

Nerdearla Vibeathon - 2025
```

#### **Mejoras de Performance**
```bash
perf(backend): optimize API performance and caching

- Add response caching for static data
- Optimize database queries in mock driver
- Add request/response compression
- Implement connection pooling
- Add performance monitoring endpoints
- Optimize memory usage in fixtures

Nerdearla Vibeathon - 2025
```

#### **Seguridad**
```bash
security(backend): enhance security and validation

- Add input sanitization for all endpoints
- Implement rate limiting for API calls
- Add CORS security headers
- Validate OAuth tokens properly
- Add security headers middleware
- Implement request logging and monitoring

Nerdearla Vibeathon - 2025
```

#### **DevOps y CI/CD**
```bash
chore(backend): add CI/CD pipeline and deployment

- Add GitHub Actions workflow
- Add Docker image optimization
- Add automated testing pipeline
- Add deployment scripts
- Add environment-specific configurations
- Add monitoring and alerting setup

Nerdearla Vibeathon - 2025
```
