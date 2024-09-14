package handlers

import (
	"context"

	"github.com/DestaAri1/go-react/models"
	"github.com/gofiber/fiber/v2"
)

type getUserHandler struct {
	repository models.AuthRepository
}

func (h *getUserHandler) response(ctx *fiber.Ctx, status int, message string, data interface{}) error {
	var status2 string

	if status == fiber.StatusOK {
		status2 = "success"
	} else if status == fiber.StatusInternalServerError {
		status2 = "error"
	} else {
		status2 = "fail"
	}
	
	return ctx.Status(status).JSON(&fiber.Map{
		"status" : status2,
		"message" : message,
		"data" : data,
	})
}

func (h *getUserHandler) getUser(ctx *fiber.Ctx) error {
	userId, ok := ctx.Locals("userId").(float64)

	if !ok {
		return h.response(ctx, fiber.StatusUnauthorized, "Failed to get user ID from token", nil)
	}

	user, err := h.repository.GetUser(context.Background(), "id = ?", userId)
	if err != nil {
		return h.response(ctx, fiber.StatusInternalServerError, "Internal Server Error", nil)
	}

	if user == nil {
		return h.response(ctx, fiber.StatusNotFound, "user not found", nil)
	}

	return h.response(ctx, fiber.StatusOK, "", user)
}

func NewGetUserHandler(router fiber.Router, repository models.AuthRepository) {
	handler := &getUserHandler{
		repository: repository,
	}
	router.Get("/getUser", handler.getUser)
}