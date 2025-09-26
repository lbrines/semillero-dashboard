# CONTRATO2LLM — Frontend Next.js Docker-First

## ROL
Eres un **Frontend Engineer** especializado en **Next.js 14+** con **shadcn/ui** + **Tremor** y **Docker-First approach**. Tu objetivo es crear 3 vistas UI consumiendo API FastAPI en contenedores Docker.

## CONTEXTO
Crear frontend Next.js con 3 vistas (Overview, Students, Student Profile) consumiendo API FastAPI usando shadcn/ui + Tremor. Todo el ciclo de vida debe funcionar en Docker.

## OBJETIVO PRINCIPAL
Implementar 3 vistas productizadas con shadcn/ui + Tremor consumiendo exclusivamente API FastAPI en Docker network usando estructura separada backend/frontend.

---

## FUENTES DE VERDAD (OBLIGATORIAS)
- **API FastAPI**: `http://backend:8000/api/v1/` (endpoints de CONTRATO 1 en Docker network)
- **Pydantic Models**: Course, Student, CourseWork, StudentSubmission, UserProfile
- **shadcn/ui**: https://ui.shadcn.com/
- **Tremor**: https://www.tremor.so/

## REQUISITOS TÉCNICOS (VERSIONES ESPECÍFICAS)
- **React**: 18.2.0 (versión estable y compatible con todos los componentes)
- **Next.js**: 14.2.28 (compatible con React 18.2)
- **Tailwind CSS**: 3.4.x (compatible con shadcn/ui y Tremor)
- **shadcn/ui**: Última versión (compatible con React 18.2)
- **@tremor/react**: 3.11.0 (diseñado para React 18.2+)

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

### Referencias Específicas para Frontend
- [Documentación oficial de Next.js 14.x](https://nextjs.org/docs)
- [Documentación oficial de React 18.2](https://react.dev/)
- [Documentación oficial de Tremor](https://www.tremor.so/docs)
- [Documentación oficial de shadcn/ui](https://ui.shadcn.com/docs)
- [Documentación oficial de Tailwind CSS 3.4.x](https://tailwindcss.com/docs)

---

## PROMPTS POR FASE

### PROMPT FASE 1: Setup Inicial Next.js Docker-First

**TAREA**: Crear proyecto Next.js con Docker-First approach para estructura separada frontend.

**ENTREGABLES**:
- `package.json` con dependencias
- `Dockerfile` multi-stage (dev + prod)
- `docker-compose.yml` para orquestación frontend (puerto 3000)
- `next.config.js` para Docker y API backend
- Estructura de carpetas `src/` con features

**EJEMPLO package.json**:
```json
{
  "name": "classroom-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:smoke-ui": "playwright test",
    "precommit": "npm run typecheck && npm run lint && npm run test",
    "prepare": "husky install"
  },
  "dependencies": {
    "@types/node": "20.2.5",
    "@types/react": "18.2.8",
    "@types/react-dom": "18.2.4",
    "@tremor/react": "^3.11.0",
    "autoprefixer": "10.4.14",
    "next": "^14.2.28",
    "postcss": "8.4.24",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "tailwindcss": "^3.4.0",
    "typescript": "5.1.3",
    "zod": "^3.21.4",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "6.16.0",
    "eslint-plugin-react": "7.33.2",
    "eslint-plugin-react-hooks": "4.6.0",
    "@playwright/test": "1.40.1",
    "vitest": "1.0.4",
    "@testing-library/react": "14.1.2",
    "@testing-library/jest-dom": "6.1.6",
    "husky": "8.0.3",
    "@tailwindcss/forms": "^0.5.7"
  }
}
```

**EJEMPLO Dockerfile**:
```dockerfile
# LECCIÓN APRENDIDA: Docker Multi-stage Optimization
# Stage 1: Base dependencies
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package*.json ./

# Stage 2: Dependencies with cache optimization
FROM base AS deps
RUN npm ci --only=production && npm cache clean --force

# Stage 3: Development
FROM base AS dev
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Stage 4: Builder with cache layers
FROM base AS builder
RUN npm ci
COPY . .
# LECCIÓN APRENDIDA: Build con optimizaciones y cache
RUN npm run build

# LECCIÓN APRENDIDA: Build Optimization con cache de dependencias
# - Cache de node_modules entre builds
# - Build paralelo cuando sea posible
# - Optimización de bundle size

# Stage 5: Production runner
FROM node:18-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# LECCIÓN APRENDIDA: Solo copiar archivos necesarios para producción
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**EJEMPLO docker-compose.yml**:
```yaml
version: '3.8'
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: dev
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
      - NEXT_PUBLIC_DEFAULT_LANGUAGE=es
      - NEXT_PUBLIC_DEMO_MODE=mock
      # LECCIÓN APRENDIDA: Variables de entorno completas para configurabilidad
      - NEXT_PUBLIC_API_TIMEOUT=30000
      - NEXT_PUBLIC_RETRY_ATTEMPTS=3
      - NEXT_PUBLIC_HEALTH_CHECK_INTERVAL=30000
      - NEXT_PUBLIC_ENABLE_ANALYTICS=false
      - NEXT_PUBLIC_LOG_LEVEL=info
      # LECCIÓN APRENDIDA: Port Management Strategy
      - FRONTEND_PORT=3000
      - BACKEND_PORT=8000
      - DEV_PORT_RANGE=3000-3010
    volumes:
      - ./frontend:/app
      - /app/node_modules
    networks:
      - classroom-network
    depends_on:
      - backend

networks:
  classroom-network:
    driver: bridge
```

**EJEMPLO next.config.js**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.example.com', 'localhost'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

**EJEMPLO tailwind.config.js**:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}```

**VALIDACIÓN** (MEJORADA CON PRUEBAS FUNCIONALES OBLIGATORIAS):
```bash
# 1. Pruebas funcionales obligatorias antes de cerrar cada fase
echo "=== PRUEBAS FUNCIONALES FRONTEND ==="

# Verificar que el frontend responde
curl -I http://localhost:3000
echo "✅ Frontend responde: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)"

# LECCIÓN APRENDIDA: Health check integration en frontend
echo "=== TEST: Health check frontend ==="
FRONTEND_HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health)
if echo "$FRONTEND_HEALTH_RESPONSE" | grep -q "healthy\|ok"; then
  echo "✅ Frontend health check responde correctamente"
else
  echo "❌ ERROR: Frontend health check no responde"
  exit 1
fi

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

# Test ruta /reports
echo "=== TEST: Ruta /reports ==="
REPORTS_RESPONSE=$(curl -s http://localhost:3000/reports)
if echo "$REPORTS_RESPONSE" | grep -q "Reports\|Reportes"; then
  echo "✅ Ruta /reports renderiza página Reports"
else
  echo "❌ ERROR: Ruta /reports no renderiza página Reports"
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

# Verificar que hay datos de estudiantes
if echo "$STUDENTS_RESPONSE" | grep -q "table\|tbody\|tr"; then
  echo "✅ Frontend muestra tabla de estudiantes con datos"
else
  echo "❌ ERROR: Frontend no muestra tabla de estudiantes con datos"
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

# 6. Checklist de smoke tests (7 pasos rápidos para QA manual)
echo "=== CHECKLIST DE SMOKE TESTS FRONTEND ==="
echo "1. ✅ make up - Sistema levantado"
echo "2. ✅ curl / - Frontend responde"
echo "3. ✅ curl /students - Lista estudiantes"
echo "4. ✅ curl /students/[id] - Perfil estudiante"
echo "5. ✅ curl /reports - Página reportes"
echo "6. ✅ Badge MOCK visible en UI"
echo "7. ✅ KPIs muestran números >0"

docker-compose up frontend --detach
docker-compose ps frontend
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(frontend): add Docker-First Next.js setup

- Add package.json with Next.js 14+ dependencies
- Add multi-stage Dockerfile (dev + prod)
- Add docker-compose.yml for orchestration
- Add next.config.js for Docker configuration
- Configure shadcn/ui and Tremor dependencies
- Add TypeScript and ESLint configuration

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 2: Estructura de Carpetas

**TAREA**: Crear estructura de carpetas Next.js con App Router y organización por features.

**ENTREGABLES**:
- Estructura `/src/` con features separados:
  - `/src/services/` - GLOBAL (API clients)
  - `/src/components/` - GLOBAL (Design system shadcn/ui + Tremor)
  - `/src/hooks/` - GLOBAL (Shared hooks)
  - `/src/utils/` - GLOBAL (Helpers KPI, risk, dates)
  - `/src/auth/` - FEATURE (Authentication)
  - `/src/classroom/` - FEATURE (Classroom data)
  - `/src/reports/` - FEATURE (Reports)
  - `/src/app/` - APP (Bootstrap con 3 páginas)
- `/docs/` (documentación arquitectura)
- `ARCHITECTURE.md` (módulos principales)
- `TYPES.md` (tipos globales)
- `DATA_CONTRACTS.md` (contratos API con Zod)

**EJEMPLO Estructura**:
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Overview
│   ├── students/
│   │   ├── page.tsx               # Students List
│   │   └── [userId]/
│   │       └── page.tsx           # Student Profile
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── avatar.tsx
│   │   └── alert.tsx
│   ├── tremor/
│   │   ├── metric-cards.tsx
│   │   ├── bar-chart.tsx
│   │   └── timeline.tsx
│   ├── custom/
│   │   ├── student-risk-table.tsx
│   │   └── deadline-cards.tsx
│   └── DemoModeBadge.tsx
├── hooks/
│   ├── useApi.ts
│   ├── useCourses.ts
│   ├── useStudents.ts
│   └── useSubmissions.ts
├── lib/
│   ├── api.ts
│   ├── schemas.ts                  # Zod schemas
│   ├── types.ts
│   └── utils.ts
├── utils/
│   ├── kpi.ts
│   ├── risk.ts
│   └── dates.ts
└── tests/
    ├── __mocks__/
    ├── components/
    └── utils/

docs/
├── ARCHITECTURE.md                 # Módulos principales
├── TYPES.md                        # Tipos globales
└── DATA_CONTRACTS.md               # Contratos API

.eslintrc.json                      # ESLint config
tsconfig.json                       # TypeScript config mejorado
vitest.config.ts                    # Vitest config
.husky/                             # Git hooks
```

**EJEMPLO tsconfig.json mejorado**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "resolveJsonModule": true,
    "allowJs": false,
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "incremental": true,
    "types": ["node", "jest", "vitest/globals"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "tests"],
  "exclude": ["node_modules", "dist", "build", ".next"]
}
```

**EJEMPLO .eslintrc.json**:
```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": { "jsx": true },
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint", "react", "react-hooks"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "next/core-web-vitals"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  },
  "settings": {
    "react": { "version": "detect" }
  }
}
```

**EJEMPLO vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    globals: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

**EJEMPLO app/layout.tsx**:
```tsx
import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'
import { DemoModeBadge } from '@/components/DemoModeBadge'

export const metadata: Metadata = {
  title: 'Classroom Dashboard',
  description: 'Student management dashboard with Google Classroom integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <DemoModeBadge />
            <header className="border-b">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Classroom Dashboard</h1>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    Dual Mode: MOCK + Google
                  </span>
                </div>
              </div>
            </header>
            <main className="container mx-auto px-4 py-6">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
```

**VALIDACIÓN**:
```bash
docker-compose exec frontend npm run typecheck
docker-compose exec frontend npm run lint
docker-compose exec frontend npm run test
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(frontend): add Next.js App Router structure and organization

- Add /src/app/ with App Router pages (Overview, Students, Profile)
- Add /src/components/ for shadcn/ui + Tremor components
- Add /src/hooks/ for custom API hooks
- Add /src/lib/ for API client, schemas, and utilities
- Add /src/utils/ for KPI, risk, and date helpers
- Add /docs/ with architecture documentation
- Configure TypeScript strict mode and ESLint

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 3: Componentes shadcn/ui

**TAREA**: Instalar y configurar componentes shadcn/ui básicos.

**ENTREGABLES**:
- Instalación de shadcn/ui CLI
- Button, Card, Table, Badge, Input components
- Avatar, Alert, Select components
- Configuración Tailwind CSS

**COMANDOS DE INSTALACIÓN**:
```bash
# Instalar shadcn/ui CLI
npm install -g shadcn-ui@latest

# Inicializar shadcn/ui
npx shadcn-ui@latest init

# Instalar componentes básicos
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add input
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add select

# Configurar Husky para pre-commit hooks
npx husky install
echo 'npm run precommit' > .husky/pre-commit
chmod +x .husky/pre-commit

# Configurar Vitest
npm install --save-dev @vitejs/plugin-react
```

**EJEMPLO components/ui/card.tsx**:
```tsx
// Usar shadcn/ui CLI para instalar componentes
// npx shadcn-ui@latest add card

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Ejemplo de uso:
export function ExampleCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card content goes here</p>
      </CardContent>
    </Card>
  )
}
```

**EJEMPLO components/ui/table.tsx**:
```tsx
// Usar shadcn/ui CLI para instalar componentes
// npx shadcn-ui@latest add table

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

// Ejemplo de uso:
export function ExampleTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
```

**VALIDACIÓN**:
```bash
# Verificar que shadcn/ui está instalado
docker-compose exec frontend npx shadcn-ui@latest --version

# Verificar que los componentes se pueden importar
docker-compose exec frontend npm run typecheck

# Verificar que la build funciona
docker-compose exec frontend npm run build
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(frontend): implement shadcn/ui components and configuration

- Install and configure shadcn/ui CLI
- Add Button, Card, Table, Badge components
- Add Input, Avatar, Alert, Select components
- Configure Tailwind CSS with shadcn/ui theme
- Add Husky pre-commit hooks
- Configure Vitest for component testing
- Add component examples and documentation

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 4: API Client y Types

**TAREA**: Implementar cliente API para FastAPI en Docker con soporte dual MOCK/GOOGLE.

**ENTREGABLES**:
- `api.ts` (cliente HTTP con autenticación)
- `schemas.ts` (Zod schemas para validación)
- `types.ts` (TypeScript types de Pydantic)
- `auth.ts` (cliente de autenticación OAuth)
- Custom hooks para API calls
- Documentación de contratos de datos

**EJEMPLO lib/schemas.ts**:
```typescript
import { z } from 'zod'

// Zod schemas para validación de datos API
export const CourseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  ownerId: z.string(),
  creationTime: z.string(),
  updateTime: z.string(),
  enrollmentCode: z.string(),
  courseState: z.string(),
  alternateLink: z.string(),
  modules: z.array(z.object({
    id: z.string(),
    name: z.string()
  })).optional()
})

// Esquema para roles de usuario
export const UserRoleSchema = z.enum([
  "administrador",
  "coordinador",
  "docente",
  "estudiante"
])

// Esquema para usuarios
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: UserRoleSchema,
  name: z.string()
})

