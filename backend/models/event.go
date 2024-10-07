package models

import (
	"context"
	"time"

	"gorm.io/gorm"
)

type Event struct {
	Id                    uint      `json:"id" gorm:"primarykey"`
	Name                  string    `json:"name"`
	Location              string    `json:"location"`
	TotalTicketsPurchased int64     `json:"totalTicketsPurchased" gorm:"-"`
	TotalTicketsEntered   int64     `json:"totalTicketsEntered" gorm:"-"`
	Date                  time.Time `json:"date" gorm:"type:date"`
	CreatedAt             time.Time `json:"created_at"`
	UpdatedAt             time.Time `json:"updated_at"`
}

type EventResponse struct {
	Id       uint      `json:"id"`
	Name     string    `json:"name"`
	Location string    `json:"location"`
	Date     string    `json:"date"` // Ubah menjadi string untuk format tanggal yang lebih terkontrol
}

type EventRepository interface {
	GetMany(ctx context.Context) ([]*EventResponse, error)
	GetOne(ctx context.Context, eventId uint) (*Event, error)
	CreateOne(ctx context.Context, event *Event, formInput *FormEventInput) (*Event, error)
	UpdateOne(ctx context.Context, eventId uint, updateData map[string]interface{}) (*Event, error)
	DeleteOne(ctx context.Context, eventId uint) error
}

type FormEventInput struct {
	Name     string `json:"name" validate:"required,min=3,max=100"`
	Location string `json:"location" validate:"required"`
	Date     string `json:"date" validate:"required"` // Ubah menjadi string untuk menerima format tanggal
}

func (e *Event) AfterFind(db *gorm.DB) (err error) {
	baseQuery := db.Model(&Ticket{}).Where(&Ticket{EventId: e.Id})

	if res := baseQuery.Count(&e.TotalTicketsPurchased); res.Error != nil {
		return res.Error
	}

	if res := baseQuery.Where("entered = ?", true).Count(&e.TotalTicketsEntered); res.Error != nil {
		return res.Error
	}

	return nil
}