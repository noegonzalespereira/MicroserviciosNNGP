# 1) Base oficial y ligera
FROM node:20-alpine

# 2) Carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3) Solo manifiestos para aprovechar caché
COPY package.json package-lock.json* ./

# 4) Instalar dependencias de producción
#    - usa npm ci si hay lockfile, si no, usa npm install
RUN npm ci --omit=dev || npm install --omit=dev

# 5) Copiamos el resto del código
COPY . .

# 6) Usuario no-root (mejor seguridad). El user "node" existe en node:alpine
USER node

# 7) Documentar puerto
EXPOSE 8080

# 8) Comando de arranque (usa "start" de package.json)
CMD ["npm","start"]