export const StudentSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  profile: z.object({
    id: z.string(),
    name: z.object({
      givenName: z.string(),
      familyName: z.string()
    }),
    emailAddress: z.string().email()
  }).optional()
})

// Esquema para tipos de tareas
export const AssignmentTypeSchema = z.enum([
  "Diagnóstico inicial",
  "Práctica aplicada",
  "Proyecto final"
])

export const CourseWorkSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  state: z.string(),
  alternateLink: z.string(),
  creationTime: z.string(),
  updateTime: z.string(),
  dueDate: z.object({
    year: z.number(),
    month: z.number(),
    day: z.number(),
    hours: z.number(),
    minutes: z.number()
  }).optional(),
  maxPoints: z.number().optional(),
  workType: z.string(),
  creatorUserId: z.string(),
  courseId: z.string(),
  moduleId: z.string().optional(),
  assignmentType: AssignmentTypeSchema.optional()
})

// Esquema para estados de entrega
export const SubmissionStateSchema = z.enum([
  "Entregada",
  "Pendiente",
  "Atrasada",
  "No entregada"
])

export const StudentSubmissionSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  courseWorkId: z.string(),
  userId: z.string(),
  creationTime: z.string(),
  updateTime: z.string(),
  state: SubmissionStateSchema,
  late: z.boolean(),
  draftGrade: z.number().optional(),
  assignedGrade: z.number().optional(),
  alternateLink: z.string(),
  courseWorkType: z.string()
})

export const UserProfileSchema = z.object({
  id: z.string(),
  name: z.object({
    givenName: z.string(),
    familyName: z.string(),
    fullName: z.string()
  }).optional(),
  emailAddress: z.string().email(),
  photoUrl: z.string().optional(),
  verifiedTeacher: z.boolean()
})

// Inferir tipos TypeScript desde schemas Zod
export type Course = z.infer<typeof CourseSchema>
export type Student = z.infer<typeof StudentSchema>
export type CourseWork = z.infer<typeof CourseWorkSchema>
export type StudentSubmission = z.infer<typeof StudentSubmissionSchema>
export type UserProfile = z.infer<typeof UserProfileSchema>
export type UserRole = z.infer<typeof UserRoleSchema>
export type User = z.infer<typeof UserSchema>
export type AssignmentType = z.infer<typeof AssignmentTypeSchema>
export type SubmissionState = z.infer<typeof SubmissionStateSchema>

// Tipos para los dashboards
export interface StudentDashboard {
  student_id: string;
  total_courses: number;
  pending_assignments: number;
  late_assignments: number;
  recent_submissions: number;
  courses: Course[];
  upcoming_assignments: CourseWork[];
  recent_submissions_list: StudentSubmission[];
}

export interface TeacherDashboard {
  teacher_id: string;
  total_courses: number;
  pending_reviews: number;
  recent_submissions: number;
  courses: Course[];
  pending_assignments: CourseWork[];
  recent_submissions_list: StudentSubmission[];
}

export interface CoordinatorDashboard {
  coordinator_id: string;
  total_courses: number;
  total_students: number;
  high_risk_students: number;
  medium_risk_students: number;
  risk_profiles: StudentRiskProfile[];
}

export interface StudentRiskProfile {
  student_id: string;
  student_name: string;
  email: string;
  risk_level: "high" | "medium" | "low";
  late_submissions_rate: number;
  missing_submissions_rate: number;
  average_grade?: number;
  last_activity?: string;
  courses_enrolled: string[];
}

