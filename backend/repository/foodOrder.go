package repository

import (
	"context"

	"github.com/DestaAri1/go-react/models"
	"gorm.io/gorm"
)

type FoodOrderRepository struct {
	db *gorm.DB
}

func (r *FoodOrderRepository) CreateMany(ctx context.Context, foodOrders []models.FoodOrder) ([]models.FoodOrder, error) {
	if err := r.db.WithContext(ctx).Create(&foodOrders).Error; err != nil {
		return nil, err
	}
	return foodOrders, nil
}

func (r *FoodOrderRepository) FindFoodById(ctx context.Context, foodId uint) (*models.Food, error) {
	var food models.Food
	if err := r.db.WithContext(ctx).First(&food, foodId).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil // Food not found
		}
		return nil, err // Other errors
	}
	return &food, nil
}

func NewFoodOrderRepository(db *gorm.DB) models.FoodOrderRepository {
	return &FoodOrderRepository{db:db}
}
