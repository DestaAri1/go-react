package handlers

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/DestaAri1/go-react/middlewares"
	"github.com/DestaAri1/go-react/models"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type FoodHandlers struct {
	repository models.FoodRepository
}

func (h *FoodHandlers) respond(ctx *fiber.Ctx, status int, message string, data interface{}) error {
	var status2 string
	if status == fiber.StatusOK {
		status2 = "success"
	} else {
		status2 = "fail"
	}
	return ctx.Status(status).JSON(&fiber.Map{
		"status" :  status2,
		"message": message,
		"data":    data,
	})
}

func (h *FoodHandlers) handleValidationError(ctx *fiber.Ctx, err error) error {
	var ve validator.ValidationErrors
	if errors.As(err, &ve) {
		for _, err := range ve {
			var message string
			switch err.Field() {
			case "Name":
				switch err.Tag() {
				case "required":
					message = fmt.Sprintf("name field is required")
				case "min":
					message = fmt.Sprintf("minimum character is 4")
				case "max":
					message = fmt.Sprintf("maximum character is 100")
				}
				return h.respond(ctx, fiber.StatusBadRequest, message, nil)
			case "Selled": 
				switch err.Tag() {
				case "required":
					message = fmt.Sprint("you must add some number")
				case "number":
					message = fmt.Sprint("please give as some number")
				}
				return h.respond(ctx, fiber.StatusBadRequest, message, nil)
			}
		}
	}
	return nil
}

func (h *FoodHandlers) GetMany(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	foods, err := h.repository.GetMany(context)
	if err != nil {
		return h.respond(ctx, fiber.StatusBadGateway, err.Error(), nil)
	}
	return h.respond(ctx, fiber.StatusOK, "", foods)
}

func (h *FoodHandlers) GetOne(ctx *fiber.Ctx) error {
	foodId, _ := strconv.Atoi(ctx.Params("foodId"))

	context, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	food, err := h.repository.GetOne(context, uint(foodId))
	if err != nil {
		return h.respond(ctx, fiber.StatusBadRequest, err.Error(), nil)
	}
	return h.respond(ctx, fiber.StatusOK, "", food)
}

func (h *FoodHandlers) CreateOne(ctx *fiber.Ctx) error {
	formData := &models.FormFoodInput{}

	context, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := ctx.BodyParser(formData); err != nil {
		return h.respond(ctx, fiber.StatusUnprocessableEntity, err.Error(), nil)
	}

	if err := validator.New().Struct(formData); err != nil {
		return h.handleValidationError(ctx, err)
	}

	food := &models.Food{Name: formData.Name}
	food, err := h.repository.CreateOne(context, food, formData)

	if err != nil {
		return h.respond(ctx, fiber.StatusBadGateway, err.Error(), nil)
	}

	return h.respond(ctx, fiber.StatusOK, "", food)
}

func (h *FoodHandlers) UpdateOne(ctx *fiber.Ctx) error {
	foodId, _ := strconv.Atoi(ctx.Params("foodId"))

	context, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	updateData := make(map[string]interface{})
	if err := ctx.BodyParser(&updateData); err != nil {
		return h.respond(ctx, fiber.StatusUnprocessableEntity, err.Error(), nil)
	}

	formData := &models.FormFoodInput{}
	if err := mapToStruct(updateData, formData); err != nil || validator.New().Struct(formData) != nil {
		return h.handleValidationError(ctx, err)
	}

	food, err := h.repository.UpdateOne(context, uint(foodId), updateData)
	if err != nil {
		return h.respond(ctx, fiber.StatusBadGateway, err.Error(), nil)
	}

	return h.respond(ctx, fiber.StatusOK, "Event updated successfully!", food)
}

func (h *FoodHandlers) DeleteOne(ctx *fiber.Ctx) error {
	foodId, _ := strconv.Atoi(ctx.Params("foodId"))

	context, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := h.repository.DeleteOne(context, uint(foodId)); err != nil {
		return h.respond(ctx, fiber.StatusBadRequest, err.Error(), nil)
	}
	return h.respond(ctx, fiber.StatusOK, "Data successfully deleted", nil)
}

func NewFoodHandler(router fiber.Router, db *gorm.DB, repository models.FoodRepository) {
    handler := &FoodHandlers{repository: repository}

    // Public routes
    router.Get("/", handler.GetMany)
    router.Get("/:foodId", handler.GetOne)

    // Protected routes - Only managers can access these routes
    protected := router.Group("/").Use(middlewares.AuthProtected(db)).Use(middlewares.RoleAuthorization(db, models.Manager))
    protected.Post("/", handler.CreateOne)
    protected.Put("/:foodId", handler.UpdateOne)
    protected.Delete("/:foodId", handler.DeleteOne)
}