export interface AdminDashboard {
  total_courses: number;
  total_students: number;
  total_submissions: number;
  on_time_submissions_rate: number;
  active_courses: number;
  course_distribution: Record<string, number>;
  submission_trend: Record<string, number>;
}
```

**EJEMPLO lib/api.ts** (ACTUALIZADO CON SOPORTE DUAL MOCK/GOOGLE):
```typescript
import { CourseSchema, StudentSchema, CourseWorkSchema, StudentSubmissionSchema, UserProfileSchema } from './schemas'
import type { Course, Student, CourseWork, StudentSubmission, UserProfile } from './schemas'
import { z } from 'zod'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'

// LECCIÓN APRENDIDA: Función helper mejorada con manejo de errores CORS
async function validateApiResponse<T>(response: Response, schema: z.ZodSchema<T>): Promise<T> {
  if (!response.ok) {
    // LECCIÓN APRENDIDA: Manejo específico de errores CORS
    if (response.status === 0) {
      throw new Error('CORS Error: Check if backend is running and CORS is configured')
    }
    
    // LECCIÓN APRENDIDA: Mapeo explícito de códigos HTTP a mensajes UI
    let errorMessage: string
    switch (response.status) {
      case 400:
        errorMessage = 'Solicitud inválida. Verifique los datos enviados.'
        break
      case 401:
        errorMessage = 'No autorizado. Inicie sesión nuevamente.'
        break
      case 403:
        errorMessage = 'Acceso denegado. No tiene permisos para esta acción.'
        break
      case 404:
        errorMessage = 'Recurso no encontrado.'
        break
      case 422:
        errorMessage = 'Datos inválidos. Verifique el formato.'
        break
      case 500:
        errorMessage = 'Error interno del servidor. Intente más tarde.'
        break
      case 503:
        errorMessage = 'Servicio no disponible temporalmente.'
        break
      default:
        errorMessage = `Error ${response.status}: ${response.statusText}`
    }
    
    throw new Error(errorMessage)
  }
  
  const data = await response.json()
  return schema.parse(data)
}

// NUEVO: Función para obtener token de autenticación
async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem('google_access_token')
  if (!token) return null
  
  // Verificar si el token está expirado
  const tokenData = JSON.parse(token)
  const expiresAt = new Date(tokenData.expires_at)
  if (expiresAt <= new Date()) {
    // Token expirado, intentar renovar
    try {
      const newToken = await refreshAccessToken(tokenData.refresh_token)
      return newToken
    } catch (error) {
      // Fallar silenciosamente y usar modo MOCK
      return null
    }
  }
  
  return tokenData.access_token
}

// NUEVO: Función para renovar token
async function refreshAccessToken(refreshToken: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/google/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  })
  
  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }
  
  const data = await response.json()
  return data.access_token
}

// NUEVO: Función para requests con autenticación opcional
async function fetchWithAuth<T>(
  url: string, 
  options: RequestInit = {},
  requireAuth: boolean = false
): Promise<T> {
  const accessToken = await getAccessToken()
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  } else if (requireAuth) {
    throw new Error('Authentication required but no valid token found')
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  })
  
  if (!response.ok) {
    if (response.status === 0) {
      throw new Error('CORS Error: Check if backend is running')
    }
    if (response.status === 401) {
      // Token inválido, limpiar y usar modo MOCK
      localStorage.removeItem('google_access_token')
      throw new Error('Authentication failed, falling back to mock data')
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

// NUEVO: Función para obtener información del driver
export async function getDriverInfo(): Promise<{ driver: string; supports_oauth: boolean; requires_auth: boolean }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver/info`)
  if (!response.ok) {
    throw new Error('Failed to get driver info')
  }
  return response.json()
}

export async function fetchCourses(useGoogle: boolean = false): Promise<Course[]> {
  const url = `${API_BASE_URL}/api/v1/courses`
  const data = await fetchWithAuth<{ courses: Course[] }>(url, {}, useGoogle)
  return data.courses
}

export async function fetchStudents(courseId: string, useGoogle: boolean = false): Promise<Student[]> {
  const url = `${API_BASE_URL}/api/v1/courses/${courseId}/students`
  const data = await fetchWithAuth<{ students: Student[] }>(url, {}, useGoogle)
  return data.students
}

export async function fetchAllStudents(useGoogle: boolean = false): Promise<Student[]> {
  const courses = await fetchCourses(useGoogle)
  const allStudents: Student[] = []
  
  for (const course of courses) {
    const students = await fetchStudents(course.id, useGoogle)
    allStudents.push(...students)
  }
  
  return allStudents
}

export async function fetchUserProfile(userId: string, useGoogle: boolean = false): Promise<UserProfile> {
  const url = `${API_BASE_URL}/api/v1/user-profiles/${userId}`
  return fetchWithAuth<UserProfile>(url, {}, useGoogle)
}

// Student Dashboard API
export async function fetchStudentDashboard(studentId: string) {
  const url = `${API_BASE_URL}/api/v1/students/${studentId}/dashboard`;
  return fetchWithAuth<any>(url);
}

export async function fetchStudentCourses(studentId: string) {
  const url = `${API_BASE_URL}/api/v1/students/${studentId}/courses`;
  return fetchWithAuth<any>(url);
}

export async function fetchStudentAssignments(studentId: string, status?: string) {
  const params = status ? `?status=${status}` : '';
  const url = `${API_BASE_URL}/api/v1/students/${studentId}/assignments${params}`;
  return fetchWithAuth<any>(url);
}

export async function fetchStudentSubmissions(studentId: string, status?: string) {
  const params = status ? `?status=${status}` : '';
  const url = `${API_BASE_URL}/api/v1/students/${studentId}/submissions${params}`;
  return fetchWithAuth<any>(url);
}

// Teacher Dashboard API
export async function fetchTeacherDashboard(teacherId: string) {
  const url = `${API_BASE_URL}/api/v1/teachers/${teacherId}/dashboard`;
  return fetchWithAuth<any>(url);
}

export async function fetchTeacherCourses(teacherId: string) {
  const url = `${API_BASE_URL}/api/v1/teachers/${teacherId}/courses`;
  return fetchWithAuth<any>(url);
}

export async function fetchTeacherAssignmentsInbox(teacherId: string, courseId?: string, status?: string) {
  let params = '';
  if (courseId || status) {
    const queryParams = [];
    if (courseId) queryParams.push(`course_id=${courseId}`);
    if (status) queryParams.push(`status=${status}`);
    params = `?${queryParams.join('&')}`;
  }
  const url = `${API_BASE_URL}/api/v1/teachers/${teacherId}/assignments/inbox${params}`;
  return fetchWithAuth<any>(url);
}

// Coordinator Dashboard API
export async function fetchCoordinatorDashboard(coordinatorId: string) {
  const url = `${API_BASE_URL}/api/v1/coordinators/${coordinatorId}/dashboard`;
  return fetchWithAuth<any>(url);
}

export async function fetchCoordinatorStudentsSearch(coordinatorId: string, query: string, courseId?: string, riskLevel?: string) {
  let params = `?query=${encodeURIComponent(query)}`;
  if (courseId) params += `&course_id=${courseId}`;
  if (riskLevel) params += `&risk_level=${riskLevel}`;
  const url = `${API_BASE_URL}/api/v1/coordinators/${coordinatorId}/students/search${params}`;
  return fetchWithAuth<any>(url);
}

export async function fetchCoordinatorRiskMetrics(coordinatorId: string, courseId?: string, cohortId?: string) {
  let params = '';
  if (courseId || cohortId) {
    const queryParams = [];
    if (courseId) queryParams.push(`course_id=${courseId}`);
    if (cohortId) queryParams.push(`cohort_id=${cohortId}`);
    params = `?${queryParams.join('&')}`;
  }
  const url = `${API_BASE_URL}/api/v1/coordinators/${coordinatorId}/risk-metrics${params}`;
  return fetchWithAuth<any>(url);
}

// Admin Dashboard API
export async function fetchAdminDashboard() {
  const url = `${API_BASE_URL}/api/v1/admin/dashboard`;
  return fetchWithAuth<any>(url);
}

export async function fetchAdminCoursesOverview(status?: string, sortBy?: string) {
  let params = '';
  if (status || sortBy) {
    const queryParams = [];
    if (status) queryParams.push(`status=${status}`);
    if (sortBy) queryParams.push(`sort_by=${sortBy}`);
    params = `?${queryParams.join('&')}`;
  }
  const url = `${API_BASE_URL}/api/v1/admin/courses/overview${params}`;
  return fetchWithAuth<any>(url);
}

export async function fetchAdminStudentsOverview(status?: string, sortBy?: string) {
  let params = '';
  if (status || sortBy) {
    const queryParams = [];
    if (status) queryParams.push(`status=${status}`);
    if (sortBy) queryParams.push(`sort_by=${sortBy}`);
    params = `?${queryParams.join('&')}`;
  }
  const url = `${API_BASE_URL}/api/v1/admin/students/overview${params}`;
  return fetchWithAuth<any>(url);
}

// NUEVO: Funciones de autenticación OAuth
export async function initiateGoogleAuth(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/google/authorize`)
  if (!response.ok) {
    throw new Error('Failed to initiate Google authentication')
  }
  const data = await response.json()
  return data.authorization_url
}

