FROM python:3.12-slim

WORKDIR /app

# Dependencias del sistema (útiles para build)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential python3-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos los .proto y generamos los stubs
COPY proto ./proto

# Crear el directorio app si no existe
RUN mkdir -p ./app && \
    python -m grpc_tools.protoc -I./proto \
      --python_out=./app \
      --grpc_python_out=./app \
      ./proto/vehiculos.proto

# Copiamos el código de la app
COPY app ./app

ENV PORT=8000
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
