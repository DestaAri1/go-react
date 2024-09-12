package handlers

import (
	"errors"
	"fmt"

	"github.com/DestaAri1/go-react/middlewares"
	"github.com/DestaAri1/go-react/models"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type FoodOrderHandler struct {
	repository models.FoodOrderRepository
	validator  *validator.Validate // Add validator instance
}

// Custom error response for validation errors
func (h *FoodOrderHandler) handleValidationError(ctx *fiber.Ctx, err error) error {
	var ve validator.ValidationErrors
	if errors.As(err, &ve) {
		for _, err := range ve {
			var message string
			switch err.Field() {
			case "FoodId":
				switch err.Tag() {
				case "required":
					message = "Food name is required"
				case "numeric":
					message = "its hidden"
				}
				return h.respond(ctx, fiber.StatusBadRequest, message, nil)
			case "Amount":
				switch err.Tag() {
				case "required":
					message = "Amount is required."
				case "numeric":
					message = "Amount must be a valid number."
				}
				return h.respond(ctx, fiber.StatusBadRequest, message, nil)
			default:
				message = fmt.Sprintf("Validation failed on field '%s' with condition '%s'", err.Field(), err.Tag())
				return h.respond(ctx, fiber.StatusBadRequest, message, nil)
			}
		}
	}
	return nil
}


func (h *FoodOrderHandler) respond(ctx *fiber.Ctx, status int, message string, data interface{}) error {
	var status2 string
	if status == fiber.StatusOK || status == fiber.StatusCreated{
		status2 = "success"
	} else {
		status2 = "fail"
	}
	return ctx.Status(status).JSON(&fiber.Map{
		"status" : status2,
		"message" : message,
		"data" : data,
	})
}

func (h *FoodOrderHandler) CreateMany(c *fiber.Ctx) error {
	var input models.FormFoodOrderBatch

	// Parse and validate request body
	if err := c.BodyParser(&input); err != nil {
		return h.respond(c, fiber.StatusBadRequest, "Failed to parse request body", nil)
	}

	// Validate input
	if err := h.validator.Struct(&input); err != nil {
		return h.handleValidationError(c, err)
	}

	// Prepare the food orders to be saved
	var foodOrders []models.FoodOrder
	for _, order := range input.FoodOrders {
		// Check if the food exists
		food, err := h.repository.FindFoodById(c.Context(), order.FoodId)
		if err != nil {
			return h.respond(c, fiber.StatusInternalServerError, "Error finding food", nil)
		}
		if food == nil {
			return h.respond(c, fiber.StatusNotFound, "Food not found", nil)
		}

		// Add food order to list
		foodOrders = append(foodOrders, models.FoodOrder{
			FoodId: order.FoodId,
			Amount: order.Amount,
		})
	}

	// Save food orders in the repository
	_, err := h.repository.CreateMany(c.Context(), foodOrders)
	if err != nil {
		return h.respond(c, fiber.StatusInternalServerError, "Failed to create food orders", nil)
	}

	return h.respond(c, fiber.StatusCreated, "Food orders created successfully", nil)
}


func NewFoodOrderHandler(router fiber.Router, db *gorm.DB, repository models.FoodOrderRepository) {
	handler := &FoodOrderHandler{
		repository: repository,
		validator:  validator.New(), // Initialize the validator
	}

	protected := router.Group("/").Use(middlewares.AuthProtected(db)).Use(middlewares.RoleAuthorization(db, models.Manager))
	protected.Post("/", handler.CreateMany)
}
