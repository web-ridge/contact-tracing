package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/go-redis/redis/v7"
	"github.com/gorilla/mux"
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

	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%v:%v", redisHost, redisPort),
		Password: "", // no password set
		DB:       0,  // use default DB
	})
	pong, err := client.Ping().Result()
	if err != nil {
		log.Fatal().Err(err)
	}
	log.Info().Msg("connected to redis :) " + pong)

	db, err := database.GetDatabase()
	if err != nil {
		log.Fatal().Err(err)
	}

	handler := handler.NewHandler(db, client)

	// Create REST api for telephone user
	r := mux.NewRouter().StrictSlash(true)
	r.HandleFunc("/checkInfections", handler.CheckInfections).Methods(http.MethodPost)
	r.HandleFunc("/userConfirmedInfection", handler.UserConfirmedInfection).Methods(http.MethodPost)

	if err := http.ListenAndServe(fmt.Sprintf(":%v", port), r); err != nil {
		log.Fatal().Err(err)
	}
}

func cleanOldData() {
	// TODO: clean infection codes older than 2 days
}
