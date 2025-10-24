# Etapa de compilación
FROM golang:1.23-alpine AS build
WORKDIR /app

# Copiar go.mod y descargar dependencias
COPY go.mod go.sum ./
RUN go mod download

# Copiar todo el código y compilar
COPY . .
RUN CGO_ENABLED=0 go build -o compras ./server

# Imagen final ligera
FROM gcr.io/distroless/base-debian12
WORKDIR /app
COPY --from=build /app/compras /app/compras
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["/app/compras"]
