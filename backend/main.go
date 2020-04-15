package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	// "github.com/go-redis/redis_rate/v8"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/web-ridge/contact-tracing/backend/handler"
)

func main() {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix

	port := os.Getenv("PORT")

	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	mongoClient, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal().Err(err)
	}

	handler := handler.NewHandler(mongoClient)

	// limiter := redis_rate.NewLimiter(redisClient)

	// Create REST api for telephone user

	http.HandleFunc("/checkInfections", handler.CheckInfections)
	http.HandleFunc("/userConfirmedInfection", handler.UserConfirmedInfection)

	if err := http.ListenAndServe(fmt.Sprintf(":%v", port), nil); err != nil {
		log.Fatal().Err(err)
	}
}
