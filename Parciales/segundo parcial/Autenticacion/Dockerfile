# Autenticacion/Dockerfile
FROM node:20-alpine

# Instalar dependencias del sistema (opcional, útiles para build nativo si algún paquete lo pide)
RUN apk add --no-cache bash

WORKDIR /app

# Solo copiar manifest para aprovechar la capa de cache
COPY package*.json ./

# Instalar deps (usa package-lock si existe)
RUN npm ci --omit=dev

# Copiar el resto del código
COPY . .

# Variables de entorno por defecto (se pueden sobreescribir en compose)
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Arranque
CMD ["node", "src/index.js"]
