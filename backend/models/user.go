package models

import (
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
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (u *User) AfterCreate(db *gorm.DB) (err error) {
	if u.Id == 1 {
		db.Model(u).Update("role", Manager)
	}
	return
}