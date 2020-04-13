package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	"github.com/mediocregopher/radix/v3"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

var pool radix.Client
var db *gorm.DB

func main() {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix

	port := os.Getenv("PORT")
	redisHost := os.Getenv("REDIS_HOST")
	redisPort := os.Getenv("REDIS_PORT")

	var err error
	pool, err = radix.NewPool("tcp", fmt.Sprintf("%v:%v", redisHost, redisPort), 10)
	if err != nil {
		log.Fatal().Err(err)
	}

	db, err = getDatabase()
	if err != nil {
		log.Fatal().Err(err)
	}

	// Create REST api with rate limiting
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/checkInfections", checkInfections)
	router.HandleFunc("/generateInfectionCode", generateInfectionCode)
	router.HandleFunc("/userAcceptedInfectionCode", userAcceptedInfectionCode)
	if err := http.ListenAndServe(fmt.Sprintf(":%v", port), router); err != nil {
		log.Fatal().Err(err)
	}
}

func cleanOldData() {
	// TODO: clean infection codes older than 2 days
}
