package main

import (
	"github.com/DestaAri1/go-react/database"
	"github.com/DestaAri1/go-react/handlers"
	"github.com/DestaAri1/go-react/middlewares"
	"github.com/DestaAri1/go-react/repository"
	"github.com/DestaAri1/go-react/services"
	"github.com/gofiber/fiber/v2"
)

func main() {
	db := db.Init(db.DBMigrator)
	app := fiber.New(fiber.Config{
		AppName: "TicketBooking",
		ServerHeader: "Fiber",
	})

	//Repositories
	eventRepository := repository.NewEventRepositories(db)
	ticketRepository := repository.NewTicketRepository(db)
	authRepository := repository.NewAuthRepository(db)

	//Service
	authService := services.NewAuthService(authRepository)

	//Routing
	server := app.Group("/api")
	handlers.NewAuthHandler(server.Group(("/auth")), authService)

	privateRoutes := server.Use(middlewares.AuthProtected(db))

	//Handlers
	handlers.NewEventHandler(privateRoutes.Group("/event"), eventRepository)
	handlers.NewTicketHandler(privateRoutes.Group("/ticket"), ticketRepository)

	app.Listen(":3000")
}