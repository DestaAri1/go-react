package handlers

// import (
// 	"context"
// 	"time"

// 	"github.com/DestaAri1/go-react/models"
// 	"github.com/gofiber/fiber/v2"
// )

// type FoodHandlers struct {
// 	repository models.FoodRepository
// }

// func (h *FoodHandlers) GetMany(ctx *fiber.Ctx) error {
// 	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
// 	defer cancel()

// 	// foods, err := h.repository.GetMany(context)

// 	// if err != nil {
// 	// 	return ctx.Status(fiber.StatusBadGateway).JSON(&fiber.Map{
// 	// 		"status" : "fail",
// 	// 		"message" : err.Error(),
// 	// 	})
// 	// }

// 	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
// 		"status" : "success",
// 		"message" : "",
// 		"data" : context,
// 	})
// }

// func NewFoodHandler(router fiber.Router, repository models.FoodRepository) {
// 	handler := &TicketHandler{
// 		repository : repository,
// 	}

// 	router.Get("/", handler.GetMany)
// 	router.Post("/", handler.CreateOne)
// 	router.Get("/:ticketId", handler.GetOne)
// 	router.Post("/validate", handler.ValidateOne)
// }