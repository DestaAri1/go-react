package repository

import (
	"context"
	"time"

	"github.com/DestaAri1/go-react/models"
	"gorm.io/gorm"
)

type EventRepository struct{
	db *gorm.DB
}

func (r *EventRepository) GetMany(ctx context.Context) ([]*models.EventResponse, error) {
	events := []*models.EventResponse{}

	rows, err := r.db.Model(&models.Event{}).Select("id, name, location, date").Order("updated_at desc").Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var event models.Event
		if err := r.db.ScanRows(rows, &event); err != nil {
			return nil, err
		}
		
		eventResponse := &models.EventResponse{
			Id:       event.Id,
			Name:     event.Name,
			Location: event.Location,
			Date:     event.Date.Format("2006-01-02"), // Format tanggal sebagai string YYYY-MM-DD
		}
		events = append(events, eventResponse)
	}

	return events, nil
}

func (r *EventRepository) GetOne(ctx context.Context, eventId uint) (*models.Event, error) {
	event := &models.Event{}

	res := r.db.Model(event).Where("id = ?", eventId).First(event)

	if res.Error != nil {
		return nil, res.Error
	}

	return event, nil
}

func (r *EventRepository) CreateOne(ctx context.Context, event *models.Event, formInput *models.FormEventInput) (*models.Event, error) {
	// Parse string date dari form input ke time.Time
	date, err := time.Parse("2006-01-02", formInput.Date)
	if err != nil {
		return nil, err
	}

	event.Name = formInput.Name
	event.Location = formInput.Location
	event.Date = date

	res := r.db.Model(event).Create(event)

	if res.Error != nil {
		return nil, res.Error
	}

	return event, nil
}

func (r *EventRepository) UpdateOne(ctx context.Context, eventId uint, updateData map[string]interface{}) (*models.Event, error) {
	event := &models.Event{}

	// Jika ada update tanggal, konversi dari string ke time.Time
	if dateStr, ok := updateData["date"].(string); ok {
		date, err := time.Parse("2006-01-02", dateStr)
		if err != nil {
			return nil, err
		}
		updateData["date"] = date
	}

	updateRes := r.db.Model(event).Where("id = ?", eventId).Updates(updateData)
	if updateRes.Error != nil {
		return nil, updateRes.Error
	}

	getRes := r.db.Where("id = ?", eventId).First((event))
	if getRes.Error != nil {
		return nil, getRes.Error
	}

	return event, nil
}

func (r *EventRepository) DeleteOne(ctx context.Context, eventId uint) error {
	res := r.db.Delete(&models.Event{}, eventId)

	return res.Error
}

func NewEventRepositories(db *gorm.DB) models.EventRepository{
	return &EventRepository{
		db: db,
	} 
}