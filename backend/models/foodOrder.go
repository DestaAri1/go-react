package models

import (
	"context"
	"time"
)

type FoodOrder struct {
	Id        uint      `json:"id" gorm:"primarykey"`
	FoodId    uint      `json:"food_id"`
	Food      Food      `json:"food" gorm:"foreignkey:FoodId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Amount    uint      `json:"amount"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type FoodOrderRepository interface {
	CreateMany(ctx context.Context, foodOrders []FoodOrder) ([]FoodOrder, error)
	FindFoodById(ctx context.Context, foodId uint) (*Food, error)
}

type FormFoodOrder struct {
	FoodId uint `json:"food_id" validate:"required,numeric"`
	Amount uint `json:"amount" validate:"required,numeric"`
}

type FormFoodOrderBatch struct {
	FoodOrders []FormFoodOrder `json:"food_orders" validate:"required,dive"`
}
