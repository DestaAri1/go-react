package repository

import (
	"context"
	"fmt"

	"github.com/DestaAri1/go-react/models"
	"gorm.io/gorm"
)

type TickerRepository struct{
	db *gorm.DB
}

func (r *TickerRepository) GetMany(ctx context.Context, userId uint) ([]*models.Ticket, error) {
	tickets := []*models.Ticket{}

	res := r.db.Preload("Event").Where("user_id = ?", userId).Joins("Event").Find(&tickets)

	if res.Error != nil {
		return nil, res.Error
	}

	return tickets, nil
} 

func (r *TickerRepository) GetOne(ctx context.Context, userId uint, ticketId uint) (*models.Ticket, error) {
	ticket := &models.Ticket{}

	res := r.db.Model(ticket).Where("id = ?", ticketId).Where("user_id = ?", userId).Preload("Event").First(ticket)

	if res.Error != nil {
		return nil, res.Error
	}

	return ticket, nil
} 

func (r *TickerRepository) CreateOne(ctx context.Context, ticket *models.Ticket, userId uint) (*models.Ticket, error) {
    ticket.UserId = userId
    
    // Tambah log untuk memeriksa nilai dari tiket sebelum dibuat
    fmt.Printf("Creating ticket with data: %+v\n", ticket)

    res := r.db.Model(&models.Ticket{}).Create(ticket)
    if res.Error != nil {
        fmt.Println("Error inserting ticket:", res.Error)  // Log error saat insert ke database
        return nil, res.Error
    }

    return r.GetOne(ctx, ticket.Id, userId)
}

func (r *TickerRepository) UpdateOne(ctx context.Context, userId uint, ticketId uint, updateData map[string]interface{}) (*models.Ticket, error) {
	ticket := &models.Ticket{}

	updateRes := r.db.Model(ticket).Where("tickets.id = ?", ticketId).Updates(updateData)

	if updateRes.Error != nil {
		return nil, updateRes.Error
	}

	return r.GetOne(ctx, userId, ticket.Id)
} 

func NewTicketRepository(db *gorm.DB) models.TicketRepository{
	return &TickerRepository{
		db:db,
	}
}