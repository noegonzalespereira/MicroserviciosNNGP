package bd

import (
	"log"

	"tarea4_servicio_compra/internal/dominio"

	"gorm.io/gorm"
)

// Migrar crea o actualiza la tabla en la BD a partir del modelo Compra
func Migrar(db *gorm.DB) {
	err := db.AutoMigrate(&dominio.Compra{})
	if err != nil {
		log.Fatal("Error en la migración de la BD:", err)
	} else {
		log.Println("Migración completada correctamente")
	}
}
