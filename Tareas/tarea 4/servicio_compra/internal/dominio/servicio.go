package dominio

import (
	"context"
	"errors"
	"time"

	"gorm.io/gorm"
)

type ServicioCompras struct {
	db *gorm.DB
	mq *MQ
}

// Constructor
func NuevoServicioCompras(db *gorm.DB, mq *MQ) *ServicioCompras {
	return &ServicioCompras{db: db, mq: mq}
}

// Crear nueva compra
func (s *ServicioCompras) Crear(ctx context.Context, c *Compra) error {
	c.Estado = EstadoPendiente
	return s.db.WithContext(ctx).Create(c).Error
}

// Listar todas las compras de un usuario
func (s *ServicioCompras) ListarPorUsuario(ctx context.Context, userID string) ([]Compra, error) {
	var out []Compra
	err := s.db.WithContext(ctx).
		Where("id_usuario = ?", userID).
		Order("created_at DESC").
		Find(&out).Error
	return out, err
}

// Buscar una compra en particular
func (s *ServicioCompras) BuscarUna(ctx context.Context, id string, userID string) (*Compra, error) {
	var c Compra
	err := s.db.WithContext(ctx).
		First(&c, "id = ? AND id_usuario = ?", id, userID).Error
	if err != nil {
		return nil, err
	}
	return &c, nil
}

// Marcar como pagada y enviar notificación
func (s *ServicioCompras) Pagar(ctx context.Context, id string, userID string) error {
	var c Compra
	if err := s.db.WithContext(ctx).
		First(&c, "id = ? AND id_usuario = ?", id, userID).Error; err != nil {
		return err
	}
	if c.Estado != EstadoPendiente {
		return errors.New("la compra no está en estado PENDIENTE")
	}

	now := time.Now()
	c.Estado = EstadoPagado
	c.PaidAt = &now

	if err := s.db.WithContext(ctx).Save(&c).Error; err != nil {
		return err
	}

	// Publicar notificación en RabbitMQ
	msg := MensajeEmail{
		Email:   "tester@email.com",
		Subject: "asunto nuevo",
		Body:    "aqui un mensaje nuevo",
	}
	return s.mq.PublicarEmail(msg)
}
