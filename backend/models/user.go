package models

import (
	"context"
	"time"

	"gorm.io/gorm"
)

type UserRole int

const (
	Manager  UserRole = 0
	Attendee UserRole = 1
)

type User struct {
	Id        uint      `json:"id" gorm:"primarykey"`
	Username  string	`json:"name" gorm:"text;not null"`
	Email     string    `json:"email" gorm:"text;not null"`
	Role      UserRole  `json:"role" gorm:"type:integer;default:1"`
	Password  string    `json:"-"` //Do not compute the password in json
	Image	  string	`json:"image"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type UserValidate struct {
	Username  string	`json:"username" validate:"required"`
	Password  string	`json:"-"`
	Image	  string	`json:"image"`
}

type UserRepository interface {
	UpdateUser(ctx context.Context, userId uint, updateData map[string]interface{}) (*User, error)
}

func (u *User) AfterCreate(db *gorm.DB) (err error) {
	if u.Id == 1 {
		db.Model(u).Update("role", Manager)
	}
	return
}