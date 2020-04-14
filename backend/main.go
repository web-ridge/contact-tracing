package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/go-redis/redis/v7"
	// "github.com/go-redis/redis_rate/v8"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/web-ridge/contact-tracing/backend/database"
	"github.com/web-ridge/contact-tracing/backend/handler"
)

func main() {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix

	port := os.Getenv("PORT")
	redisHost := os.Getenv("REDIS_HOST")
	redisPort := os.Getenv("REDIS_PORT")

	redisClient := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%v:%v", redisHost, redisPort),
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	pong, err := redisClient.Ping().Result()
	if err != nil {
		log.Fatal().Err(err)
	}
	log.Info().Msg("connected to redis :) " + pong)

	db, err := database.GetDatabase()
	if err != nil {
		log.Fatal().Err(err)
	}

	handler := handler.NewHandler(db, redisClient)

	// limiter := redis_rate.NewLimiter(redisClient)

	// Create REST api for telephone user

	http.HandleFunc("/checkInfections", handler.CheckInfections)
	http.HandleFunc("/userConfirmedInfection", handler.UserConfirmedInfection)

	if err := http.ListenAndServe(fmt.Sprintf(":%v", port), nil); err != nil {
		log.Fatal().Err(err)
	}
}
