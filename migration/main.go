package main

import (
	"fmt"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/joho/godotenv/autoload"

	"github.com/rs/zerolog/log"
)

//InfectedEncounter contains encounters which have been marked as a possible COVID-19 encounter
type InfectedEncounter struct {
	ID                   uint   `gorm:"primary_key"`         // auto increment
	RandomPart           string `gorm:"not null"`            // Part of hash of infected person so we group them together as one
	PossibleInfectedHash string `gorm:"not null;index:hash"` // Encountered Hash + index since we search on this a lot
	RSSI                 int    `gorm:"not null"`            // how strong the signal was
	Hits                 int    `gorm:"not null"`            // how many times this signal hit
	Time                 int    `gorm:"not null"`            // Date of contact (no hours and seconds sent in app)
}

// DeviceKey generated in the device and used to fetch risk information
type DeviceKey struct {
	ID       uint   `gorm:"primary_key"`             // auto increment
	Key      string `gorm:"not null;index:key"`      // This key is publicely available for other devices (Bluetooth Service UUID)
	Password string `gorm:"not null;index:password"` // Generated at device and used to fetch alerts secure so no one else can see the alerts on their deviceKey
	Time     int    `gorm:"not null"`                // We want to remove after 2 weeks
}

func main() {
	// Start database connection
	connStr := fmt.Sprintf(`host=%v port=%v user=%v dbname=%v password=%v sslmode=%v`,
		os.Getenv("DATABASE_HOST"),
		os.Getenv("DATABASE_PORT"),
		os.Getenv("DATABASE_USER"),
		os.Getenv("DATABASE_NAME"),
		os.Getenv("DATABASE_PASSWORD"),
		os.Getenv("DATABASE_SSL_MODE"),
	)

	// db, err := gorm.Open("postgres", connStr)
	// if err != nil {
	// 	if err = db.Exec(fmt.Sprintf("CREATE DATABASE %v;", os.Getenv("DATABASE_NAME"))).Error; err != nil {
	// 		log.Fatal().Err(err).Msg("Could not create database")
	// 	}
	// }

	// Open handle to database like normal
	db, err := gorm.Open("postgres", connStr)
	if err != nil {
		log.Fatal().Err(err).Msg("Could not open connection")
	}

	db.LogMode(true)
	db.SingularTable(true)

	if err = db.DB().Ping(); err != nil {
		log.Fatal().Err(err).Msg("Could not ping database")
	}

	if err := db.AutoMigrate(&InfectedEncounter{}).Error; err != nil {
		log.Fatal().Err(err)
	}
	log.Info().Msg("Done!")
}
