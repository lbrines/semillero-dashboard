# Semillero Dashboard - Makefile
# Comandos para desarrollo y testing

.PHONY: help up down build test clean logs

# Variables
COMPOSE_FILE = docker-compose.yml
BACKEND_DIR = backend
FRONTEND_DIR = frontend

# Colores para output
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m # No Color

help: ## Mostrar ayuda
	@echo "$(GREEN)Semillero Dashboard - Comandos Disponibles$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

up: ## Levantar todos los servicios
	@echo "$(GREEN)Levantando servicios...$(NC)"
	docker-compose -f $(COMPOSE_FILE) up --build -d
	@echo "$(GREEN)Servicios levantados. Accede a:$(NC)"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:8000"
	@echo "  API Docs: http://localhost:8000/docs"

down: ## Parar todos los servicios
	@echo "$(YELLOW)Parando servicios...$(NC)"
	docker-compose -f $(COMPOSE_FILE) down
	@echo "$(GREEN)Servicios parados$(NC)"

build: ## Construir imágenes Docker
	@echo "$(GREEN)Construyendo imágenes...$(NC)"
	docker-compose -f $(COMPOSE_FILE) build
	@echo "$(GREEN)Imágenes construidas$(NC)"

test: ## Ejecutar todos los tests
	@echo "$(GREEN)Ejecutando tests...$(NC)"
	@echo "$(YELLOW)Tests Backend...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec backend pytest tests/ -v
	@echo "$(YELLOW)Tests Frontend E2E...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec frontend npm run test:smoke-ui
	@echo "$(GREEN)Todos los tests completados$(NC)"

test-backend: ## Ejecutar solo tests del backend
	@echo "$(GREEN)Ejecutando tests del backend...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec backend pytest tests/ -v

test-frontend: ## Ejecutar solo tests del frontend
	@echo "$(GREEN)Ejecutando tests del frontend...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec frontend npm run test:smoke-ui

test-e2e: ## Ejecutar tests E2E completos
	@echo "$(GREEN)Ejecutando tests E2E...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec frontend npm run test:e2e

logs: ## Mostrar logs de todos los servicios
	docker-compose -f $(COMPOSE_FILE) logs -f

logs-backend: ## Mostrar logs del backend
	docker-compose -f $(COMPOSE_FILE) logs -f backend

logs-frontend: ## Mostrar logs del frontend
	docker-compose -f $(COMPOSE_FILE) logs -f frontend

clean: ## Limpiar contenedores e imágenes
	@echo "$(YELLOW)Limpiando contenedores e imágenes...$(NC)"
	docker-compose -f $(COMPOSE_FILE) down -v --rmi all
	docker system prune -f
	@echo "$(GREEN)Limpieza completada$(NC)"

validate: ## Validar que el sistema funciona correctamente
	@echo "$(GREEN)Validando sistema...$(NC)"
	@echo "$(YELLOW)1. Verificando health checks...$(NC)"
	@curl -s -f http://localhost:8000/health > /dev/null && echo "✅ Backend health check OK" || echo "❌ Backend health check FAILED"
	@curl -s -f http://localhost:3000 > /dev/null && echo "✅ Frontend health check OK" || echo "❌ Frontend health check FAILED"
	@echo "$(YELLOW)2. Verificando endpoints de reportes...$(NC)"
	@curl -s -f http://localhost:8000/api/v1/reports/health > /dev/null && echo "✅ Reports health check OK" || echo "❌ Reports health check FAILED"
	@curl -s -f http://localhost:8000/api/v1/reports/cohort-progress > /dev/null && echo "✅ Cohort progress endpoint OK" || echo "❌ Cohort progress endpoint FAILED"
	@echo "$(YELLOW)3. Verificando modo demo...$(NC)"
	@curl -s http://localhost:8000/api/v1/driver/info | grep -q "mock" && echo "✅ Demo mode OK" || echo "❌ Demo mode FAILED"
	@echo "$(GREEN)Validación completada$(NC)"

dev: ## Modo desarrollo (con hot reload)
	@echo "$(GREEN)Iniciando modo desarrollo...$(NC)"
	docker-compose -f $(COMPOSE_FILE) up --build

install: ## Instalar dependencias
	@echo "$(GREEN)Instalando dependencias...$(NC)"
	@echo "$(YELLOW)Backend...$(NC)"
	cd $(BACKEND_DIR) && pip install -r requirements.txt
	@echo "$(YELLOW)Frontend...$(NC)"
	cd $(FRONTEND_DIR) && npm install
	@echo "$(GREEN)Dependencias instaladas$(NC)"

setup: ## Configuración inicial del proyecto
	@echo "$(GREEN)Configurando proyecto...$(NC)"
	@echo "$(YELLOW)1. Copiando archivos de configuración...$(NC)"
	@cp $(BACKEND_DIR)/env.example $(BACKEND_DIR)/.env 2>/dev/null || echo "Archivo .env ya existe"
	@cp $(FRONTEND_DIR)/env.example $(FRONTEND_DIR)/.env 2>/dev/null || echo "Archivo .env ya existe"
	@echo "$(YELLOW)2. Instalando dependencias...$(NC)"
	@make install
	@echo "$(YELLOW)3. Construyendo imágenes...$(NC)"
	@make build
	@echo "$(GREEN)Configuración completada$(NC)"

status: ## Mostrar estado de los servicios
	@echo "$(GREEN)Estado de los servicios:$(NC)"
	docker-compose -f $(COMPOSE_FILE) ps

restart: ## Reiniciar todos los servicios
	@echo "$(YELLOW)Reiniciando servicios...$(NC)"
	docker-compose -f $(COMPOSE_FILE) restart
	@echo "$(GREEN)Servicios reiniciados$(NC)"

# Comandos de validación específicos del contrato
validate-contract: ## Validar cumplimiento del contrato
	@echo "$(GREEN)Validando cumplimiento del contrato...$(NC)"
	@echo "$(YELLOW)Ejecutando pruebas funcionales obligatorias...$(NC)"
	@make validate
	@echo "$(YELLOW)Ejecutando tests E2E...$(NC)"
	@make test-e2e
	@echo "$(GREEN)Validación del contrato completada$(NC)"

# Comandos de desarrollo específicos
dev-backend: ## Solo backend en modo desarrollo
	cd $(BACKEND_DIR) && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Solo frontend en modo desarrollo
	cd $(FRONTEND_DIR) && npm run dev

# Comandos de testing específicos
test-reports: ## Tests específicos de reportes
	docker-compose -f $(COMPOSE_FILE) exec backend pytest tests/test_reports.py -v

test-roles: ## Tests específicos de roles
	docker-compose -f $(COMPOSE_FILE) exec backend pytest tests/test_role_auth.py -v

# Comandos de debugging
debug-backend: ## Debug del backend
	docker-compose -f $(COMPOSE_FILE) exec backend bash

debug-frontend: ## Debug del frontend
	docker-compose -f $(COMPOSE_FILE) exec frontend bash

# Comandos de base de datos (si se implementa en el futuro)
db-migrate: ## Ejecutar migraciones de base de datos
	@echo "$(YELLOW)Ejecutando migraciones...$(NC)"
	# TODO: Implementar cuando se agregue base de datos

db-seed: ## Poblar base de datos con datos de prueba
	@echo "$(YELLOW)Poblando base de datos...$(NC)"
	# TODO: Implementar cuando se agregue base de datos
