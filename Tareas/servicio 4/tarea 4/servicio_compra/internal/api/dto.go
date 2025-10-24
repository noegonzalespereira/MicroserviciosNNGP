package api

type CrearCompraDTO struct {
	IDEvento       string  `json:"event_id" binding:"required"`
	Cantidad       int     `json:"quantity" binding:"required,min=1"`
	PrecioUnitario float64 `json:"unit_price" binding:"required,gt=0"`
}
