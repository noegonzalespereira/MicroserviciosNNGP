FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY app.js ./ 
COPY models ./models
COPY views ./views
# COPY public ./public

USER node
EXPOSE 5000            
CMD ["npm","start"]
