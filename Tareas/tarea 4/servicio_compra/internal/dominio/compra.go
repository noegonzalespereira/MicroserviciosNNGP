package dominio

import "time"

type Estado string

const (
	EstadoPendiente Estado = "PENDIENTE"
	EstadoPagado    Estado = "PAGADO"
	EstadoCancelado Estado = "CANCELADO"
)

type Compra struct {
	ID             string     `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	IDUsuario      string     `gorm:"index;not null" json:"id_usuario"`
	UsuarioEmail   string     `gorm:"not null" json:"usuario_email"`
	IDEvento       string     `gorm:"index;not null" json:"id_evento"`
	Cantidad       int        `gorm:"not null" json:"cantidad"`
	PrecioUnitario float64    `gorm:"not null" json:"precio_unitario"`
	Total          float64    `gorm:"not null" json:"total"`
	Estado         Estado     `gorm:"type:text;not null" json:"estado"`
	CreatedAt      time.Time  `gorm:"autoCreateTime" json:"created_at"`
	PaidAt         *time.Time `json:"paid_at,omitempty"`
}