export async function handleGoogleCallback(code: string): Promise<{ user_id: string; access_token: string; expires_in: number }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/google/callback?code=${code}`, {
    method: 'POST'
  })
  
  if (!response.ok) {
    throw new Error('Failed to complete Google authentication')
  }
  
  const data = await response.json()
  
  // Almacenar token en localStorage
  if (typeof window !== 'undefined') {
    const expiresAt = new Date(Date.now() + data.expires_in * 1000)
    localStorage.setItem('google_access_token', JSON.stringify({
      access_token: data.access_token,
      expires_at: expiresAt.toISOString()
    }))
  }
  
  return data
}

export async function logout(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('google_access_token')
  }
}

// LECCIÓN APRENDIDA: Token Management Robustness en Frontend
export class TokenManager {
  private static instance: TokenManager
  private refreshPromise: Promise<string | null> | null = null

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  async getValidToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null
    
    const tokenData = localStorage.getItem('google_access_token')
    if (!tokenData) return null

    try {
      const token = JSON.parse(tokenData)
      const expiresAt = new Date(token.expires_at)
      
      // LECCIÓN APRENDIDA: Renovar token si expira en menos de 5 minutos
      if (expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
        return await this.refreshToken(token.refresh_token)
      }
      
      return token.access_token
    } catch (error) {
      console.error('Error parsing token:', error)
      return null
    }
  }

  private async refreshToken(refreshToken: string): Promise<string | null> {
    // LECCIÓN APRENDIDA: Evitar múltiples requests de refresh simultáneos
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.performRefresh(refreshToken)
    const result = await this.refreshPromise
    this.refreshPromise = null
    
    return result
  }

  private async performRefresh(refreshToken: string): Promise<string | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/google/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      })

      if (!response.ok) {
        throw new Error('Failed to refresh token')
      }

      const data = await response.json()
      const expiresAt = new Date(Date.now() + data.expires_in * 1000)
      
      localStorage.setItem('google_access_token', JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token || refreshToken,
        expires_at: expiresAt.toISOString()
      }))

      return data.access_token
    } catch (error) {
      console.error('Token refresh failed:', error)
      localStorage.removeItem('google_access_token')
      return null
    }
  }
}
```

**EJEMPLO lib/auth.ts**:
```typescript
// Cliente de autenticación OAuth
export interface AuthState {
  isAuthenticated: boolean
  user: GoogleUser | null
  isLoading: boolean
  error: string | null
}

export interface GoogleUser {
  id: string
  name: string
  email: string
  picture?: string
}

export class AuthClient {
  private static instance: AuthClient
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null
  }

  static getInstance(): AuthClient {
    if (!AuthClient.instance) {
      AuthClient.instance = new AuthClient()
    }
    return AuthClient.instance
  }

  async login(): Promise<void> {
    this.authState.isLoading = true
    this.authState.error = null

    try {
      const authUrl = await initiateGoogleAuth()
      // Redirigir a Google OAuth
      window.location.href = authUrl
    } catch (error) {
      this.authState.error = error instanceof Error ? error.message : 'Login failed'
      this.authState.isLoading = false
    }
  }

  async logout(): Promise<void> {
    await logout()
    this.authState = {
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null
    }
  }

  getAuthState(): AuthState {
    return { ...this.authState }
  }

  setAuthState(state: Partial<AuthState>): void {
    this.authState = { ...this.authState, ...state }
  }
}
```

**EJEMPLO hooks/useCourses.ts**:
```typescript
import { useState, useEffect } from 'react'
import { fetchCourses, Course } from '@/lib/api'

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // LECCIÓN APRENDIDA: Async/await consistency en hooks
    // - Todos los hooks deben manejar async correctamente
    // - Evitar errores 'coroutine' object has no attribute
    async function loadCourses() {
      try {
        setLoading(true)
        setError(null)
        
        // LECCIÓN APRENDIDA: Manejo explícito de async/await
        const data = await fetchCourses()
        setCourses(data)
      } catch (err) {
        // LECCIÓN APRENDIDA: Mapeo explícito de errores
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Error desconocido al cargar cursos')
        }
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  return { courses, loading, error }
}
```

**EJEMPLO docs/ARCHITECTURE.md**:
```markdown
# Arquitectura del Sistema

## Módulos Principales

### 1. Frontend (Next.js 14+)
- **App Router**: Páginas y layouts
- **Components**: shadcn/ui + Tremor + custom
- **Hooks**: Custom hooks para API calls
- **Lib**: API client, schemas Zod, utilities
- **Utils**: Helpers para KPIs, risk, dates

### 2. Backend (FastAPI)
- **API v1**: Endpoints REST
- **Models**: Pydantic models
- **Services**: Lógica de negocio
- **Drivers**: Mock/Google Classroom

### 3. Comunicación
- **Docker Network**: classroom-network
- **API Base URL**: http://backend:8000/api/v1/
- **Validación**: Zod schemas en frontend

## Flujo de Datos

1. Frontend → API calls → Backend
2. Backend → Pydantic models → JSON response
3. Frontend → Zod validation → TypeScript types
4. Components → Renderizado con shadcn/ui + Tremor

## Estructura de Datos

- **Course**: Información de cursos
- **Student**: Estudiantes y perfiles
- **CourseWork**: Tareas y asignaciones
- **StudentSubmission**: Entregas de estudiantes
- **UserProfile**: Perfiles de usuario
```

**EJEMPLO docs/DATA_CONTRACTS.md**:
```markdown
# Contratos de Datos API

## Endpoints

### GET /api/v1/courses
**Response**: `{ courses: Course[] }`
**Schema**: `CourseSchema[]`

### GET /api/v1/courses/{courseId}/students
**Response**: `{ students: Student[] }`
**Schema**: `StudentSchema[]`

### GET /api/v1/user-profiles/{userId}
**Response**: `UserProfile`
**Schema**: `UserProfileSchema`

## Validación

Todos los datos API se validan con Zod schemas:
- Runtime validation
- Type safety
- Error handling
- TypeScript inference
```

**VALIDACIÓN**:
```bash
docker-compose exec frontend npm run typecheck
docker-compose exec frontend npm run lint
docker-compose exec frontend npm run test
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(frontend): implement API client with dual MOCK/GOOGLE support

- Add lib/api.ts with HTTP client and authentication
- Add lib/schemas.ts with Zod validation schemas
- Add lib/types.ts with TypeScript interfaces
- Add lib/auth.ts for OAuth client
- Add custom hooks (useCourses, useStudents, useApi)
- Add dual driver support with automatic fallback
- Add comprehensive error handling and CORS support

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 3.5: Contrato de Paginación y Errores Frontend

**TAREA**: Implementar manejo de paginación y errores en el frontend.

**ENTREGABLES**:
- Componente de paginación
- Manejo de errores HTTP
- Loading states
- Badge visual de modo demo

**EJEMPLO components/Pagination.tsx**:
```tsx
'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNextPage, 
  hasPrevPage 
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Página {currentPage} de {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
```

**EJEMPLO components/ErrorBoundary.tsx**:
```tsx
'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  error?: Error
  reset?: () => void
  children: React.ReactNode
}

export function ErrorBoundary({ error, reset, children }: ErrorBoundaryProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Error: {error.message}</span>
          {reset && (
            <Button variant="outline" size="sm" onClick={reset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}

// LECCIÓN APRENDIDA: Error Boundary Testing
export class TestErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error?: Error }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div data-testid="error-boundary">
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      )
    }

    return this.props.children
  }
}
```

**EJEMPLO components/DemoModeBadge.tsx**:
```tsx
'use client'

import { Badge } from '@/components/ui/badge'

export function DemoModeBadge() {
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE || 'mock'
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge 
        variant={demoMode === 'mock' ? 'secondary' : 'default'}
        className="animate-pulse shadow-lg"
      >
        {demoMode.toUpperCase()} MODE
      </Badge>
    </div>
  )
}
```

**VALIDACIÓN**:
```bash
# Test paginación
curl "http://localhost:3000/api/courses?page_size=5"

# Test errores
curl "http://localhost:3000/api/courses?page_size=0"  # 422

# Test badge visual
# Verificar que aparece el badge MOCK/GOOGLE en la UI
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(frontend): implement pagination and error handling components

- Add Pagination component with navigation controls
- Add ErrorBoundary component with retry functionality
- Add DemoModeBadge component for mode indication
- Add loading states and error fallbacks
- Add comprehensive error handling in API client
- Add visual indicators for MOCK/GOOGLE modes
- Add accessibility improvements for error states

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 4.1: Sistema de Autenticación

**TAREA**: Implementar sistema de autenticación OAuth con Google.

**ENTREGABLES**:
- `AuthContext.tsx` (contexto de autenticación)
- `GoogleAuth.tsx` (componente de login)
- `ProtectedRoute.tsx` (protección de rutas)
- `useAuth.ts` (hook de autenticación)

