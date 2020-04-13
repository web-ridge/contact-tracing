package database

import (
	"fmt"
	"os"
	"time"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/joho/godotenv/autoload"
)

func GetDatabase() (*gorm.DB, error) {
	// Start database connection
	connStr := fmt.Sprintf(`%v:%v@tcp(%v:%v)/%v`,
		os.Getenv("DATABASE_USER"),
		os.Getenv("DATABASE_PASSWORD"),
		os.Getenv("DATABASE_HOST"),
		os.Getenv("DATABASE_PORT"),
		os.Getenv("DATABASE_NAME"),
	)

	// Open handle to database like normal
	db, err := gorm.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("could not open database connection: %v", err)
	}

	// set debug mode
	if os.Getenv("DATABASE_DEBUG") == "true" {
		db.LogMode(true)
	}

	// https://www.alexedwards.net/blog/configuring-sqldb
	db.DB().SetMaxOpenConns(25)
	db.DB().SetMaxIdleConns(25)
	db.DB().SetConnMaxLifetime(5 * time.Minute)

	if err = db.DB().Ping(); err != nil {
		return nil, fmt.Errorf("could not ping database connection: %v", err)
	}

	if err := db.AutoMigrate(&InfectionCode{}, &User{}, &Company{}); err != nil {
		return nil, fmt.Errorf("could not migrate database tables: %v", err)
	}
	return db, nil
}
