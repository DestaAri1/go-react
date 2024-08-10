package handlers

import (
	"context"
	"fmt"
	"time"

	"github.com/DestaAri1/go-react/models"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

var validate = validator.New()

type AuthHandler struct {
	service models.AuthServices
}

func (h *AuthHandler) Login(ctx *fiber.Ctx) error {
	creds := &models.AuthCredentials{}

	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	if err := ctx.BodyParser(&creds); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status" : "fail",
			"message" : err.Error(),
			"data" : nil,
		})
	}

	if err := validate.Struct(creds); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status" : "fail",
			"message" : err.Error(),
		})
	}

	token, user, err := h.service.Login(context, creds)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status" : "fail",
			"message" : err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status" : "success",
		"message" : "Succesfully logged in",
		"data" : &fiber.Map{
			"token" : token,
			"user" : user,
		},
	})
}

func (h *AuthHandler) Register(ctx *fiber.Ctx) error {
	creds := &models.AuthCredentials{}

	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	if err := ctx.BodyParser(&creds); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status" : "fail",
			"message" : err.Error(),
			"data" : nil,
		})
	}

	if err := validate.Struct(creds); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status" : "fail",
			"message" : fmt.Errorf("please provide a valid email and password").Error(),
		})
	}

	token, user, err := h.service.Register(context, creds)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status" : "fail",
			"message" : err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status" : "success",
		"message" : "Succesfully logged in",
		"data" : &fiber.Map{
			"token" : token,
			"user" : user,
		},
	})
}

func NewAuthHandler(router fiber.Router, service models.AuthServices) {
	handler := &AuthHandler{
		service:service,
	}

	router.Post("/login", handler.Login)
	router.Post("/register", handler.Register)
}