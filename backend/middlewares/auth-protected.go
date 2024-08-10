package middlewares

import (
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/DestaAri1/go-react/models"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

func AuthProtected(db *gorm.DB) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		authHeader:= ctx.Get("Authorization")

		if authHeader == "" {
			log.Warnf("empty authorization header")

			return ctx.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
				"status" : "fail",
				"message" : "unauthorized",
			})
		}

		tokenParts := strings.Split(authHeader, " ")

		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			log.Warnf("invalid token parts")

			return ctx.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
				"status" : "fail",
				"message" : "unauthorized",
			})
		}

		tokenString := tokenParts[1]

		secret := []byte(os.Getenv("JWT_SECRET"))

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if token.Method.Alg() != jwt.GetSigningMethod("HS256").Alg() {
				return nil, fmt.Errorf("unexpected signing methon %s", token.Header["alg"])
			}
			return secret, nil
		})
		
		if err != nil || !token.Valid {
			log.Warnf("invalid token")

			return ctx.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
				"status" : "fail",
				"message" : "unauthorized",
			})
		}

		userId := token.Claims.(jwt.MapClaims)["id"]

		if err := db.Model(&models.User{}).Where("id = ?", userId).Error; errors.Is(err, gorm.ErrRecordNotFound) {
			log.Warnf("user not found")

			return ctx.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
				"status" : "fail",
				"message" : "unauthorized",
			})
		}

		ctx.Locals("userId", userId)

		return ctx.Next()
	}
}