package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/mediocregopher/radix/v3"
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

	pool, err := radix.NewPool("tcp", fmt.Sprintf("%v:%v", redisHost, redisPort), 10)
	if err != nil {
		log.Fatal().Err(err)
	}

	db, err := database.GetDatabase()
	if err != nil {
		log.Fatal().Err(err)
	}

	handler := handler.NewHandler(db, pool)

	// Create REST api for telephone user
	r := mux.NewRouter().StrictSlash(true)
	r.HandleFunc("/checkInfections", handler.CheckInfections).Methods(http.MethodPost)
	r.HandleFunc("/userAcceptedInfectionCode", handler.UserAcceptedInfectionCode).Methods(http.MethodPost)

	// Create authorized route
	s := r.PathPrefix("/authorized").Subrouter()
	s.Use(AuthMiddleware(db))
	s.HandleFunc("/generateInfectionCode", handler.GenerateInfectionCode).Methods(http.MethodPost)

	// manage users of infection organizations
	s.HandleFunc("/user", handler.UserList).Methods(http.MethodGet)
	s.HandleFunc("/user", handler.UserCreate).Methods(http.MethodPost)
	s.HandleFunc("/user/{id}", handler.UserFind).Methods(http.MethodGet)
	s.HandleFunc("/user/{id}", handler.UserDelete).Methods(http.MethodDelete)

	// manage infection organisation
	s.HandleFunc("/organisation", handler.CompanyList).Methods(http.MethodGet)
	s.HandleFunc("/organisation", handler.CompanyCreate).Methods(http.MethodPost)
	s.HandleFunc("/organisation/{id}", handler.CompanyFind).Methods(http.MethodGet)
	s.HandleFunc("/organisation/{id}", handler.CompanyDelete).Methods(http.MethodDelete)

	if err := http.ListenAndServe(fmt.Sprintf(":%v", port), r); err != nil {
		log.Fatal().Err(err)
	}
}

func cleanOldData() {
	// TODO: clean infection codes older than 2 days
}
