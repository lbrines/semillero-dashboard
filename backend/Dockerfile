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
