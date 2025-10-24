package main

import (
	"log"
	"os"

	"tarea4_servicio_compra/internal/api"
	"tarea4_servicio_compra/internal/bd"
	"tarea4_servicio_compra/internal/dominio"

	"github.com/gin-gonic/gin"
)

func main() {
	// Conexión BD y migración
	db := bd.NuevaConexion()
	if db == nil {
		log.Fatal("No se pudo abrir la conexión a la BD")
	}
	bd.Migrar(db)

	// Conexión RabbitMQ
	mq := dominio.NuevaMQ()
	defer mq.Cerrar()

	// Servicio de negocio
	svc := dominio.NuevoServicioCompras(db, mq)
	ctrl := api.NuevoControlador(svc)

	// Servidor HTTP con Gin
	r := gin.Default()

	// Ruta de salud
	r.GET("/health", func(c *gin.Context) { c.JSON(200, gin.H{"ok": true}) })

	// Rutas protegidas con JWT
	auth := r.Group("/")
	auth.Use(api.MiddlewareAuth())
	{
		auth.POST("/compras", ctrl.CrearCompra)
		auth.GET("/compras", ctrl.MisCompras)
		auth.GET("/compras/:id", ctrl.VerCompra)
		auth.POST("/compras/:id/pay", ctrl.Pagar)
	}

	// Puerto configurable por ENV
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("🚀 Servidor corriendo en puerto", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
