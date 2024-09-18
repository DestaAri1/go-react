package handlers

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/DestaAri1/go-react/models"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	repository models.UserRepository
}

func (h *UserHandler) response(ctx *fiber.Ctx, status int, message string, data interface{}) error {
	var status2 string

	if status == fiber.StatusOK {
		status2 = "success"
	} else if status == fiber.StatusInternalServerError {
		status2 = "error"
	} else {
		status2 = "fail"
	}
	return ctx.Status(status).JSON(&fiber.Map{
		"status":  status2,
		"message": message,
		"data":    data,
	})
}

func (h *UserHandler) handleValidationError(ctx *fiber.Ctx, err error) error {
	var ve validator.ValidationErrors
	if errors.As(err, &ve) {
		for _, err := range ve {
			var message string
			switch err.Field() {
			case "Username":
				message = "name field is required"
				return h.response(ctx, fiber.StatusBadRequest, message, nil)
			case "Image":
				message = "image must be a valid format (jpg, png, jpeg) and less than 2MB"
				return h.response(ctx, fiber.StatusBadRequest, message, nil)
			}
		}
	}
	return nil
}

func (h *UserHandler) UpdateUser(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	userId, ok := ctx.Locals("userId").(float64)

	if !ok {
		return h.response(ctx, fiber.StatusUnauthorized, "User not found", nil)
	}

	updateData := make(map[string]interface{})
	// Parsing body data (json form fields)
	if err := ctx.BodyParser(&updateData); err != nil {
		return h.response(ctx, fiber.StatusUnprocessableEntity, err.Error(), nil)
	}

	// File handling for image validation (if an image is provided)
	file, err := ctx.FormFile("image")
	if err == nil {
		// Validate file size (max 2MB)
		const maxFileSize = 2 * 1024 * 1024 // 2MB
		if file.Size > maxFileSize {
			return h.response(ctx, fiber.StatusBadRequest, "Image size exceeds the 2MB limit", nil)
		}

		// Validate file extension
		extension := getFileExtension(file.Filename)
		if !isValidImageExtension(extension) {
			return h.response(ctx, fiber.StatusBadRequest, "Invalid image format, must be jpg, jpeg, or png", nil)
		}

		// Add image file name to updateData (if image validation passes)
		imageFileName := fmt.Sprintf("user_%d%s", int(userId), extension)
		updateData["image"] = imageFileName

		// Simpan gambar (opsional) di direktori yang diinginkan
		// Misal, ctx.SaveFile(file, fmt.Sprintf("./uploads/%s", imageFileName))
	}

	formData := &models.UserValidate{}
	if err := mapToStruct(updateData, formData); err != nil {
		return h.response(ctx, fiber.StatusUnprocessableEntity, "Invalid input", nil)
	}

	validate := validator.New()
	if err := validate.Struct(formData); err != nil {
		return h.handleValidationError(ctx, err)
	}

	updateUser, err := h.repository.UpdateUser(context, uint(userId), updateData)

	if err != nil {
		return h.response(ctx, fiber.StatusBadGateway, err.Error(), nil)
	}

	return h.response(ctx, fiber.StatusOK, "Profile updated successfully", updateUser)
}

func NewUserHandler(router fiber.Router, repository models.UserRepository) {
	handler := &UserHandler{
		repository: repository,
	}

	router.Put("/update_profile", handler.UpdateUser)
}

// Helper function to get file extension
func getFileExtension(filename string) string {
	// Mengambil ekstensi dari file
	return strings.ToLower(filename[strings.LastIndex(filename, "."):])
}

// Validasi ekstensi gambar
func isValidImageExtension(ext string) bool {
	return ext == ".jpg" || ext == ".jpeg" || ext == ".png"
}
