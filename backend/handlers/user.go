package handlers

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/DestaAri1/go-react/models"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/mitchellh/mapstructure"
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
    // Setup context for timeout
    context, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    userId, ok := ctx.Locals("userId").(float64)
    if !ok {
        return h.response(ctx, fiber.StatusUnauthorized, "User not found", nil)
    }
    
    // Create a map to hold the update data
    updateData := make(map[string]interface{})
    
    // Validate the update data
    formData := &models.UserValidate{}
    if err := mapstructure.Decode(updateData, formData); err != nil {
        return h.response(ctx, fiber.StatusUnprocessableEntity, "Invalid input", nil)
    }

    validate := validator.New()
    if err := validate.Struct(formData); err != nil {
        return h.handleValidationError(ctx, err)
    }
    
    // Parse form fields
    if form, err := ctx.MultipartForm(); err == nil {
        for key, values := range form.Value {
            if len(values) > 0 {
                updateData[key] = values[0]
            }
        }
    } else {
        // If it's not multipart form, try to parse as regular form
        if err := ctx.BodyParser(&updateData); err != nil {
            return h.response(ctx, fiber.StatusUnprocessableEntity, "Failed to parse request body: "+err.Error(), nil)
        }
    }

    // Handle file upload
    file, err := ctx.FormFile("image")
    if err == nil {
        // Validate file size (max 2MB)
        const maxFileSize = 2 * 1024 * 1024 // 2MB
        if file.Size > maxFileSize {
            return h.response(ctx, fiber.StatusBadRequest, "Image size exceeds the 2MB limit", nil)
        }

        // Validate file extension
        extension := filepath.Ext(file.Filename)
        if !isValidImageExtension(extension) {
            return h.response(ctx, fiber.StatusBadRequest, "Invalid image format, must be jpg, jpeg, or png", nil)
        }

        // Generate unique file name
        imageFileName := fmt.Sprintf("user_%d_%s%s", int(userId), time.Now().Format("20060102150405"), extension)
        updateData["image"] = imageFileName

        // Create uploads directory if it doesn't exist
        uploadsDir := "./uploads"
        if err := os.MkdirAll(uploadsDir, 0755); err != nil {
            return h.response(ctx, fiber.StatusInternalServerError, "Failed to create uploads directory", nil)
        }

        // Save the uploaded file to disk
        filePath := filepath.Join(uploadsDir, imageFileName)
        if err := ctx.SaveFile(file, filePath); err != nil {
            return h.response(ctx, fiber.StatusInternalServerError, "Failed to save image: "+err.Error(), nil)
        }
    }

    // Remove empty fields from the map
    for key, value := range updateData {
        if value == "" {
            delete(updateData, key)
        }
    }

    // Log the update data for debugging
    log.Printf("Update data: %+v", updateData)


    // Update user in repository
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
func isValidImageExtension(extension string) bool {
    validExtensions := map[string]bool{
        ".jpg":  true,
        ".jpeg": true,
        ".png":  true,
    }
    return validExtensions[strings.ToLower(extension)]
}
