package db

import (
	"github.com/gofiber/fiber/v2/log"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Init(DBMigrator func(db *gorm.DB) error) *gorm.DB {

	db, err := gorm.Open(mysql.Open("root:@/golang?charset=utf8mb4&parseTime=True&loc=Local"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),	
	})

	if err != nil {
		log.Fatal("Unable to connect DBL %e", err)
	}
	
	log.Info("Success connect DB")
	
	if err := DBMigrator(db); err != nil {
		log.Fatal("Unable to migrate table %e", err)
	}

	return db
}