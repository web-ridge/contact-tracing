package main

import (
	"database/sql"
	"fmt"
	"os"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"github.com/rs/zerolog/log"
	"github.com/volatiletech/sqlboiler/boil"
	_ "github.com/volatiletech/sqlboiler/drivers"
	_ "github.com/volatiletech/sqlboiler/drivers/sqlboiler-psql/driver"
)

func getDatabase() *sql.DB {
	// Start database connection
	connStr := fmt.Sprintf(`host=%v port=%v user=%v dbname=%v password=%v sslmode=%v`,
		os.Getenv("DATABASE_HOST"),
		os.Getenv("DATABASE_PORT"),
		os.Getenv("DATABASE_USER"),
		os.Getenv("DATABASE_NAME"),
		os.Getenv("DATABASE_PASSWORD"),
		os.Getenv("DATABASE_SSL_MODE"),
	)

	if os.Getenv("DATABASE_DEBUG") == "true" {
		boil.DebugMode = true
	}

	// Open handle to database like normal
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal().Err(err).Msg("could not open database connection")
	}
	// https://www.alexedwards.net/blog/configuring-sqldb
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err = db.Ping(); err != nil {
		log.Fatal().Err(err).Msg("no real database connection")
	}
	return db
}
