# CONTRATO 4 — Reportes gráficos de avance + Sistema de roles

## Rol
Eres un arquitecto full-stack (Next.js + FastAPI) con enfoque **Docker-First**. Tu objetivo es:
1. Generar **reportes gráficos de avance** (% de entregas a tiempo por cohorte).
2. Implementar un **sistema de roles** con vistas diferenciadas (Alumno, Profesor, Coordinador).

## Fuentes de verdad (obligatorias)
- [Google Classroom REST Reference](https://developers.google.com/classroom/reference/rest)
- Contratos previos:  
  - **CONTRATO 1** (Infra de datos conmutables)  
  - **CONTRATO 2** (Frontend con 3 vistas)  
  - **CONTRATO 3** (MVP completo con autenticación de profesores)

## Requisitos Técnicos (Versiones Específicas)

### Frontend
- **React**: 18.2.0 (versión estable y compatible con todos los componentes)
- **Next.js**: 14.2.28 (compatible con React 18.2)
- **Tailwind CSS**: 3.4.x (compatible con shadcn/ui y Tremor)
- **shadcn/ui**: Última versión (compatible con React 18.2)
- **@tremor/react**: 3.11.0 (diseñado para React 18.2+ y optimizado para visualizaciones de datos)

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

### Referencias Específicas para Reportes y Roles
- [Documentación oficial de Tremor para visualizaciones](https://www.tremor.so/docs/components/charts)
- [Documentación oficial de FastAPI para autenticación y autorización](https://fastapi.tiangolo.com/tutorial/security/)
- [Documentación oficial de Next.js para autenticación](https://nextjs.org/docs/authentication)
- [Documentación oficial de React 18.2 para manejo de contexto](https://react.dev/reference/react/useContext)
- [Mejores prácticas de seguridad para sistemas de roles](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

## Entregables de esta iteración
1. **Backend (FastAPI) Dual**
   - Endpoint `GET /reports/cohort-progress`:
     - Devuelve JSON con % de entregas a tiempo y tardías por cohorte.
     - Permite agrupar por curso y por estudiante.
     - Parámetros: `cohort_id`, `course_id` (opcionales).
     - Respuesta: `ReportCohortProgress` con métricas agregadas.
     - **NUEVO**: Soporte dual MOCK/GOOGLE con autenticación OAuth opcional.
   - Modelo `ReportCohortProgress` validado con **Pydantic**:
     - `cohort_id`, `cohort_name`, `total_students`, `total_submissions`
     - `on_time_submissions`, `late_submissions`, `on_time_percentage`, `late_percentage`
     - `courses: List[CourseProgress]` con desglose por curso.
     - **NUEVO**: `is_google_data: bool` para indicar fuente de datos.
   - Seguridad: Middleware `RoleAuthMiddleware` para validar rol via whitelist de emails (MOCK):
     - Roles permitidos: `estudiante`, `docente`, `coordinador`, `administrador` definidos por lista blanca de emails.
     - Validación de permisos por endpoint via email en whitelist.
     - Respuesta 403 para emails no autorizados.
     - **WOW OPCIONAL**: Soporte para autenticación Google OAuth en headers (JWT como WOW opcional).
   - Servicio `ReportsService` para cálculos de métricas desde fixtures MOCK.
   - **WOW OPCIONAL**: Servicio `ReportsGoogleService` para métricas desde Google Classroom API.
   - Healthcheck adicional en `/reports/health`.
   - **NUEVO**: Soporte multiidioma con default español, comentarios en código siempre en inglés.

2. **Frontend (Next.js + Tremor + shadcn/ui) Dual**
   - Nueva vista **Reports** (`/reports`):
     - Gráfico de barras Tremor (% entregas on-time vs late por cohorte).
     - 4 KPI cards: promedio entregas, % retrasos, estudiantes activos, cursos monitoreados.
     - Componente `CohortProgressChart` con datos interactivos.
     - Estados loading/empty/error con fallbacks apropiados.
     - **NUEVO**: Indicadores visuales de datos MOCK (Google como WOW opcional).
   - Sistema de **roles** con vistas diferenciadas:
     - **Estudiante** (`estudiante`): `StudentReportsView` - solo progreso personal, métricas individuales.
     - **Docente** (`docente`): `TeacherReportsView` - avance de sus alumnos, KPIs de cursos asignados.
     - **Coordinador** (`coordinador`): `CoordinatorReportsView` - reportes globales, comparación entre cohortes.
     - **Administrador** (`administrador`): `AdminReportsView` - overview global de cursos/alumnos.
     - **NUEVO**: Soporte para datos MOCK (Google como WOW opcional) en todas las vistas.
   - Context `RoleContext` para manejo de estado global de roles.
   - **NUEVO**: Integración con `AuthContext` para autenticación por whitelist de emails (MOCK).
   - Hooks: `useCohortProgress`, `useRole`, `useReports` para datos y permisos.
   - **WOW OPCIONAL**: Hooks `useGoogleReports` para datos desde Google Classroom API.
   - Protección de rutas con `RoleGuard` component.
   - **WOW OPCIONAL**: Protección dual con autenticación Google OAuth opcional.

3. **Infraestructura**
   - Docker Compose actualizado con servicio `backend` + `frontend`.
   - Red `classroom-network` compartida para comunicación entre servicios.
   - Healthcheck adicional en `/reports/health`.
   - Variables de entorno para roles y permisos:
  - `ROLES_WHITELIST`: Lista de emails autorizados por rol
  - `DEMO_MODE`: Modo de operación (`mock` o `google`):
     - `ROLES_WHITELIST`: Lista de emails autorizados por rol (ej: `coord.ecommerce@instituto.edu,coord.marketing@instituto.edu`).
     - `DEMO_MODE`: Modo de operación (`mock` o `google`).
   - Comandos `make up`, `make test` para desarrollo.

4. **Testing**
   - **Backend** (pytest):
     - `tests/test_reports.py`: endpoint `/reports/cohort-progress`, cálculos de métricas.
     - `tests/test_role_auth.py`: middleware de roles, validación de permisos.
     - `tests/test_services.py`: `ReportsService`, agregación de datos.
     - Cobertura >90% en models, services, API, middleware.
   - **Frontend** (Vitest + React Testing Library):
     - `tests/components/Reports.test.tsx`: rendering de reportes, gráficos Tremor.
     - `tests/hooks/useRole.test.ts`: contexto de roles, persistencia.
     - `tests/hooks/useCohortProgress.test.ts`: datos de reportes, estados loading/error.
     - `tests/e2e/reports.spec.ts`: navegación por roles, permisos E2E.
     - Tests E2E: flujo completo de roles con Playwright.

5. **Documentación**
   - README actualizado con:
     - Instrucciones para ejecutar reportes en modo mock.
     - Ejemplos de `curl` por rol (`student`, `teacher`, `coordinator`).
     - Captura o GIF de la vista Reports funcionando.
     - Documentación del sistema de roles y permisos.
     - Comandos de validación del sistema completo.

## Criterios de aceptación (MEJORADOS CON PRUEBAS E2E)

### Pruebas Funcionales Obligatorias
- ✅ **Backend**: `curl http://localhost:8000/api/v1/reports/cohort-progress` devuelve datos agregados correctos (mockeados)
- ✅ **Backend**: `curl http://localhost:8000/api/v1/reports/cohort-progress?cohort_id=ecommerce_001` devuelve datos específicos de cohorte
- ✅ **Backend**: `curl http://localhost:8000/api/v1/driver/info` devuelve `{"demo_mode": "mock"}` cuando se ejecuta en demo
- ✅ **Frontend**: Navegar a `/` y validar que renderiza "Dashboard Overview"
- ✅ **Frontend**: Navegar a `/reports` y validar que renderiza página Reports
- ✅ **Frontend**: Navegar a `/students` y validar que renderiza página Students
- ✅ **Frontend**: Navegar a `/students/[id]` y validar que renderiza perfil de estudiante

### Pruebas de Compatibilidad de Versiones
- ✅ **React**: Verificar que la versión 18.2.0 está instalada y funciona correctamente
- ✅ **Next.js**: Verificar que la versión 14.2.28 está instalada y funciona correctamente
- ✅ **Tailwind CSS**: Verificar que la versión 3.4.x está instalada y funciona correctamente
- ✅ **@tremor/react**: Verificar que la versión 3.11.0 está instalada y los gráficos se renderizan correctamente
- ✅ **shadcn/ui**: Verificar que los componentes de la última versión funcionan correctamente con React 18.2

### Pruebas de Aceptación (End-to-End / E2E)
- ✅ **Al menos 1 prueba E2E exitosa**: Flujo completo login profesor → overview KPIs → students → profile → reports
- ✅ **Tests Playwright o Vitest**: Simulan flujo real con navegación entre páginas
- ✅ **Criterios de aceptación requieren**: Al menos 1 prueba E2E exitosa antes de cerrar cada contrato
- ✅ **Tests E2E**: Navegación, búsqueda, filtros, autenticación, sistema de roles funcionando

### Datos MOCK Reproducibles
- ✅ **Fixtures incluyen**: Mínimo 2 cursos, 2 profesores, 5 alumnos y 2 entregas (una a tiempo, otra atrasada)
- ✅ **Validación explícita**: KPIs y gráficos muestran números >0
- ✅ **Dataset especializado**: Solo "Especialista en Ecommerce" y "Especialista en Marketing Digital"
- ✅ **Frontend muestra**: KPIs con números >0 (Total Students, Total Courses, etc.)
- ✅ **Frontend muestra**: Gráficos de reportes con datos (no vacíos)

### Validación de Paginación y Errores
- ✅ **Paginación**: `curl "http://localhost:8000/api/v1/reports/cohort-progress?pageSize=2"` devuelve exactamente 2 cohortes
- ✅ **Errores**: `curl "http://localhost:8000/api/v1/reports/cohort-progress?pageToken=invalid"` devuelve JSON de error con status `400`
- ✅ **Manejo de errores**: Endpoints con `pageToken` inválido devuelven status `400` o `404`
- ✅ **Frontend**: Estados loading/empty/error implementados en todas las vistas

### Indicadores de DEMO_MODE
- ✅ **Backend**: `GET /api/v1/driver/info` devuelve `{"demo_mode": "mock"}` cuando se ejecuta en demo
- ✅ **Frontend**: Muestra badge visual (MOCK/GOOGLE) en la interfaz
- ✅ **Validación**: Sistema dual MOCK/GOOGLE funciona con conmutación transparente

### Checklist de Smoke Tests (7 pasos rápidos para QA manual)
- ✅ **1. make up** - Sistema levantado correctamente
- ✅ **2. curl /health** - Backend responde con status 200
- ✅ **3. curl /api/v1/reports/cohort-progress** - Lista reportes con datos
- ✅ **4. curl /api/v1/reports/cohort-progress?cohort_id=X** - Reportes con parámetros
- ✅ **5. curl /api/v1/driver/info** - Muestra demo_mode=mock
- ✅ **6. curl /reports** - Página reportes funciona
- ✅ **7. Sistema de roles** - Funciona con tokens JWT

### ✅ Backend
- `GET /reports/cohort-progress` devuelve datos agregados correctos (mockeados).
- Middleware `RoleAuthMiddleware` valida roles via whitelist de emails correctamente.
- Roles se respetan: `estudiante` (solo personal), `docente` (sus cursos), `coordinador` (global), `administrador` (todos los datos).
- **NUEVO**: Soporte MOCK con conmutación transparente via `DEMO_MODE`.
- **WOW OPCIONAL**: Autenticación Google OAuth integrada en reportes.
- Healthcheck `/reports/health` responde correctamente.
- Tests backend pasan al 100% con cobertura >90%.

### ✅ Frontend  
- Vista Reports renderiza al menos 1 gráfico Tremor + 4 KPI cards.
- Sistema de roles funciona: vistas diferenciadas por rol de usuario.
- Context `RoleContext` maneja estado global de roles correctamente.
- Estados loading/empty/error implementados en todas las vistas.
- **NUEVO**: Indicadores visuales de modo activo (MOCK vs Google).
- **NUEVO**: Integración con autenticación Google OAuth.
- Tests frontend pasan al 100% con tests E2E incluidos.

### ✅ Infraestructura
- Docker Compose levanta backend + frontend en red compartida.
- Comandos `make up` y `make test` funcionan correctamente.
- Sistema completo funciona en contenedores sin dependencias externas.
- **NUEVO**: Sistema dual MOCK/GOOGLE funciona end-to-end.

### ✅ Documentación
- README documenta flujo completo de reportes y roles.
- Ejemplos curl por rol documentados y funcionando.
- Captura/GIF de vista Reports con gráfico funcionando.

## Estándares de código
- ESLint + Prettier (frontend).
- Black + isort (backend).
- Sin `any` implícitos en TypeScript.
- Commits documentados por fase.
- Docker-First approach en todo el desarrollo.

## Plan de implementación (5 fases)

### Fase 1: Backend - Reportes y Roles (2-3h)
- Modelo `ReportCohortProgress` con Pydantic validation
- Endpoint `GET /reports/cohort-progress` con parámetros de filtrado
- Middleware `RoleAuthMiddleware` para validar token JWT con roles
- Servicio `ReportsService` para cálculos de métricas
- Tests unitarios: models, API, middleware, servicios
- **COMMIT AL FINALIZAR FASE**: `git add . && git commit -m "feat(backend): implement reports and role-based access control

- Add ReportCohortProgress model with Pydantic validation
- Add /api/v1/reports/cohort-progress endpoint with filtering
- Add RoleAuthMiddleware for JWT token validation
- Add ReportsService for metrics calculations
- Add role-based access control (student/teacher/coordinator)
- Add comprehensive role authentication tests
- Add dual MOCK/GOOGLE support for reports

Nerdearla Vibeathon - 2025"`

### Fase 2: Frontend - Vista Reports (3-4h)
- Página `/reports` con vista Reports
- Gráfico de barras Tremor (% on-time vs late por cohorte)
- 4 KPI cards: promedio entregas, % retrasos, estudiantes activos, cursos
- Estados loading/empty/error con fallbacks apropiados
- Tests unitarios: components, hooks, pages
- **COMMIT AL FINALIZAR FASE**: `git add . && git commit -m "feat(frontend): implement Reports view with Tremor charts

- Add Reports page with cohort progress visualization
- Add Tremor bar chart for on-time vs late submissions
- Add 4 KPI cards (average submissions, delay %, active students, courses)
- Add CohortProgressChart component with interactive data
- Add loading/empty/error states with fallbacks
- Add dual mode support (MOCK/GOOGLE data)
- Add responsive design for mobile devices

Nerdearla Vibeathon - 2025"`

### Fase 3: Sistema de Roles (2-3h)
- Context `RoleContext` para manejo de estado global
- Vistas diferenciadas por rol: Student/Teacher/Coordinator
- Componente `RoleGuard` para protección de rutas
- Hooks: `useCohortProgress`, `useRole`, `useReports`
- Tests E2E: navegación por roles, permisos
- **COMMIT AL FINALIZAR FASE**: `git add . && git commit -m "feat(frontend): implement role-based access control system

- Add RoleContext for global role state management
- Add differentiated views for Student/Teacher/Coordinator roles
- Add RoleGuard component for route protection
- Add useCohortProgress, useRole, useReports hooks
- Add role-based data filtering and permissions
- Add E2E tests for role navigation and permissions
- Add role switching and session management

Nerdearla Vibeathon - 2025"`

### Fase 4: Infraestructura Docker (1h)
- Docker Compose actualizado con red `classroom-network`
- Variables de entorno para roles y permisos:
  - `ROLES_WHITELIST`: Lista de emails autorizados por rol
  - `DEMO_MODE`: Modo de operación (`mock` o `google`)
- Healthcheck adicional en `/reports/health`
- Comandos `make up`, `make test` funcionando
- **COMMIT AL FINALIZAR FASE**: `git add . && git commit -m "chore(infrastructure): add Docker infrastructure for reports and roles

- Update Docker Compose with classroom-network
- Add environment variables for roles and permissions
- Add ROLES_WHITELIST configuration
- Add DEMO_MODE environment variable
- Add health check for /reports/health endpoint
- Add make up and make test commands
- Add monitoring and logging configuration

Nerdearla Vibeathon - 2025"`

### Fase 5: Testing y Documentación (2h)
- Tests backend: reportes, roles, middleware (pytest)
- Tests frontend: componentes, hooks, roles (Vitest)
- Tests E2E: navegación por roles, gráficos (Playwright)
- README actualizado con ejemplos curl por rol
- **COMMIT AL FINALIZAR FASE**: `git add . && git commit -m "test(reports): add comprehensive testing and documentation

- Add backend tests for reports, roles, and middleware (pytest)
- Add frontend tests for components, hooks, and roles (Vitest)
- Add E2E tests for role navigation and charts (Playwright)
- Add comprehensive README with curl examples by role
- Add role-based access documentation
- Add troubleshooting and deployment guides
- Add performance benchmarks and monitoring

Nerdearla Vibeathon - 2025"`

## Comandos de validación

### Validación Backend (MEJORADA CON PRUEBAS FUNCIONALES OBLIGATORIAS)
```bash
# 1. Pruebas funcionales obligatorias antes de cerrar cada fase
echo "=== PRUEBAS FUNCIONALES REPORTES Y ROLES ==="

# Verificar que el backend responde
curl -I http://localhost:8000/health
echo "✅ Health check: $(curl -s http://localhost:8000/health | jq -r '.status')"

# Test endpoint de reportes
echo "=== TEST: Endpoint de reportes ==="
REPORTS_RESPONSE=$(curl -s http://localhost:8000/api/v1/reports/cohort-progress)
echo "Response: $REPORTS_RESPONSE"
if echo "$REPORTS_RESPONSE" | jq -e '.cohorts | length > 0' > /dev/null; then
  echo "✅ Reportes devuelven datos de cohortes"
else
  echo "❌ ERROR: Reportes no devuelven datos de cohortes"
  exit 1
fi

# Test endpoint de reportes con parámetros
echo "=== TEST: Endpoint de reportes con parámetros ==="
REPORTS_PARAMS_RESPONSE=$(curl -s "http://localhost:8000/api/v1/reports/cohort-progress?cohort_id=ecommerce_001")
echo "Response: $REPORTS_PARAMS_RESPONSE"
if echo "$REPORTS_PARAMS_RESPONSE" | jq -e '.cohorts | length > 0' > /dev/null; then
  echo "✅ Reportes con parámetros funcionan"
else
  echo "❌ ERROR: Reportes con parámetros no funcionan"
  exit 1
fi

# 2. Validación de paginación y errores
echo "=== TEST: Validación de paginación ==="
# Test pageSize=2
PAGINATED_RESPONSE=$(curl -s "http://localhost:8000/api/v1/reports/cohort-progress?pageSize=2")
PAGINATED_COUNT=$(echo $PAGINATED_RESPONSE | jq '.cohorts | length')
if [ "$PAGINATED_COUNT" -eq 2 ]; then
  echo "✅ Paginación pageSize=2 funciona: $PAGINATED_COUNT cohortes"
else
  echo "❌ ERROR: Paginación pageSize=2 falló"
  exit 1
fi

# Test pageToken inválido (debe devolver 400)
echo "=== TEST: pageToken inválido ==="
INVALID_TOKEN_RESPONSE=$(curl -s -w "%{http_code}" "http://localhost:8000/api/v1/reports/cohort-progress?pageToken=invalid_token")
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

# 4. Sistema de roles y autenticación
echo "=== TEST: Sistema de roles ==="
# Test endpoint con token JWT válido
echo "=== TEST: Endpoint con token JWT ==="
JWT_RESPONSE=$(curl -s -H "Authorization: Bearer jwt_token_here" http://localhost:8000/api/v1/reports/cohort-progress)
if echo "$JWT_RESPONSE" | jq -e '.cohorts' > /dev/null; then
  echo "✅ Endpoint con token JWT funciona"
else
  echo "⚠️  Endpoint con token JWT no implementado o falló"
fi

# Test middleware de roles con token inválido
echo "=== TEST: Middleware de roles ==="
INVALID_TOKEN_RESPONSE=$(curl -s -w "%{http_code}" -H "Authorization: Bearer invalid_token" http://localhost:8000/api/v1/reports/cohort-progress)
HTTP_CODE=$(echo $INVALID_TOKEN_RESPONSE | tail -c 4)
if [ "$HTTP_CODE" = "403" ]; then
  echo "✅ Middleware de roles devuelve 403 para token inválido"
else
  echo "⚠️  Middleware de roles no implementado o devolvió $HTTP_CODE"
fi

# 5. Checklist de smoke tests (7 pasos rápidos para QA manual)
echo "=== CHECKLIST DE SMOKE TESTS REPORTES ==="
echo "1. ✅ make up - Sistema levantado"
echo "2. ✅ curl /health - Backend responde"
echo "3. ✅ curl /api/v1/reports/cohort-progress - Lista reportes"
echo "4. ✅ curl /api/v1/reports/cohort-progress?cohort_id=X - Reportes con parámetros"
echo "5. ✅ curl /api/v1/driver/info - Muestra demo_mode=mock"
echo "6. ✅ Paginación funciona con pageSize=2"
echo "7. ✅ Sistema de roles funciona con tokens JWT"

# LECCIÓN APRENDIDA: Verificar servicios antes de continuar
echo "1. Verificando servicios backend:"
curl -I http://localhost:8000/health

echo "2. Verificando CORS:"
curl -H "Origin: http://localhost:3000" -X OPTIONS http://localhost:8000/api/v1/reports/cohort-progress

echo "3. Levantando backend:"
docker-compose up backend --detach

echo "4. Test endpoint con token JWT:"
curl -H "Authorization: Bearer jwt_token_here" http://localhost:8000/api/v1/reports/cohort-progress

echo "5. Test middleware de roles:"
curl -H "Authorization: Bearer invalid_token" http://localhost:8000/api/v1/reports/cohort-progress

echo "6. Ejecutando tests:"
docker-compose exec backend pytest tests/test_reports.py -v
```

### Validación Frontend (MEJORADA CON PRUEBAS FUNCIONALES OBLIGATORIAS)
```bash
# 1. Pruebas funcionales obligatorias antes de cerrar cada fase
echo "=== PRUEBAS FUNCIONALES FRONTEND REPORTES ==="

# Verificar que el frontend responde
curl -I http://localhost:3000
echo "✅ Frontend responde: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)"

# Navegar a cada ruta y validar que renderiza datos correctos
echo "=== TEST: Navegación a rutas ==="

# Test ruta principal (/)
echo "=== TEST: Ruta principal (/) ==="
HOME_RESPONSE=$(curl -s http://localhost:3000)
if echo "$HOME_RESPONSE" | grep -q "Dashboard Overview"; then
  echo "✅ Ruta / renderiza Dashboard Overview"
else
  echo "❌ ERROR: Ruta / no renderiza Dashboard Overview"
  exit 1
fi

# Test ruta /reports
echo "=== TEST: Ruta /reports ==="
REPORTS_RESPONSE=$(curl -s http://localhost:3000/reports)
if echo "$REPORTS_RESPONSE" | grep -q "Reports\|Reportes"; then
  echo "✅ Ruta /reports renderiza página Reports"
else
  echo "❌ ERROR: Ruta /reports no renderiza página Reports"
  exit 1
fi

# Test ruta /students
echo "=== TEST: Ruta /students ==="
STUDENTS_RESPONSE=$(curl -s http://localhost:3000/students)
if echo "$STUDENTS_RESPONSE" | grep -q "Students"; then
  echo "✅ Ruta /students renderiza página Students"
else
  echo "❌ ERROR: Ruta /students no renderiza página Students"
  exit 1
fi

# Test ruta /students/[id]
echo "=== TEST: Ruta /students/[id] ==="
STUDENT_PROFILE_RESPONSE=$(curl -s http://localhost:3000/students/student_001)
if echo "$STUDENT_PROFILE_RESPONSE" | grep -q "student_001\|Student Profile"; then
  echo "✅ Ruta /students/[id] renderiza perfil de estudiante"
else
  echo "❌ ERROR: Ruta /students/[id] no renderiza perfil de estudiante"
  exit 1
fi

# 2. Pruebas de aceptación (end-to-end / E2E)
echo "=== TEST: Pruebas E2E con Playwright ==="
# Verificar que Playwright está instalado
if docker-compose exec frontend npx playwright --version > /dev/null 2>&1; then
  echo "✅ Playwright instalado"
  # Ejecutar tests E2E
  docker-compose exec frontend npm run test:smoke-ui
  echo "✅ Tests E2E ejecutados"
else
  echo "⚠️  Playwright no instalado, saltando tests E2E"
fi

# 3. Datos MOCK reproducibles
echo "=== TEST: Validación de datos MOCK ==="
# Verificar que el frontend muestra datos (no páginas vacías)
if echo "$HOME_RESPONSE" | grep -q "Total Students\|Total Courses"; then
  echo "✅ Frontend muestra KPIs con datos"
else
  echo "❌ ERROR: Frontend no muestra KPIs con datos"
  exit 1
fi

# Verificar que hay datos de reportes
if echo "$REPORTS_RESPONSE" | grep -q "chart\|graph\|cohort\|progress"; then
  echo "✅ Frontend muestra gráficos de reportes"
else
  echo "❌ ERROR: Frontend no muestra gráficos de reportes"
  exit 1
fi

# 4. Validación de paginación y errores
echo "=== TEST: Validación de paginación frontend ==="
# Verificar que la paginación funciona (si está implementada)
if echo "$STUDENTS_RESPONSE" | grep -q "pagination\|page\|next\|previous"; then
  echo "✅ Frontend implementa paginación"
else
  echo "⚠️  Frontend no implementa paginación visible"
fi

# 5. Indicadores de DEMO_MODE
echo "=== TEST: Indicadores DEMO_MODE ==="
# Verificar que el frontend muestra badge de modo demo
if echo "$HOME_RESPONSE" | grep -q "MOCK\|DEMO\|MODE"; then
  echo "✅ Frontend muestra indicador de modo demo"
else
  echo "❌ ERROR: Frontend no muestra indicador de modo demo"
  exit 1
fi

# 6. Sistema de roles
echo "=== TEST: Sistema de roles ==="
# Verificar que el sistema de roles funciona
if echo "$REPORTS_RESPONSE" | grep -q "role\|student\|teacher\|coordinator"; then
  echo "✅ Sistema de roles implementado"
else
  echo "⚠️  Sistema de roles no implementado o no visible"
fi

# 7. Checklist de smoke tests (7 pasos rápidos para QA manual)
echo "=== CHECKLIST DE SMOKE TESTS FRONTEND REPORTES ==="
echo "1. ✅ make up - Sistema levantado"
echo "2. ✅ curl / - Frontend responde"
echo "3. ✅ curl /reports - Lista reportes"
echo "4. ✅ curl /students - Lista estudiantes"
echo "5. ✅ curl /students/[id] - Perfil estudiante"
echo "6. ✅ Badge MOCK visible en UI"
echo "7. ✅ Gráficos de reportes funcionando"

# LECCIÓN APRENDIDA: Verificar servicios antes de continuar
echo "1. Verificando servicios frontend:"
curl -I http://localhost:3000

echo "2. Levantando frontend:"
docker-compose up frontend --detach

echo "3. Test vista Reports:"
curl http://localhost:3000/reports

echo "4. Ejecutando tests:"
docker-compose exec frontend npm run test
docker-compose exec frontend npm run test:smoke-ui
```

### Validación Sistema Completo (MEJORADA CON PRUEBAS DE INTEGRACIÓN OBLIGATORIAS)
```bash
# 1. Pruebas funcionales obligatorias antes de cerrar cada fase
echo "=== PRUEBAS DE INTEGRACIÓN REPORTES Y ROLES ==="

# Verificar que el sistema completo funciona
echo "=== TEST: Sistema completo ==="
curl -I http://localhost:8000/health
curl -I http://localhost:3000
echo "✅ Sistema completo responde"

# 2. Pruebas de aceptación (end-to-end / E2E)
echo "=== TEST: Pruebas E2E de integración ==="
# Verificar que Playwright está instalado
if docker-compose exec frontend npx playwright --version > /dev/null 2>&1; then
  echo "✅ Playwright instalado"
  # Ejecutar tests E2E completos
  docker-compose exec frontend npm run test:smoke-ui
  echo "✅ Tests E2E ejecutados"
else
  echo "⚠️  Playwright no instalado, saltando tests E2E"
fi

# 3. Datos MOCK reproducibles
echo "=== TEST: Validación de datos MOCK ==="
# Verificar que el backend muestra datos de reportes
BACKEND_REPORTS_RESPONSE=$(curl -s http://localhost:8000/api/v1/reports/cohort-progress)
if echo "$BACKEND_REPORTS_RESPONSE" | jq -e '.cohorts | length > 0' > /dev/null; then
  echo "✅ Backend muestra datos de reportes"
else
  echo "❌ ERROR: Backend no muestra datos de reportes"
  exit 1
fi

# Verificar que el frontend muestra datos
FRONTEND_RESPONSE=$(curl -s http://localhost:3000)
if echo "$FRONTEND_RESPONSE" | grep -q "Dashboard Overview"; then
  echo "✅ Frontend muestra Dashboard Overview"
else
  echo "❌ ERROR: Frontend no muestra Dashboard Overview"
  exit 1
fi

# Verificar que el frontend muestra reportes
FRONTEND_REPORTS_RESPONSE=$(curl -s http://localhost:3000/reports)
if echo "$FRONTEND_REPORTS_RESPONSE" | grep -q "Reports\|Reportes"; then
  echo "✅ Frontend muestra página de reportes"
else
  echo "❌ ERROR: Frontend no muestra página de reportes"
  exit 1
fi

# 4. Validación de paginación y errores
echo "=== TEST: Validación de paginación y errores ==="
# Verificar que la paginación funciona
PAGINATED_RESPONSE=$(curl -s "http://localhost:8000/api/v1/reports/cohort-progress?pageSize=2")
PAGINATED_COUNT=$(echo $PAGINATED_RESPONSE | jq '.cohorts | length')
if [ "$PAGINATED_COUNT" -eq 2 ]; then
  echo "✅ Paginación funciona correctamente"
else
  echo "❌ ERROR: Paginación no funciona correctamente"
  exit 1
fi

# 5. Indicadores de DEMO_MODE
echo "=== TEST: Indicadores DEMO_MODE ==="
# Verificar que el backend muestra modo demo
DRIVER_INFO=$(curl -s http://localhost:8000/api/v1/driver/info)
DEMO_MODE=$(echo $DRIVER_INFO | jq -r '.demo_mode')
if [ "$DEMO_MODE" = "mock" ]; then
  echo "✅ Backend muestra modo demo correcto: $DEMO_MODE"
else
  echo "❌ ERROR: Backend no muestra modo demo correcto: $DEMO_MODE"
  exit 1
fi

# Verificar que el frontend muestra badge de modo demo
if echo "$FRONTEND_RESPONSE" | grep -q "MOCK\|DEMO\|MODE"; then
  echo "✅ Frontend muestra indicador de modo demo"
else
  echo "❌ ERROR: Frontend no muestra indicador de modo demo"
  exit 1
fi

# 6. Sistema de roles y autenticación
echo "=== TEST: Sistema de roles y autenticación ==="
# Verificar que el sistema de roles funciona
if echo "$FRONTEND_REPORTS_RESPONSE" | grep -q "role\|student\|teacher\|coordinator"; then
  echo "✅ Sistema de roles implementado"
else
  echo "⚠️  Sistema de roles no implementado o no visible"
fi

# 7. Checklist de smoke tests (7 pasos rápidos para QA manual)
echo "=== CHECKLIST DE SMOKE TESTS INTEGRACIÓN REPORTES ==="
echo "1. ✅ make up - Sistema levantado"
echo "2. ✅ Backend - Datos de reportes disponibles"
echo "3. ✅ Frontend - Dashboard Overview funciona"
echo "4. ✅ Frontend - Página de reportes funciona"
echo "5. ✅ Paginación - Funciona correctamente"
echo "6. ✅ DEMO_MODE - Backend y frontend muestran modo mock"
echo "7. ✅ Sistema de roles - Implementado y funcionando"

# LECCIÓN APRENDIDA: Verificación completa paso a paso
echo "1. Verificando servicios backend:"
curl -I http://localhost:8000/health

echo "2. Verificando servicios frontend:"
curl -I http://localhost:3000

echo "3. Verificando CORS:"
curl -H "Origin: http://localhost:3000" -X OPTIONS http://localhost:8000/api/v1/reports/cohort-progress

echo "4. Levantando todo:"
docker-compose up --detach

echo "5. Verificando contenedores:"
docker-compose ps

echo "6. Verificando endpoints:"
curl http://localhost:8000/reports/health
curl http://localhost:3000/reports

echo "7. Ejecutando todos los tests:"
make test
```

> Al finalizar, reporta:
> - Árbol de carpetas actualizado.
> - Ejemplo de JSON `/reports/cohort-progress`.
> - Screenshot/GIF de Reports con gráfico funcionando.
> - Validación completa del sistema en Docker.

---

## LECCIONES APRENDIDAS INTEGRADAS

### 🔧 MEJORAS TÉCNICAS

#### **1. Validación de Servicios**
- **Problema**: No se verifica que servicios estén funcionando antes de tests
- **Solución**: Comandos curl para verificar endpoints paso a paso
- **Implementación**: Verificación de health checks, CORS y contenedores

#### **2. Testing de CORS**
- **Problema**: CORS no se valida en tests de integración
- **Solución**: Comandos específicos para verificar preflight requests
- **Implementación**: `curl -H "Origin" -X OPTIONS` en validación

#### **3. Metodología de Debugging**
- **Problema**: Debugging sin estructura clara
- **Solución**: Pasos ordenados de verificación
- **Implementación**: Secuencia lógica de validación

### 📋 COMANDOS DE VALIDACIÓN ACTUALIZADOS

```bash
# Verificación completa paso a paso
curl -I http://localhost:8000/health
curl -I http://localhost:3000
curl -H "Origin: http://localhost:3000" -X OPTIONS http://localhost:8000/api/v1/reports/cohort-progress
docker-compose up --detach
docker-compose ps
make test
```

### 🎯 IMPACTO DE LAS MEJORAS

- **Validación**: Verificación estructurada de servicios
- **CORS**: Testing específico de preflight requests
- **Debugging**: Metodología clara paso a paso
- **Confiabilidad**: Validación completa antes de continuar

---

**Estado**: 📋 CONTRATO4LLM actualizado - Integradas lecciones aprendidas de validación de servicios y metodología de debugging

---

## 📋 MAPA DE COMMITS SUGERIDOS - CONTRATO 4 (REPORTES + ROLES)

### Commits por Fase (Conventional Commits + Sufijo Obligatorio)

#### **Fase 1: Backend - Reportes y Roles**
```bash
feat(backend): implement reports and role-based access control

- Add ReportCohortProgress model with Pydantic validation
- Add /api/v1/reports/cohort-progress endpoint with filtering
- Add RoleAuthMiddleware for JWT token validation
- Add ReportsService for metrics calculations
- Add role-based access control (student/teacher/coordinator)
- Add comprehensive role authentication tests
- Add dual MOCK/GOOGLE support for reports

Nerdearla Vibeathon - 2025
```

#### **Fase 2: Frontend - Vista Reports**
```bash
feat(frontend): implement Reports view with Tremor charts

- Add Reports page with cohort progress visualization
- Add Tremor bar chart for on-time vs late submissions
- Add 4 KPI cards (average submissions, delay %, active students, courses)
- Add CohortProgressChart component with interactive data
- Add loading/empty/error states with fallbacks
- Add dual mode support (MOCK/GOOGLE data)
- Add responsive design for mobile devices

Nerdearla Vibeathon - 2025
```

#### **Fase 3: Sistema de Roles**
```bash
feat(frontend): implement role-based access control system

- Add RoleContext for global role state management
- Add differentiated views for Student/Teacher/Coordinator roles
- Add RoleGuard component for route protection
- Add useCohortProgress, useRole, useReports hooks
- Add role-based data filtering and permissions
- Add E2E tests for role navigation and permissions
- Add role switching and session management

Nerdearla Vibeathon - 2025
```

#### **Fase 4: Infraestructura Docker**
```bash
chore(infrastructure): add Docker infrastructure for reports and roles

- Update Docker Compose with classroom-network
- Add environment variables for roles and permissions
- Add ROLES_WHITELIST configuration
- Add DEMO_MODE environment variable
- Add health check for /reports/health endpoint
- Add make up and make test commands
- Add monitoring and logging configuration

Nerdearla Vibeathon - 2025
```

#### **Fase 5: Testing y Documentación**
```bash
test(reports): add comprehensive testing and documentation

- Add backend tests for reports, roles, and middleware (pytest)
- Add frontend tests for components, hooks, and roles (Vitest)
- Add E2E tests for role navigation and charts (Playwright)
- Add comprehensive README with curl examples by role
- Add role-based access documentation
- Add troubleshooting and deployment guides
- Add performance benchmarks and monitoring

Nerdearla Vibeathon - 2025
```

### Commits Adicionales Sugeridos

#### **Backend Testing**
```bash
test(backend): add comprehensive reports and roles test suite

- Add unit tests for ReportCohortProgress model
- Add API endpoint tests for reports with role validation
- Add RoleAuthMiddleware tests with JWT validation
- Add ReportsService tests for metrics calculations
- Add role-based access control tests
- Add integration tests for dual MOCK/GOOGLE modes
- Add performance tests for large datasets

Nerdearla Vibeathon - 2025
```

#### **Frontend Testing**
```bash
test(frontend): add comprehensive reports and roles test suite

- Add unit tests for Reports components
- Add integration tests for role-based views
- Add E2E tests for role navigation flows
- Add visual regression tests for charts
- Add accessibility tests for role-based UI
- Add performance tests for large datasets
- Add cross-browser compatibility tests

Nerdearla Vibeathon - 2025
```

#### **Data Analytics**
```bash
feat(backend): enhance reports with advanced analytics

- Add cohort comparison analytics
- Add trend analysis for submission patterns
- Add predictive analytics for student performance
- Add export functionality for reports (PDF/Excel)
- Add real-time dashboard updates
- Add custom date range filtering
- Add advanced metrics and KPIs

Nerdearla Vibeathon - 2025
```

#### **UI/UX Enhancements**
```bash
feat(frontend): enhance reports UI/UX with advanced features

- Add interactive charts with drill-down capabilities
- Add export functionality for reports
- Add real-time data updates
- Add advanced filtering and search
- Add role-based dashboard customization
- Add mobile-optimized charts
- Add accessibility improvements

Nerdearla Vibeathon - 2025
```

#### **Performance Optimization**
```bash
perf(reports): optimize reports performance and scalability

- Add caching for report calculations
- Optimize database queries for large datasets
- Add pagination for large report results
- Implement lazy loading for charts
- Add performance monitoring for reports
- Optimize memory usage for analytics
- Add load testing for concurrent users

Nerdearla Vibeathon - 2025
```

#### **Security**
```bash
security(reports): enhance security for reports and roles

- Add JWT token validation and refresh
- Implement role-based data access controls
- Add audit logging for report access
- Add rate limiting for report endpoints
- Add data encryption for sensitive reports
- Add security headers for reports
- Add penetration testing for role system

Nerdearla Vibeathon - 2025
```

#### **Monitoring**
```bash
chore(monitoring): add comprehensive monitoring and alerting

- Add application performance monitoring
- Add error tracking and alerting
- Add user analytics and behavior tracking
- Add system health monitoring
- Add report usage analytics
- Add role-based access monitoring
- Add automated alerting for issues

Nerdearla Vibeathon - 2025
```
