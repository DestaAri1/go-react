package repository

import (
	"context"

	"github.com/DestaAri1/go-react/models"
	"gorm.io/gorm"
)

type FoodRepository struct {
	db *gorm.DB
}

func (r *FoodRepository) GetMany(ctx context.Context) ([]*models.Food, error) {
	foods := []*models.Food{}

	res := r.db.Model(&models.Food{}).Order("name desc").Find(&foods)

	if res.Error != nil {
		return nil, res.Error
	}
	return foods, nil
}

func (r *FoodRepository) GetOne(ctx context.Context, foodId uint) (*models.Food, error) {
	food := &models.Food{}

	res := r.db.Model(food).Where("id = ?", foodId).First(food)

	if res.Error != nil {
		return nil, res.Error
	}

	return food, nil
}

func (r *FoodRepository) CreateOne(ctx context.Context, food *models.Food, formInput *models.FormFoodInput) (*models.Food, error) {
	food.Name = formInput.Name

	res := r.db.Model(&models.Food{}).Create(food)

	if res.Error != nil {
		return nil, res.Error
	}

	return food, nil
}

func (r *FoodRepository) UpdateOne(ctx context.Context, foodId uint, updateData map[string]interface{}) (*models.Food, error) {
	food := &models.Food{}

	updateFood := r.db.Model(food).Where("id = ?", foodId).Updates(updateData)

	if updateFood.Error != nil {
		return nil, updateFood.Error
	}

	return food, nil
}

func (r *FoodRepository) DeleteOne(ctx context.Context, foodId uint) error {
	res := r.db.Delete(&models.Food{}, foodId)

	return res.Error
}

func NewFoodRepositories(db *gorm.DB) models.FoodRepository{
	return &FoodRepository{
		db:db,
	}
}