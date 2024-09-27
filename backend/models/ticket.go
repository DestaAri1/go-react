package models

import (
	"context"
	"time"
)

type Ticket struct {
	Id        uint      `json:"id" gorm:"primarykey"`
	EventId   uint      `json:"event_id"`
	UserId    uint      `json:"userId"`
	Event     Event     `json:"event" gorm:"foreignkey:EventId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Entered   bool      `json:"entered" default:"false"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type TicketRepository interface {
	GetMany(ctx context.Context, userId uint) ([]*Ticket, error)
	GetOne(ctx context.Context, userId uint, ticketId uint) (*Ticket, error)
	CreateOne(ctx context.Context, ticket *Ticket, userId uint) (*Ticket, error)
	UpdateOne(ctx context.Context, userId uint, ticketId uint, updateData map[string]interface{}) (*Ticket, error)
	// DeleteOne(ctx context.Context) (*Ticket, error)
}

type ValidateTicket struct {
	TicketId uint `json:"ticketId"`
	OwnerId  uint `json:"ownerId"`
}