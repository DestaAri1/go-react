package db

import (
	"github.com/DestaAri1/go-react/models"
	"gorm.io/gorm"
)

func DBMigrator(db *gorm.DB) error {
	return db.AutoMigrate(&models.Event{}, &models.Ticket{}, &models.User{}, &models.Food{}, &models.FoodOrder{})}