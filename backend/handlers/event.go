package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/DestaAri1/go-react/models"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type EventHandler struct {
	repository models.EventRepository
}

func (h *EventHandler) handleError(ctx *fiber.Ctx, status int, message string) error {
	return ctx.Status(status).JSON(&fiber.Map{
		"status":  "fail",
		"message": message,
	})
}

func (h *EventHandler) handleSuccess(ctx *fiber.Ctx, status int, message string, data interface{}) error {
	return ctx.Status(status).JSON(&fiber.Map{
		"status":  "success",
		"message": message,
		"data":    data,
	})
}

func (h *EventHandler) GetMany(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	events, err := h.repository.GetMany(context)

	if err != nil {
		return h.handleError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handleSuccess(ctx, fiber.StatusOK, "", events)
}

func (h *EventHandler) GetOne(ctx *fiber.Ctx) error {
	eventId, _ := strconv.Atoi(ctx.Params("eventId"))

	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	event, err := h.repository.GetOne(context, uint(eventId))

	if err != nil {
		return h.handleError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handleSuccess(ctx, fiber.StatusOK, "", event)
}

func (h *EventHandler) CreateOne(ctx *fiber.Ctx) error {
	event := &models.Event{}

	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	if err := ctx.BodyParser(event); err != nil {
		return h.handleError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	formData := &models.FormEventInput{} // Asumsikan kamu punya struct untuk form input
	if err := ctx.BodyParser(formData); err != nil {
		return h.handleSuccess(ctx, fiber.StatusUnprocessableEntity, err.Error(), nil)
	}

	if err := validator.New().Struct(formData); err != nil {
		var ve validator.ValidationErrors
		if errors.As(err, &ve) {
			for _, err := range ve {
				var message string
				switch err.Field() {
				case "Name":
					switch err.Tag() {
					case "required":
						message = fmt.Errorf("name field is required").Error()
						return h.handleError(ctx, fiber.StatusBadRequest, message)
					case "min":
						message = fmt.Errorf("minimum character is 3").Error()
						return h.handleError(ctx, fiber.StatusBadRequest, message)
					case "max":
						message = fmt.Errorf("maximum character is 100").Error()
						return h.handleError(ctx, fiber.StatusBadRequest, message)
					}
				case "Location":
					switch err.Tag() {
					case "required":
						message = fmt.Errorf("location field is required").Error()
						return h.handleError(ctx, fiber.StatusBadRequest, message)
					}
				case "Date":
					switch err.Tag() {
					case "required":
						message = fmt.Errorf("date field is required").Error()
						return h.handleError(ctx, fiber.StatusBadRequest, message)
					}
				}
			}
		}
	}

	event.Name = formData.Name
	event.Location = formData.Location
	event.Date = formData.Date

	event, err := h.repository.CreateOne(context, event, formData)

	if err != nil {
		return h.handleError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handleSuccess(ctx, fiber.StatusOK, "Event Created!", event)
}

func (h *EventHandler) UpdateOne(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()
	
	eventId, _ := strconv.Atoi(ctx.Params("eventId"))

	updatedData := make(map[string]interface{})

	if err := ctx.BodyParser(&updatedData); err != nil {
		return h.handleSuccess(ctx, fiber.StatusUnprocessableEntity, err.Error(), nil)
	}

	// Pindahkan data dari map ke struct untuk divalidasi
	formData := &models.FormEventInput{}
	if err := mapToStruct(updatedData, formData); err != nil {
		return h.handleSuccess(ctx, fiber.StatusBadRequest, "Invalid input format!", err.Error())
	}

	// Lakukan validasi terhadap data yang di-update
	if err := validator.New().Struct(formData); err != nil {
		var ve validator.ValidationErrors
		if errors.As(err, &ve) {
			for _, err := range ve {
				var message string
				switch err.Field() {
				case "Name":
					switch err.Tag() {
					case "required":
						message = fmt.Errorf("name field is required").Error()
						return h.handleError(ctx, fiber.StatusBadRequest, message)
					case "min":
						message = fmt.Errorf("minimum character is 3").Error()
						return h.handleError(ctx, fiber.StatusBadRequest, message)
					case "max":
						message = fmt.Errorf("maximum character is 100").Error()
						return h.handleError(ctx, fiber.StatusBadRequest, message)
					}
				case "Location":
					switch err.Tag() {
					case "required":
						message = fmt.Errorf("location field is required").Error()
						return h.handleError(ctx, fiber.StatusBadRequest, message)
					}
				case "Date":
					switch err.Tag() {
					case "required":
						message = fmt.Errorf("date field is required").Error()
						return h.handleError(ctx, fiber.StatusBadRequest, message)
					}
				}
			}
		}
	}

	// Setelah validasi, lakukan update
	event, err := h.repository.UpdateOne(context, uint(eventId), updatedData)

	if err != nil {
		return h.handleError(ctx, fiber.StatusBadGateway, err.Error())
	}

	return h.handleSuccess(ctx, fiber.StatusOK, "Event update successfully!", event)
}

func (h *EventHandler) DeleteOne(ctx *fiber.Ctx) error {
	eventId, _ := strconv.Atoi(ctx.Params("eventId"))

	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	err := h.repository.DeleteOne(context, uint(eventId))

	if err != nil {
		return h.handleError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handleSuccess(ctx, fiber.StatusOK, "Data successfully deleted!", nil)
}

func mapToStruct(m map[string]interface{}, s interface{}) error {
	data, err := json.Marshal(m)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, s)
}

func NewEventHandler(router fiber.Router, repository models.EventRepository) {
	handler := &EventHandler{
		repository: repository,
	}

	router.Get("/", handler.GetMany)
	router.Post("/", handler.CreateOne)
	router.Get("/:eventId", handler.GetOne)
	router.Put("/:eventId", handler.UpdateOne)
	router.Delete("/:eventId", handler.DeleteOne)
}
