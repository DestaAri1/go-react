package handlers

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/DestaAri1/go-react/models"
	"github.com/gofiber/fiber/v2"
	"github.com/skip2/go-qrcode"
)

type TicketHandler struct {
	repository models.TicketRepository
}

func (h *TicketHandler) handlerError (ctx *fiber.Ctx, status int, message string) error {
	return ctx.Status(status).JSON(&fiber.Map{
		"status": "fail",
		"message" : message,
	})
}

func (h *TicketHandler) handlerSuccess(ctx *fiber.Ctx, status int, message string, data interface{}) error {
	return ctx.Status(status).JSON(&fiber.Map{
		"status" : "success",
		"message" : message,
		"data" : data,
	})
}

func (h *TicketHandler) GetMany(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	userId := uint(ctx.Locals("userId").(float64))

	tickets, err := h.repository.GetMany(context, userId)

	if err != nil {
		return ctx.Status(fiber.StatusBadGateway).JSON(&fiber.Map{
			"status" : "fail",
			"message" : err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status" : "success",
		"message" : "",
		"data" : tickets,
	})
}

func (h *TicketHandler) GetOne(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	ticketId, _ := strconv.Atoi(ctx.Params("ticketId"))

	userId := uint(ctx.Locals("userId").(float64))

	ticket, err := h.repository.GetOne(context, userId, uint(ticketId))

	if err != nil {
		return ctx.Status(fiber.StatusBadGateway).JSON(&fiber.Map{
			"status" : "fail",
			"message" : err.Error(),
		})
	}

	var QRCode []byte

	QRCode, err = qrcode.Encode(
		fmt.Sprintf("ticketId:%v", "ownerId:%v", ticketId, userId),
		qrcode.Medium,
		256,
	)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status" : "fail",
			"message" : err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status" : "success",
		"message" : "",
		"data" : &fiber.Map{
			"ticket" : ticket,
			"qrcode" : QRCode,
		},
	})
}

func (h *TicketHandler) CreateOne(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	ticket := &models.Ticket{}

	userId := uint(ctx.Locals("userId").(float64))

	if err := ctx.BodyParser(ticket); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(&fiber.Map{
			"status" : "fail",
			"message" : err.Error(),
			"data" : nil,
		})
	}

	ticket, err := h.repository.CreateOne(context, ticket, userId)

	if err != nil {
		return ctx.Status(fiber.StatusBadGateway).JSON(&fiber.Map{
			"status" : "fail",
			"message" : err.Error(),
		})
	}

	return ctx.Status(fiber.StatusCreated).JSON(&fiber.Map{
		"status" : "success",
		"message" : "Ticket has been created!",
	})
}

func (h *TicketHandler) ValidateOne(ctx *fiber.Ctx) error {
    context, cancel := context.WithTimeout(context.Background(), time.Duration(10*time.Second)) // Increased timeout (adjust as needed)
    defer cancel()

	validateBody := &models.ValidateTicket{}

	if err := ctx.BodyParser(validateBody); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(&fiber.Map{
			"status" : "fail",
			"message" : err.Error(),
			"data" : "null",
		})
	}

	validateData := make(map[string]interface{})

	validateData["entered"] = true
	
	_, err := h.repository.UpdateOne(context, validateBody.OwnerId, validateBody.TicketId, validateData)

	if err != nil {
		return ctx.Status(fiber.StatusBadGateway).JSON(&fiber.Map{
			"status" : "fail",
			"message" : err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status" : "success",
		"message" : "Welcome to the Show",
	})
}

func NewTicketHandler(router fiber.Router, repository models.TicketRepository) {
	handler := &TicketHandler{
		repository : repository,
	}

	router.Get("/", handler.GetMany)
	router.Post("/", handler.CreateOne)
	router.Get("/:ticketId", handler.GetOne)
	router.Post("/validate", handler.ValidateOne)
}