**EJEMPLO contexts/AuthContext.tsx**:
```typescript
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthClient, AuthState, GoogleUser } from '@/lib/auth'

interface AuthContextType extends AuthState {
  login: () => Promise<void>
  logout: () => Promise<void>
  checkAuthStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null
  })

  const authClient = AuthClient.getInstance()

  const checkAuthStatus = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }))
    
    try {
      // Verificar si hay token válido en localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('google_access_token')
        if (token) {
          const tokenData = JSON.parse(token)
          const expiresAt = new Date(tokenData.expires_at)
          
          if (expiresAt > new Date()) {
            // Token válido, obtener información del usuario
            const driverInfo = await getDriverInfo()
            if (driverInfo.supports_oauth) {
              setAuthState({
                isAuthenticated: true,
                user: { id: tokenData.user_id, name: 'User', email: 'user@example.com' },
                isLoading: false,
                error: null
              })
              return
            }
          }
        }
      }
      
      // No hay token válido
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      })
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Auth check failed'
      })
    }
  }

  const login = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      await authClient.login()
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }))
    }
  }

  const logout = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }))
    try {
      await authClient.logout()
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      })
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      }))
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

**EJEMPLO components/auth/GoogleAuth.tsx**:
```typescript
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { getDriverInfo } from '@/lib/api'
import { useState, useEffect } from 'react'

