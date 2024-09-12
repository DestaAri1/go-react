package models

import (
	"context"
	"time"

	"gorm.io/gorm"
)

type Food struct {
	Id        uint   	`json:"id" gorm:"primarykey"`
	Name      string 	`json:"name"`
	Available bool   	`json:"avalilable" gorm:"default:false"`
	Selled 	  int64     `json:"selled" gorm:"default:0"`
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

type FormFoodOrderInput struct {
	Selled int64 `json:"selled" validate:"required,numeric"`
}

func (e *Food) AfterFind(db *gorm.DB) (err error) {
	// Hitung total amount dari FoodOrder yang sesuai dengan FoodId
	var totalSelled int64
	if err := db.Model(&FoodOrder{}).
		Where("food_id = ?", e.Id).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&totalSelled).Error; err != nil {
		return err
	}

	// Update field Selled di tabel Food
	if err := db.Model(e).Update("selled", totalSelled).Error; err != nil {
		return err
	}

	return nil
}