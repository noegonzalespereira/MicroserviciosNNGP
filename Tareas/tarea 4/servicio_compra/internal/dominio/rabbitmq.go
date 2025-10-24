package dominio

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/streadway/amqp"
)

type MensajeEmail struct {
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Body    string `json:"body"`
}

type MQ struct {
	conn *amqp.Connection
	ch   *amqp.Channel
	q    amqp.Queue
}

// NuevaMQ crea una conexión y declara la cola con reintentos
func NuevaMQ() *MQ {
	url := os.Getenv("RABBITMQ_URL")
	if url == "" {
		url = "amqp://guest:guest@localhost:5672/"
	}

	var conn *amqp.Connection
	var ch *amqp.Channel
	var q amqp.Queue
	var err error

	// Intentar hasta 10 veces con espera
	for i := 1; i <= 10; i++ {
		conn, err = amqp.Dial(url)
		if err == nil {
			// Conectado 🎉
			ch, err = conn.Channel()
			if err != nil {
				log.Fatalf("❌ No se pudo abrir canal: %v", err)
			}

			q, err = ch.QueueDeclare(
				"email_notifications", // nombre de la cola
				true,                  // durable
				false,                 // auto-delete
				false,                 // exclusive
				false,                 // no-wait
				nil,                   // args
			)
			if err != nil {
				log.Fatalf("❌ Error declarando cola: %v", err)
			}

			log.Println("✅ Conexión a RabbitMQ establecida y cola lista")
			return &MQ{conn: conn, ch: ch, q: q}
		}

		log.Printf("⏳ Intento %d/10 fallido RabbitMQ: %v", i, err)
		time.Sleep(3 * time.Second)
	}

	log.Fatalf("❌ No se pudo conectar a RabbitMQ después de varios intentos: %v", err)
	return nil
}

// PublicarEmail envía un mensaje a la cola
func (m *MQ) PublicarEmail(msg MensajeEmail) error {
	body, _ := json.Marshal(msg)
	return m.ch.Publish(
		"",       // exchange vacío → default
		m.q.Name, // routing key = nombre de la cola
		false,    // mandatory
		false,    // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
}

// Cerrar libera recursos
func (m *MQ) Cerrar() {
	if m.ch != nil {
		_ = m.ch.Close()
	}
	if m.conn != nil {
		_ = m.conn.Close()
	}
}
