package models

import (
	"context"
	"time"
)

type Food struct {
	Id        uint   `json:"id" gorm:"primarykey"`
	Name      string `json:"name"`
	Available bool   `json:"avalilable" gorm:"default:false"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type FoodRepository interface {
	GetMany(ctx context.Context) ([]*Food, error)
	GetOne(ctx context.Context, foodId uint) (*Food, error)
	CreateOne(ctx context.Context, food *Food, formInput *FormFoodInput) (*Food, error)
	UpdateOne(ctx context.Context, foodId uint, updateData map[string]interface{}) (*Food, error)
	DeleteOne(ctx context.Context, foodId uint) error
}

type FormFoodInput struct {
	Name string `json:"name" validate:"required,min=4,max=100"`
}