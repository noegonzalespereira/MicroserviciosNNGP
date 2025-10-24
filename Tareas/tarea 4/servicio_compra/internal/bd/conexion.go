package bd

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// NuevaConexion abre la conexión a la base de datos con reintentos
func NuevaConexion() *gorm.DB {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	name := os.Getenv("DB_NAME")
	sslmode := os.Getenv("DB_SSLMODE")

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, pass, name, sslmode,
	)

	var db *gorm.DB
	var err error

	// Intentar hasta 10 veces (30s en total)
	for i := 1; i <= 10; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			log.Println("✅ Conexión a BD establecida correctamente")
			return db
		}

		log.Printf("⏳ Intento %d/10 fallido BD: %v", i, err)
		time.Sleep(3 * time.Second)
	}

	log.Fatalf("❌ No se pudo conectar a la BD después de varios intentos: %v", err)
	return nil
}
