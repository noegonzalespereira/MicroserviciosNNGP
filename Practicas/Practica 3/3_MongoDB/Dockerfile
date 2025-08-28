FROM node:20-alpine
WORKDIR /app

# 1) Instalar dependencias con caché
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# 2) Copiar SOLO el código necesario (evita sorpresas con .dockerignore)
COPY app.js ./               
COPY models ./models         
COPY views ./views             
# (No copies .env dentro de la imagen; lo inyecta docker-compose con env_file)

USER node
EXPOSE 4000
CMD ["npm","start"]
