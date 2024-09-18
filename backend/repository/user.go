package repository

import (
	"context"

	"github.com/DestaAri1/go-react/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func (r *UserRepository) UpdateUser(ctx context.Context, userId uint, updateData map[string]interface{}) (*models.User, error) {
	user := &models.User{}

	updateRes := r.db.Model(user).Where("id = ?", userId).Updates(updateData)

	if updateRes.Error != nil {
		return nil, updateRes.Error
	}

	return user, nil
}

func NewUserRepository(db *gorm.DB) models.UserRepository {
	return &UserRepository{
		db:db,
	}
}