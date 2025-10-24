package api

import (
	"net/http"

	"tarea4_servicio_compra/internal/dominio"

	"github.com/gin-gonic/gin"
)

type Controlador struct {
	svc *dominio.ServicioCompras
}

func NuevoControlador(svc *dominio.ServicioCompras) *Controlador {
	return &Controlador{svc: svc}
}

// POST /compras
func (h *Controlador) CrearCompra(c *gin.Context) {
	var in CrearCompraDTO
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userID := c.GetString("user_id")
	email := c.GetString("user_email")

	compra := &dominio.Compra{
		IDUsuario:      userID,
		UsuarioEmail:   email,
		IDEvento:       in.IDEvento,       // <- ahora usa el campo correcto del DTO
		Cantidad:       in.Cantidad,       // <- ahora usa "Cantidad"
		PrecioUnitario: in.PrecioUnitario, // <- ahora usa "PrecioUnitario"
		Total:          in.PrecioUnitario * float64(in.Cantidad),
	}
	if err := h.svc.Crear(c.Request.Context(), compra); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, compra)
}

// GET /compras
func (h *Controlador) MisCompras(c *gin.Context) {
	userID := c.GetString("user_id")
	lista, err := h.svc.ListarPorUsuario(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, lista)
}

// GET /compras/:id
func (h *Controlador) VerCompra(c *gin.Context) {
	userID := c.GetString("user_id")
	id := c.Param("id")
	compra, err := h.svc.BuscarUna(c.Request.Context(), id, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no encontrada"})
		return
	}
	c.JSON(http.StatusOK, compra)
}

// POST /compras/:id/pay
func (h *Controlador) Pagar(c *gin.Context) {
	userID := c.GetString("user_id")
	id := c.Param("id")
	if err := h.svc.Pagar(c.Request.Context(), id, userID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 4. Respuesta OK
	c.JSON(http.StatusOK, gin.H{
		"status":  "PAID",
		"message": "Compra confirmada y notificación enviada a RabbitMQ",
	})
}
