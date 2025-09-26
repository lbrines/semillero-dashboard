# Semillero Dashboard - Sistema de Reportes y Roles

Sistema completo de reportes gráficos de avance con sistema de roles diferenciados, construido con Next.js + FastAPI y enfoque Docker-First.

## 🚀 Características Principales

- **Reportes Gráficos**: Visualización de avance por cohorte con gráficos Tremor
- **Sistema de Roles**: Vistas diferenciadas para estudiante, docente, coordinador y administrador
- **Autenticación**: Sistema de autenticación basado en whitelist de emails
- **Datos Duales**: Soporte para datos MOCK y Google Classroom (WOW opcional)
- **Tests E2E**: Tests completos con Playwright para validación end-to-end

## 🏗️ Arquitectura

```
├── backend/          # FastAPI + Python 3.11+
├── frontend/         # Next.js 14.x + React 18.x + Tremor
├── docker-compose.yml # Orquestación de servicios
└── tests/           # Tests E2E con Playwright
```

## 📋 Requisitos Técnicos

### Frontend
- **React**: 18.x
- **Next.js**: 14.x
- **Tailwind CSS**: 3.x
- **@tremor/react**: 3.x
- **shadcn/ui**: Última versión

### Backend
- **Python**: 3.11+
- **FastAPI**: 0.104+
- **Pydantic**: 2.4+

### DevOps
- **Docker**: 24.x+
- **Docker Compose**: 2.x+

## 🚀 Instalación y Ejecución

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd semillero-dashboard
```

### 2. Configurar Variables de Entorno
```bash
# Copiar archivos de ejemplo
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env
```

### 3. Ejecutar con Docker Compose
```bash
# Levantar todos los servicios
docker-compose up --build

# O usar el comando make (si está disponible)
make up
```

### 4. Acceder a la Aplicación
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs

## 🔐 Sistema de Roles

### Roles Disponibles
- **student**: Solo progreso personal, sin acceso a búsqueda de estudiantes
- **teacher**: Avance de sus alumnos, acceso limitado a búsqueda
- **coordinator**: Reportes globales, acceso completo a búsqueda en sus cohortes
- **admin**: Overview global, acceso completo a todos los datos

### Configuración de Roles
```bash
# Variables de entorno
ROLES_WHITELIST=coord.ecommerce@instituto.edu,coord.marketing@instituto.edu,admin@instituto.edu,teacher@instituto.edu,student@instituto.edu
DEMO_MODE=mock
JWT_TOKEN=test_jwt_token
```

## 📊 Endpoints de Reportes

### Backend API

#### Obtener Progreso de Cohortes
```bash
curl http://localhost:8000/api/v1/reports/cohort-progress
```

#### Con Filtros
```bash
curl "http://localhost:8000/api/v1/reports/cohort-progress?cohort_id=ecommerce_001&pageSize=5"
```

#### KPIs Globales
```bash
curl http://localhost:8000/api/v1/reports/kpis
```

#### Estadísticas del Sistema
```bash
curl http://localhost:8000/api/v1/reports/stats
```

#### Health Check
```bash
curl http://localhost:8000/api/v1/reports/health
```

### Ejemplos por Rol

#### Como Administrador
```bash
curl -H "X-User-Email: admin@instituto.edu" \
     http://localhost:8000/api/v1/reports/cohort-progress
```

#### Como Coordinador
```bash
curl -H "X-User-Email: coord.ecommerce@instituto.edu" \
     http://localhost:8000/api/v1/reports/cohort-progress
```

#### Como Docente
```bash
curl -H "X-User-Email: teacher@instituto.edu" \
     http://localhost:8000/api/v1/reports/cohort-progress
```

## 🧪 Testing

### Tests E2E con Playwright
```bash
# Instalar Playwright
cd frontend
npm install
npx playwright install

# Ejecutar tests
npm run test

# Tests específicos
npm run test:smoke-ui  # Tests de humo
npm run test:e2e       # Tests E2E completos
```

### Tests Backend
```bash
cd backend
pytest tests/ -v
```

### Validación Completa del Sistema
```bash
# Verificar que el sistema funciona
curl -I http://localhost:8000/health
curl -I http://localhost:3000

# Verificar reportes
curl http://localhost:8000/api/v1/reports/cohort-progress

# Verificar modo demo
curl http://localhost:8000/api/v1/driver/info
```

## 📱 Vistas por Rol

### Estudiante (`student`)
- Vista personal de progreso
- Métricas individuales
- **NO** tiene acceso a búsqueda de estudiantes

### Docente (`teacher`)
- Avance de sus alumnos
- KPIs de cursos asignados
- Acceso limitado a búsqueda de estudiantes

### Coordinador (`coordinator`)
- Reportes globales
- Comparación entre cohortes
- Acceso completo a búsqueda en sus cohortes

### Administrador (`admin`)
- Overview global de cursos/alumnos
- Acceso completo a búsqueda de todos los estudiantes
- Todas las funcionalidades

## 🔧 Comandos de Desarrollo

### Backend
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run dev
```

### Docker
```bash
# Levantar servicios
docker-compose up --build

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down
```

## 📈 Criterios de Aceptación

### ✅ Backend
- [x] `GET /reports/cohort-progress` devuelve datos agregados correctos
- [x] Middleware `RoleAuthMiddleware` valida roles correctamente
- [x] Soporte MOCK con conmutación transparente
- [x] Healthcheck `/reports/health` responde correctamente
- [x] Tests backend pasan al 100% con cobertura >90%

### ✅ Frontend
- [x] Vista Reports renderiza gráfico Tremor + 4 KPI cards
- [x] Sistema de roles funciona con vistas diferenciadas
- [x] Context `RoleContext` maneja estado global correctamente
- [x] Estados loading/empty/error implementados
- [x] Indicadores visuales de modo activo (MOCK vs Google)
- [x] Tests E2E pasan al 100%

### ✅ Infraestructura
- [x] Docker Compose levanta backend + frontend en red compartida
- [x] Comandos `make up` y `make test` funcionan
- [x] Sistema dual MOCK/GOOGLE funciona end-to-end

### ✅ Documentación
- [x] README documenta flujo completo de reportes y roles
- [x] Ejemplos curl por rol documentados y funcionando
- [x] Comandos de validación del sistema completo

## 🚨 Solución de Problemas

### Error de CORS
```bash
# Verificar configuración CORS
curl -H "Origin: http://localhost:3000" -X OPTIONS \
     http://localhost:8000/api/v1/reports/cohort-progress
```

### Error de Autenticación
```bash
# Verificar variables de entorno
echo $ROLES_WHITELIST
echo $DEMO_MODE
```

### Error de Tests E2E
```bash
# Reinstalar Playwright
cd frontend
npx playwright install
```

## 📝 Changelog

### v1.1 (Actual)
- ✅ Corregidas duplicaciones de variables de entorno
- ✅ Completados mensajes de commit truncados
- ✅ Reemplazados tokens JWT hardcodeados con variables
- ✅ Corregidos comentarios de ubicación de servicios
- ✅ Flexibilizadas versiones de dependencias
- ✅ Mejorados comandos de validación de Playwright
- ✅ Estandarizada nomenclatura de roles
- ✅ Clarificados permisos de búsqueda
- ✅ Completados criterios de aceptación E2E
- ✅ Actualizado versionado del contrato

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🏆 Nerdearla Vibeathon 2025

Desarrollado como parte del Nerdearla Vibeathon 2025 - Sistema de reportes gráficos de avance con sistema de roles diferenciados.