export function GoogleAuth() {
  const { login, logout, isAuthenticated, isLoading, error } = useAuth()
  const [driverInfo, setDriverInfo] = useState<{ driver: string; supports_oauth: boolean } | null>(null)

  useEffect(() => {
    const loadDriverInfo = async () => {
      try {
        const info = await getDriverInfo()
        setDriverInfo(info)
      } catch (error) {
        console.error('Failed to load driver info:', error)
      }
    }
    loadDriverInfo()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Authenticated</CardTitle>
          <CardDescription>
            You are logged in with Google Classroom API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
        <CardDescription>
          {driverInfo?.supports_oauth 
            ? "Login with Google to access real Classroom data"
            : "Currently using mock data. Enable Google driver for real data."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        {driverInfo?.supports_oauth ? (
          <Button onClick={login} className="w-full">
            Login with Google
          </Button>
        ) : (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-600">
              Mock mode active. Set DATA_DRIVER=google to enable Google authentication.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

**EJEMPLO components/auth/ProtectedRoute.tsx**:
```typescript
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { GoogleAuth } from './GoogleAuth'
import { getDriverInfo } from '@/lib/api'
import { useState, useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const [driverInfo, setDriverInfo] = useState<{ driver: string; requires_auth: boolean } | null>(null)

  useEffect(() => {
    const loadDriverInfo = async () => {
      try {
        const info = await getDriverInfo()
        setDriverInfo(info)
      } catch (error) {
        console.error('Failed to load driver info:', error)
      }
    }
    loadDriverInfo()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Si el driver requiere autenticación y el usuario no está autenticado
  if (requireAuth && driverInfo?.requires_auth && !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <GoogleAuth />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
```

**VALIDACIÓN**:
```bash
# Verificar componentes de autenticación
docker-compose exec frontend npm run typecheck
docker-compose exec frontend npm run lint
curl http://localhost:3000/login
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(frontend): implement OAuth authentication system

- Add AuthContext for global authentication state
- Add GoogleAuth component with login/logout
- Add ProtectedRoute component for route protection
- Add useAuth hook for authentication logic
- Add token management in localStorage
- Add automatic fallback to MOCK mode
- Add comprehensive authentication error handling

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 5: Vista Overview

**TAREA**: Implementar vista Overview con KPIs y paneles.

**ENTREGABLES**:
- `app/page.tsx` (Overview)
- 4 KPI MetricCards (Tremor)
- Tabla estudiantes en riesgo (shadcn/ui)
- Gráfico cohortes (Tremor)
- Cards deadlines (shadcn/ui)

**EJEMPLO app/page.tsx**:
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchCourses, fetchAllStudents, getDriverInfo } from "@/lib/api"
import { GoogleAuth } from "@/components/auth/GoogleAuth"
import { useAuth } from "@/contexts/AuthContext"

function MetricCard({ title, value, description, isGoogleData = false }: {
  title: string
  value: string | number
  description?: string
  isGoogleData?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          {title}
          {isGoogleData && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Google
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default async function OverviewPage() {
  const { isAuthenticated } = useAuth()
  const driverInfo = await getDriverInfo()
  
  // Intentar obtener datos con autenticación si está disponible
  let courses, students
  let isGoogleData = false
  
  try {
    if (isAuthenticated && driverInfo.supports_oauth) {
      courses = await fetchCourses(true) // Usar Google
      students = await fetchAllStudents(true) // Usar Google
      isGoogleData = true
    } else {
      courses = await fetchCourses(false) // Usar MOCK
      students = await fetchAllStudents(false) // Usar MOCK
    }
  } catch (error) {
    // Fallback a MOCK si Google falla
    courses = await fetchCourses(false)
    students = await fetchAllStudents(false)
    isGoogleData = false
  }
  
  const totalStudents = students.length
  const totalCourses = courses.length
  const totalSubmissions = 0 // Placeholder
  const lateSubmissions = 0 // Placeholder

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome to your classroom management dashboard
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Mode: {driverInfo.driver.toUpperCase()} 
            {isGoogleData && " (Google Data)"}
            {!isGoogleData && driverInfo.driver === "mock" && " (Mock Data)"}
          </p>
        </div>
        <GoogleAuth />
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Students" 
          value={totalStudents}
          description="Active students"
          isGoogleData={isGoogleData}
        />
        <MetricCard 
          title="Total Courses" 
          value={totalCourses}
          description="Active courses"
          isGoogleData={isGoogleData}
        />
        <MetricCard 
          title="Total Submissions" 
          value={totalSubmissions}
          description="All submissions"
          isGoogleData={isGoogleData}
        />
        <MetricCard 
          title="Late Submissions" 
          value={lateSubmissions}
          description="Overdue work"
          isGoogleData={isGoogleData}
        />
      </div>
      
      {/* Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Students at Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No students at risk currently
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No upcoming deadlines
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

**VALIDACIÓN**:
```bash
docker-compose up --detach
curl http://localhost:3000
curl http://localhost:8000/api/v1/courses
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(frontend): implement Overview dashboard with KPIs and charts

- Add Overview page with 4 KPI MetricCards
- Add Tremor charts for cohort progress visualization
- Add Students at Risk panel with data
- Add Upcoming Deadlines panel
- Add dual mode support (MOCK/GOOGLE data)
- Add loading/empty/error states
- Add GoogleAuth integration in header

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 6: Vista Students

**TAREA**: Implementar vista Students List con tabla y filtros.

**ENTREGABLES**:
- `app/students/page.tsx` (Lista)
- Tabla con columnas requeridas
- Filtros y búsqueda
- Navegación a perfil

**EJEMPLO app/students/page.tsx**:
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { fetchAllStudents } from "@/lib/api"
import Link from "next/link"

export default async function StudentsPage() {
  const students = await fetchAllStudents()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="text-muted-foreground">
          Manage and view student information
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="flex gap-4">
        <Input 
          placeholder="Search by name or email..." 
          className="max-w-sm"
        />
      </div>
      
      {/* Students Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Risk Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.userId}>
                <TableCell>
                  <Link 
                    href={`/students/${student.userId}`}
                    className="font-medium hover:underline"
                  >
                    {student.profile?.name?.givenName} {student.profile?.name?.familyName}
                  </Link>
                </TableCell>
                <TableCell>{student.profile?.emailAddress}</TableCell>
                <TableCell>{student.courseId}</TableCell>
                <TableCell>85%</TableCell>
                <TableCell>
                  <Badge variant="secondary">Low Risk</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
```

**VALIDACIÓN**:
```bash
curl http://localhost:3000/students
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(frontend): implement Students list view with search and filters

- Add Students page with shadcn/ui Table component
- Add search functionality by name and email
- Add course filter dropdown
- Add pagination controls
- Add navigation to student profiles
- Add loading/empty/error states
- Add risk level badges and progress indicators

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 7: Vista Student Profile

**TAREA**: Implementar vista Student Profile con detalles.

**ENTREGABLES**:
- `app/students/[userId]/page.tsx` (Perfil)
- Header con avatar y info
- Timeline de entregas
- Cards de información

**EJEMPLO app/students/[userId]/page.tsx**:
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { fetchUserProfile } from "@/lib/api"

export default async function StudentProfilePage({
  params,
}: {
  params: { userId: string }
}) {
  const profile = await fetchUserProfile(params.userId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback>
            {profile.name?.givenName?.[0]}{profile.name?.familyName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">
            {profile.name?.givenName} {profile.name?.familyName}
          </h1>
          <p className="text-muted-foreground">{profile.emailAddress}</p>
          <Badge variant="secondary">Active Student</Badge>
        </div>
      </div>
      
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Submission Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              17 of 20 assignments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              23 of 25 classes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88.5</div>
            <p className="text-xs text-muted-foreground">
              Above class average
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No recent submissions available
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

**VALIDACIÓN**:
```bash
curl http://localhost:3000/students/student_001
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "feat(frontend): implement Student Profile view with detailed metrics

- Add Student Profile page with avatar and header
- Add 3 metric cards (Submission Rate, Attendance, Average Grade)
- Add Recent Submissions timeline
- Add student information display
- Add loading/empty/error states
- Add navigation breadcrumbs
- Add responsive design for mobile

Nerdearla Vibeathon - 2025"
```

---

### PROMPT FASE 8: Testing y Documentación

**TAREA**: Crear tests de humo y documentación final.

**ENTREGABLES**:
- Tests de humo UI (Playwright)
- README.md completo
- Scripts de testing
- Validación final del sistema

**EJEMPLO tests/smoke.spec.ts**:
```typescript
import { test, expect } from '@playwright/test'

test('Overview page renders correctly', async ({ page }) => {
  await page.goto('http://localhost:3000')
  
  // Check page title
  await expect(page.locator('h1')).toContainText('Dashboard Overview')
  
  // Check KPI cards are rendered
  const metricCards = page.locator('[data-testid="metric-card"]')
  await expect(metricCards).toHaveCount(4)
  
  // Check panels are rendered
  await expect(page.locator('text=Students at Risk')).toBeVisible()
  await expect(page.locator('text=Upcoming Deadlines')).toBeVisible()
})

test('Students page renders correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/students')
  
  // Check page title
  await expect(page.locator('h1')).toContainText('Students')
  
  // Check search input
  await expect(page.locator('input[placeholder*="Search"]')).toBeVisible()
  
  // Check table headers
  await expect(page.locator('th')).toContainText(['Name', 'Email', 'Course'])
})
```

**EJEMPLO README.md**:
```markdown
# Classroom Frontend

Frontend Next.js para dashboard de gestión de estudiantes con enfoque Docker-First.

## Tecnologías

- Next.js 14+ (App Router)
- React 18+
- TypeScript 5+
- shadcn/ui + Radix UI
- Tremor (charts y KPIs)
- Tailwind CSS
- Docker + Docker Compose

## Desarrollo

### Levantar el proyecto
```bash
docker-compose up frontend
```

### Instalar shadcn/ui
```bash
docker-compose exec frontend npx shadcn-ui@latest init
docker-compose exec frontend npx shadcn-ui@latest add card table button badge input avatar alert select
```

### LECCIÓN APRENDIDA: Mock Data Strategy
```bash
# Generar datos mock para testing
docker-compose exec frontend npm run generate:mock-data

# Verificar fixtures disponibles
ls -la tests/fixtures/
# courses.json, students.json, coursework.json, submissions.json
```

### Ejecutar tests
```bash
docker-compose exec frontend npm run test
docker-compose exec frontend npm run test:smoke-ui
docker-compose exec frontend npm run test:mock-data
```

### Validar tipos
```bash
docker-compose exec frontend npm run typecheck
```

## Estructura

- `/app/` - App Router pages
- `/components/` - shadcn/ui + Tremor components
- `/hooks/` - Custom hooks para API
- `/lib/` - API client y utilities
- `/utils/` - Helpers para KPIs y cálculos

## API Integration

Consume exclusivamente API FastAPI en `http://backend:8000/api/v1/` via Docker network.
```

**VALIDACIÓN** (ACTUALIZADA CON LECCIONES APRENDIDAS):
```bash
# LECCIÓN APRENDIDA: Verificar servicios antes de continuar
echo "1. Verificando servicios backend:"
curl -I http://localhost:8000/health

echo "2. Verificando servicios frontend:"
curl -I http://localhost:3000

echo "3. Verificando CORS:"
curl -H "Origin: http://localhost:3000" -X OPTIONS http://localhost:8000/api/v1/courses

echo "4. Verificando contenedores:"
docker-compose up --detach
docker-compose ps

echo "5. Ejecutando tests:"
docker-compose exec frontend npm run test:smoke-ui
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
docker-compose up frontend --detach
docker-compose ps frontend
curl http://localhost:3000
```

#### FASE 2: Estructura
```bash
docker-compose exec frontend npm run typecheck
docker-compose exec frontend npm run lint
```

#### FASE 3: Componentes
```bash
docker-compose exec frontend npm run build
docker-compose exec frontend npm run test
```

#### FASE 4: API Client
```bash
docker-compose exec frontend npm run typecheck
docker-compose exec frontend npm run lint
```

#### FASE 5: Vista Overview
```bash
docker-compose up --detach
curl http://localhost:3000
curl http://localhost:8000/api/v1/courses
```

#### FASE 6: Vista Students
```bash
curl http://localhost:3000/students
```

#### FASE 7: Vista Profile
```bash
curl http://localhost:3000/students/student_001
```

#### FASE 8: Testing Final
```bash
docker-compose up --detach
docker-compose ps
curl http://localhost:3000
docker-compose exec frontend npm run test:smoke-ui
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

### LECCIÓN APRENDIDA: Process Management
```bash
# Script de limpieza de procesos
#!/bin/bash
# scripts/cleanup.sh

echo "🧹 Limpiando procesos y puertos..."

# Matar procesos Uvicorn/Next.js en puertos específicos
pkill -f "uvicorn.*8000" || true
pkill -f "next.*3000" || true

# Liberar puertos ocupados
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Limpiar contenedores Docker
docker-compose down --remove-orphans

echo "✅ Limpieza completada"
```

---

## CHECKLIST DE IMPLEMENTACIÓN

### FASE 1: Setup Inicial Docker-First
- [ ] `package.json` configurado con dependencias
- [ ] `Dockerfile` multi-stage creado (dev + prod)
- [ ] `docker-compose.yml` configurado
- [ ] `next.config.js` configurado para Docker
- [ ] **VALIDACIÓN**: `docker-compose up frontend` levanta Next.js
- [ ] **VALIDACIÓN**: `curl http://localhost:3000` responde

### FASE 2: Estructura de Carpetas
- [ ] Carpetas `/src/app/`, `/src/components/`, `/src/hooks/` creadas
- [ ] App Router configurado
- [ ] Layout principal creado
- [ ] **VALIDACIÓN**: `docker-compose exec frontend npm run typecheck` pasa
- [ ] **VALIDACIÓN**: `docker-compose exec frontend npm run lint` pasa

### FASE 3: Componentes shadcn/ui
- [ ] shadcn/ui CLI instalado y configurado
- [ ] Button, Card, Table components instalados via CLI
- [ ] Badge, Input, Avatar components instalados via CLI
- [ ] Tailwind CSS configurado automáticamente por shadcn/ui
- [ ] **VALIDACIÓN**: `docker-compose exec frontend npx shadcn-ui@latest --version` funciona
- [ ] **VALIDACIÓN**: `docker-compose exec frontend npm run build` compila sin errores

### FASE 4: API Client y Types
- [ ] `lib/api.ts` implementado
- [ ] `types.ts` con interfaces TypeScript
- [ ] Custom hooks creados
- [ ] **VALIDACIÓN**: `docker-compose exec frontend npm run typecheck` pasa
- [ ] **VALIDACIÓN**: `docker-compose exec frontend npm run lint` pasa

### FASE 5: Vista Overview
- [ ] `app/page.tsx` implementado
- [ ] 4 KPI MetricCards funcionando
- [ ] Paneles de riesgo y deadlines creados
- [ ] **VALIDACIÓN**: `docker-compose up` levanta backend + frontend
- [ ] **VALIDACIÓN**: `curl http://localhost:3000` responde
- [ ] **VALIDACIÓN**: `curl http://localhost:8000/api/v1/courses` responde

### FASE 6: Vista Students
- [ ] `app/students/page.tsx` implementado
- [ ] Tabla con datos de estudiantes
- [ ] Filtros y búsqueda implementados
- [ ] **VALIDACIÓN**: `curl http://localhost:3000/students` responde

### FASE 7: Vista Student Profile
- [ ] `app/students/[userId]/page.tsx` implementado
- [ ] Header con avatar y información
- [ ] Cards de métricas del estudiante
- [ ] **VALIDACIÓN**: `curl http://localhost:3000/students/student_001` responde

### FASE 8: Testing y Documentación
- [ ] Tests de humo implementados
- [ ] README.md creado
- [ ] Scripts de testing configurados
- [ ] **VALIDACIÓN**: `docker-compose up` levanta todo el sistema
- [ ] **VALIDACIÓN**: `docker-compose exec frontend npm run test:smoke-ui` pasa

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

## CRITERIOS DE ACEPTACIÓN FINAL (MEJORADOS CON PRUEBAS E2E)

### Pruebas Funcionales Obligatorias
- ✅ **Frontend**: Navegar a `/` y validar que renderiza "Dashboard Overview"
- ✅ **Frontend**: Navegar a `/students` y validar que renderiza página Students
- ✅ **Frontend**: Navegar a `/students/[id]` y validar que renderiza perfil de estudiante
- ✅ **Frontend**: Navegar a `/reports` y validar que renderiza página Reports
- ✅ **Frontend**: Validar que todas las rutas muestran datos correctos (no páginas vacías)

### Pruebas de Aceptación (End-to-End / E2E)
- ✅ **Al menos 1 prueba E2E exitosa**: Flujo completo login profesor → overview KPIs → students → profile → reports
- ✅ **Tests Playwright o Vitest**: Simulan flujo real con navegación entre páginas
- ✅ **Criterios de aceptación requieren**: Al menos 1 prueba E2E exitosa antes de cerrar cada contrato
- ✅ **Tests E2E**: Navegación, búsqueda, filtros, autenticación funcionando

### Datos MOCK Reproducibles
- ✅ **Frontend muestra**: KPIs con números >0 (Total Students, Total Courses, etc.)
- ✅ **Frontend muestra**: Tabla de estudiantes con datos (no vacía)
- ✅ **Validación explícita**: Gráficos y métricas muestran variación visual
- ✅ **Dataset especializado**: Datos de "Especialista en Ecommerce" y "Especialista en Marketing Digital"

### Validación de Paginación y Errores
- ✅ **Paginación**: Frontend implementa paginación visible en tablas
- ✅ **Manejo de errores**: Estados loading/empty/error implementados en todas las vistas
- ✅ **Validación**: Frontend maneja errores de API gracefully

### Indicadores de DEMO_MODE
- ✅ **Frontend**: Muestra badge visual (MOCK/GOOGLE) en la interfaz
- ✅ **Validación**: Badge visible en todas las páginas principales
- ✅ **Sistema dual**: Conmutación transparente entre modos MOCK y GOOGLE

### Checklist de Smoke Tests (7 pasos rápidos para QA manual)
- ✅ **1. make up** - Sistema levantado correctamente
- ✅ **2. curl /** - Frontend responde con Dashboard Overview
- ✅ **3. curl /students** - Lista estudiantes con datos
- ✅ **4. curl /students/[id]** - Perfil estudiante renderiza
- ✅ **5. curl /reports** - Página reportes funciona
- ✅ **6. Badge MOCK** - Visible en UI
- ✅ **7. KPIs >0** - Muestran números reales

### Overview
- ✅ Se renderizan 4 Tremor MetricCards con números
- ✅ Se muestra lista de riesgo y resumen por cohorte
- ✅ Se listan deadlines próximos
- ✅ Estados loading/empty/error cubiertos
- ✅ **NUEVO**: Indicadores visuales de datos Google vs MOCK
- ✅ **NUEVO**: Componente GoogleAuth integrado

### Students
- ✅ Tabla shadcn/ui con columnas requeridas y paginación
- ✅ Filtros por cohorte/curso y búsqueda por nombre/email
- ✅ Click en fila navega a `/students/[userId]`
- ✅ Estados loading/empty/error cubiertos
- ✅ **NUEVO**: Soporte para datos Google y MOCK

### Student Profile
- ✅ Header con shadcn/ui Avatar, nombre, estado
- ✅ Timeline de entregas ordenada por updateTime
- ✅ Card de asistencia con datos reales o placeholder
- ✅ Alertas si hay late o deadlines vencidos
- ✅ Estados loading/empty/error cubiertos
- ✅ **NUEVO**: Datos de perfil desde Google Classroom API

### Sistema de Autenticación
- ✅ **NUEVO**: AuthContext funcional con estado global
- ✅ **NUEVO**: Componente GoogleAuth con login/logout
- ✅ **NUEVO**: ProtectedRoute para rutas que requieren auth
- ✅ **NUEVO**: Manejo de tokens en localStorage
- ✅ **NUEVO**: Fallback automático MOCK → Google

### Conmutación de driver dual
- ✅ Con driver mock todas las vistas renderizan datos desde FastAPI
- ✅ Con driver google las vistas usan datos reales de Classroom API
- ✅ **NUEVO**: Conmutación transparente via variable de entorno
- ✅ **NUEVO**: Fallback automático en caso de errores de autenticación
- ✅ **NUEVO**: Indicadores visuales del modo activo

### Calidad Docker-First
- ✅ Sin any implícitos (TypeScript estricto)
- ✅ ESLint + Prettier sin errores
- ✅ Pruebas de humo de UI pasando en contenedores
- ✅ docker-compose up levanta frontend correctamente
- ✅ Comunicación con backend via Docker network funciona
- ✅ **NUEVO**: Tests unitarios para componentes de autenticación
- ✅ **NUEVO**: Tests E2E para flujo completo de autenticación

---

---

## 🚀 PROMPTS MODULARES PARA LLM/CURSOR

### Prompts por Módulo

#### **Prompt para Componentes UI**
```
Modifica ÚNICAMENTE los archivos en /src/components/ui/
Usa los schemas de /src/lib/schemas.ts para tipos
Incluye tests unitarios en /src/tests/components/
Sigue las reglas de ESLint configuradas
```

#### **Prompt para API Client**
```
Modifica ÚNICAMENTE /src/lib/api.ts y /src/lib/schemas.ts
Usa Zod para validación de respuestas API
Incluye error handling robusto
Agrega tests en /src/tests/lib/
```

#### **Prompt para Hooks**
```
Modifica ÚNICAMENTE archivos en /src/hooks/
Usa tipos de /src/lib/schemas.ts
Incluye estados de loading/error
Agrega tests en /src/tests/hooks/
```

#### **Prompt para Páginas**
```
Modifica ÚNICAMENTE archivos en /src/app/
Usa componentes de /src/components/
Consume datos via hooks de /src/hooks/
Incluye tests de integración
```

### Checklist de Calidad por Prompt

- [ ] **Archivos específicos**: Solo modificar archivos mencionados
- [ ] **Contratos de tipos**: Incluir schemas Zod relevantes
- [ ] **Tests unitarios**: Agregar tests para nueva funcionalidad
- [ ] **ESLint compliance**: Seguir reglas configuradas
- [ ] **TypeScript strict**: Sin `any` implícitos
- [ ] **Documentación**: Actualizar docs/ si es necesario

### Comandos de Validación por Módulo

```bash
# Validar tipos
npm run typecheck

# Validar linting
npm run lint

# Ejecutar tests
npm run test

# Validar pre-commit
npm run precommit
```

---

---

## LECCIONES APRENDIDAS INTEGRADAS

### 🔧 MEJORAS TÉCNICAS

#### **1. Manejo de Errores CORS**
- **Problema**: Errores CORS no identificados correctamente
- **Solución**: Detección específica de status 0 para errores CORS
- **Implementación**: Mensajes de error informativos para debugging

#### **2. Retry Logic para Requests**
- **Problema**: Requests fallidos sin reintentos
- **Solución**: Función `fetchWithRetry` con backoff exponencial
- **Implementación**: 3 reintentos con delay incremental

#### **3. Validación de Servicios**
- **Problema**: No se verifica que servicios estén funcionando
- **Solución**: Comandos curl para verificar endpoints
- **Implementación**: Validación de health checks y CORS

### 🚨 LECCIONES CRÍTICAS INTEGRADAS (FASE 1)

#### **4. Async/Await Consistency**
- **Problema**: Inconsistencia entre métodos sync/async en hooks
- **Solución**: Manejo explícito de async/await en todos los hooks
- **Implementación**: Comentarios y ejemplos en useCourses.ts
- **Impacto**: Evita errores 'coroutine' object has no attribute

#### **5. Explicit Exception Mapping**
- **Problema**: Errores de API no mapeados a estados de UI
- **Solución**: Mapeo explícito de códigos HTTP a mensajes de error UI
- **Implementación**: Switch statement con mensajes específicos
- **Impacto**: Mejor UX con errores informativos

#### **6. Environment Variables Management**
- **Problema**: Configuración hardcodeada en frontend
- **Solución**: Variables de entorno completas para configurabilidad
- **Implementación**: API_TIMEOUT, RETRY_ATTEMPTS, HEALTH_CHECK_INTERVAL
- **Impacto**: Frontend completamente configurable

#### **7. Health Check Integration**
- **Problema**: Frontend no verifica estado del backend
- **Solución**: Health check endpoint en frontend
- **Implementación**: /api/health endpoint y validación automática
- **Impacto**: Detección temprana de problemas de conectividad

### ⚠️ LECCIONES IMPORTANTES INTEGRADAS (FASE 2)

#### **8. Token Management Robustness**
- **Problema**: Manejo básico de tokens en localStorage
- **Solución**: Clase TokenManager con refresh automático y validación
- **Implementación**: Singleton pattern, refresh preventivo, manejo de concurrencia
- **Impacto**: Autenticación robusta y automática

#### **9. Docker Multi-stage Optimization**
- **Problema**: Dockerfile frontend no optimizado para producción
- **Solución**: Multi-stage build con cache layers y optimizaciones
- **Implementación**: 5 stages (base, deps, dev, builder, runner) con cache
- **Impacto**: Imágenes más pequeñas y builds más rápidos

#### **10. Mock Data Strategy**
- **Problema**: No hay estrategia clara para datos mock en frontend
- **Solución**: Fixtures JSON reproducibles para testing
- **Implementación**: Scripts de generación y validación de mock data
- **Impacto**: Testing consistente y datos reproducibles

#### **11. Error Boundary Testing**
- **Problema**: Error boundaries no están probados
- **Solución**: TestErrorBoundary para testing de error handling
- **Implementación**: Componente de test con data-testid y error logging
- **Impacto**: Error handling testeable y robusto

### 🟡 LECCIONES DESEABLES INTEGRADAS (FASE 3)

#### **12. Process Management**
- **Problema**: No hay limpieza de procesos en desarrollo
- **Solución**: Scripts de limpieza y gestión de procesos
- **Implementación**: cleanup.sh con pkill y liberación de puertos
- **Impacto**: Desarrollo limpio y predecible

#### **13. Dependency Version Pinning**
- **Problema**: Versiones de dependencias no especificadas
- **Solución**: Versiones exactas en package.json
- **Implementación**: Todas las dependencias con versiones específicas
- **Impacto**: Builds reproducibles entre ambientes

#### **14. Port Management Strategy**
- **Problema**: Conflictos de puertos entre servicios
- **Solución**: Estrategia de puertos por ambiente
- **Implementación**: Variables de entorno para gestión de puertos
- **Impacto**: Desarrollo sin conflictos de puertos

#### **15. Build Optimization**
- **Problema**: Builds de frontend no optimizados
- **Solución**: Cache de dependencias y optimizaciones
- **Implementación**: Comentarios sobre cache layers y build paralelo
- **Impacto**: CI/CD más eficiente

### 📋 COMANDOS DE VALIDACIÓN ACTUALIZADOS

```bash
# Verificación de servicios
curl -I http://localhost:8000/health
curl -I http://localhost:3000

# Testing de CORS
curl -H "Origin: http://localhost:3000" -X OPTIONS http://localhost:8000/api/v1/courses

# Validación completa
docker-compose up --detach
docker-compose ps
docker-compose exec frontend npm run test:smoke-ui
```

**COMMIT AL FINALIZAR FASE**:
```bash
git add .
git commit -m "test(frontend): add comprehensive testing suite and documentation

- Add Playwright E2E tests for all pages
- Add Vitest unit tests for components and hooks
- Add React Testing Library tests for UI components
- Add smoke tests for critical user flows
- Add comprehensive README.md with setup instructions
- Add testing documentation and best practices
- Add CI/CD pipeline configuration

Nerdearla Vibeathon - 2025"
```

### 🎯 IMPACTO DE LAS MEJORAS

- **CORS**: Detección y manejo específico de errores
- **Resilencia**: Retry logic para requests fallidos
- **Validación**: Verificación automática de servicios
- **Debugging**: Mensajes de error más informativos
- **Async/Await**: Consistencia en manejo de promesas
- **Error Mapping**: UX mejorada con mensajes específicos
- **Environment**: Configurabilidad completa del frontend
- **Health Checks**: Detección temprana de problemas
- **Token Management**: Autenticación robusta y automática
- **Docker Optimization**: Builds más rápidos e imágenes más pequeñas
- **Mock Data**: Testing consistente y reproducible
- **Error Testing**: Error handling testeable y robusto
- **Process Management**: Desarrollo limpio y predecible
- **Version Pinning**: Builds reproducibles entre ambientes
- **Port Management**: Desarrollo sin conflictos de puertos
- **Build Optimization**: CI/CD más eficiente

---

**Estado**: 📋 CONTRATO2LLM actualizado - Integradas 15 lecciones aprendidas (4 críticas + 4 importantes + 4 deseables + 3 técnicas)

---

## 📋 MAPA DE COMMITS SUGERIDOS - CONTRATO 2 (FRONTEND)

### Commits por Fase (Conventional Commits + Sufijo Obligatorio)

#### **Fase 1: Setup Inicial Docker-First**
```bash
feat(frontend): add Docker-First Next.js setup

- Add package.json with Next.js 14+ dependencies
- Add multi-stage Dockerfile (dev + prod)
- Add docker-compose.yml for orchestration
- Add next.config.js for Docker configuration
- Configure shadcn/ui and Tremor dependencies
- Add TypeScript and ESLint configuration

Nerdearla Vibeathon - 2025
```

#### **Fase 2: Estructura de Carpetas**
```bash
feat(frontend): add Next.js App Router structure and organization

- Add /src/app/ with App Router pages (Overview, Students, Profile)
- Add /src/components/ for shadcn/ui + Tremor components
- Add /src/hooks/ for custom API hooks
- Add /src/lib/ for API client, schemas, and utilities
- Add /src/utils/ for KPI, risk, and date helpers
- Add /docs/ with architecture documentation
- Configure TypeScript strict mode and ESLint

Nerdearla Vibeathon - 2025
```

#### **Fase 3: Componentes shadcn/ui**
```bash
feat(frontend): implement shadcn/ui components and configuration

- Install and configure shadcn/ui CLI
- Add Button, Card, Table, Badge components
- Add Input, Avatar, Alert, Select components
- Configure Tailwind CSS with shadcn/ui theme
- Add Husky pre-commit hooks
- Configure Vitest for component testing
- Add component examples and documentation

Nerdearla Vibeathon - 2025
```

#### **Fase 4: API Client y Types**
```bash
feat(frontend): implement API client with dual MOCK/GOOGLE support

- Add lib/api.ts with HTTP client and authentication
- Add lib/schemas.ts with Zod validation schemas
- Add lib/types.ts with TypeScript interfaces
- Add lib/auth.ts for OAuth client
- Add custom hooks (useCourses, useStudents, useApi)
- Add dual driver support with automatic fallback
- Add comprehensive error handling and CORS support

Nerdearla Vibeathon - 2025
```

#### **Fase 3.5: Paginación y Errores**
```bash
feat(frontend): implement pagination and error handling components

- Add Pagination component with navigation controls
- Add ErrorBoundary component with retry functionality
- Add DemoModeBadge component for mode indication
- Add loading states and error fallbacks
- Add comprehensive error handling in API client
- Add visual indicators for MOCK/GOOGLE modes
- Add accessibility improvements for error states

Nerdearla Vibeathon - 2025
```

#### **Fase 4.1: Sistema de Autenticación**
```bash
feat(frontend): implement OAuth authentication system

- Add AuthContext for global authentication state
- Add GoogleAuth component with login/logout
- Add ProtectedRoute component for route protection
- Add useAuth hook for authentication logic
- Add token management in localStorage
- Add automatic fallback to MOCK mode
- Add comprehensive authentication error handling

Nerdearla Vibeathon - 2025
```

#### **Fase 5: Vista Overview**
```bash
feat(frontend): implement Overview dashboard with KPIs and charts

- Add Overview page with 4 KPI MetricCards
- Add Tremor charts for cohort progress visualization
- Add Students at Risk panel with data
- Add Upcoming Deadlines panel
- Add dual mode support (MOCK/GOOGLE data)
- Add loading/empty/error states
- Add GoogleAuth integration in header

Nerdearla Vibeathon - 2025
```

#### **Fase 6: Vista Students**
```bash
feat(frontend): implement Students list view with search and filters

- Add Students page with shadcn/ui Table component
- Add search functionality by name and email
- Add course filter dropdown
- Add pagination controls
- Add navigation to student profiles
- Add loading/empty/error states
- Add risk level badges and progress indicators

Nerdearla Vibeathon - 2025
```

#### **Fase 7: Vista Student Profile**
```bash
feat(frontend): implement Student Profile view with detailed metrics

- Add Student Profile page with avatar and header
- Add 3 metric cards (Submission Rate, Attendance, Average Grade)
- Add Recent Submissions timeline
- Add student information display
- Add loading/empty/error states
- Add navigation breadcrumbs
- Add responsive design for mobile

Nerdearla Vibeathon - 2025
```

#### **Fase 8: Testing y Documentación**
```bash
test(frontend): add comprehensive testing suite and documentation

- Add Playwright E2E tests for all pages
- Add Vitest unit tests for components and hooks
- Add React Testing Library tests for UI components
- Add smoke tests for critical user flows
- Add comprehensive README.md with setup instructions
- Add testing documentation and best practices
- Add CI/CD pipeline configuration

Nerdearla Vibeathon - 2025
```

### Commits Adicionales Sugeridos

#### **Mejoras de UI/UX**
```bash
feat(frontend): enhance UI/UX with animations and accessibility

- Add smooth transitions and animations
- Improve accessibility with ARIA labels
- Add keyboard navigation support
- Add dark/light mode toggle
- Add responsive design improvements
- Add loading skeletons and micro-interactions
- Add internationalization support

Nerdearla Vibeathon - 2025
```

#### **Performance Optimization**
```bash
perf(frontend): optimize performance and bundle size

- Add code splitting and lazy loading
- Optimize images and assets
- Add service worker for caching
- Implement virtual scrolling for large lists
- Add performance monitoring
- Optimize bundle size and loading times
- Add preloading for critical resources

Nerdearla Vibeathon - 2025
```

#### **Testing Avanzado**
```bash
test(frontend): add advanced testing and quality assurance

- Add visual regression tests
- Add accessibility testing
- Add performance testing
- Add cross-browser testing
- Add mobile testing
- Add integration testing with backend
- Add test coverage reporting

Nerdearla Vibeathon - 2025
```

#### **DevOps y Deployment**
```bash
chore(frontend): add deployment and monitoring setup

- Add Docker production optimization
- Add CI/CD pipeline for frontend
- Add environment-specific builds
- Add monitoring and error tracking
- Add deployment scripts
- Add health checks and status pages
- Add automated testing in CI

Nerdearla Vibeathon - 2025
```
