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

func (h *TicketHandler) handlerError(ctx *fiber.Ctx, status int, message string) error {
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

func (h *TicketHandler) handlerValidation(ctx *fiber.Ctx, status int, message string) error {
	return ctx.Status(status).JSON(&fiber.Map{
		"status" : "fail",
		"message" : message,
		"data" : nil,
	})
}

func (h *TicketHandler) GetMany(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	userId := uint(ctx.Locals("userId").(float64))

	tickets, err := h.repository.GetMany(context, userId)

	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "", tickets)
}

func (h *TicketHandler) GetOne(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	ticketId, _ := strconv.Atoi(ctx.Params("ticketId"))

	userId := uint(ctx.Locals("userId").(float64))

	ticket, err := h.repository.GetOne(context, userId, uint(ticketId))

	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
	}

	var QRCode []byte

	QRCode, err = qrcode.Encode(
		fmt.Sprintf("ticketId:%v", "ownerId:%v", ticketId, userId),
		qrcode.Medium,
		256,
	)

	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	data := &fiber.Map{
		"ticket" : ticket,
		"qrcode" : QRCode,
	}
	return h.handlerSuccess(ctx, fiber.StatusOK, "", data)
}

func (h *TicketHandler) CreateOne(ctx *fiber.Ctx) error {
    context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
    defer cancel()

    ticket := &models.Ticket{}
	fmt.Println(ticket)

    // Log body yang diterima dari Postman
    if err := ctx.BodyParser(ticket); err != nil {
        fmt.Println("Body parsing error:", err)  // Logging error parsing
        return h.handlerError(ctx, fiber.StatusUnprocessableEntity, "Cannot parse body: "+err.Error())
    }
    
    // Log ticket yang berhasil diparsing
    fmt.Printf("Parsed Ticket: %+v\n", ticket)

    // Ambil userId dari context
    userId := ctx.Locals("userId")
    if userId == nil {
        return h.handlerError(ctx, fiber.StatusUnauthorized, "Unauthorized, userId not found")
    }

    userIdUint := uint(userId.(float64))
    fmt.Printf("UserId: %d\n", userIdUint)

    // Coba buat tiket baru
    _, err := h.repository.CreateOne(context, ticket, userIdUint)
    if err != nil {
        fmt.Println("Error creating ticket:", err)  // Logging error dari repository
        return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
    }

    return h.handlerSuccess(ctx, fiber.StatusOK, "Ticket has been created!", nil)
}


func (h *TicketHandler) ValidateOne(ctx *fiber.Ctx) error {
    context, cancel := context.WithTimeout(context.Background(), time.Duration(10*time.Second)) // Increased timeout (adjust as needed)
    defer cancel()

	validateBody := &models.ValidateTicket{}

	if err := ctx.BodyParser(validateBody); err != nil {
		return h.handlerValidation(ctx, fiber.StatusBadGateway, err.Error())
	}

	validateData := make(map[string]interface{})

	validateData["entered"] = true
	
	_, err := h.repository.UpdateOne(context, validateBody.OwnerId, validateBody.TicketId, validateData)

	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
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