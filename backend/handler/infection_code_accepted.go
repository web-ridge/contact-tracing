package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/mediocregopher/radix/v3"
	"github.com/rs/zerolog/log"
	"github.com/web-ridge/contact-tracing/backend/database"
)

// AcceptedInfectionCodeRequest contains the scanned code
type AcceptedInfectionCodeRequest struct {
	Code string `json:"code"`
	Hash string `json:"hash"`
}

func (h *Handler) UserAcceptedInfectionCode(w http.ResponseWriter, r *http.Request) {

	var infectionRequest AcceptedInfectionCodeRequest
	err := json.NewDecoder(r.Body).Decode(&infectionRequest)
	if err != nil {
		log.Warn().Err(err).Msg("Could not parse accepted infection code request")
		WriteParseError(w)
		return
	}

	if len(infectionRequest.Code) < 10 {
		log.Warn().Err(err).Msg("Code is shorter than 10 characters")
		WriteParseError(w)
		return
	}

	// check if hash exist in database
	var databaseInfectionCode database.InfectionCode
	if err := h.db.Model(&database.InfectionCode{}).Where(&database.InfectionCode{
		Code: infectionRequest.Code,
	}).First(&databaseInfectionCode).Error; err != nil {
		log.Warn().Err(err).Msg("Some tried to add an infection with the wrong code")
		WriteGlobalError(w)
		return
	}

	// check if the hash the company has selected is the same as the user sends
	if databaseInfectionCode.Hash != infectionRequest.Hash {
		log.Warn().Err(err).Msg("Someone tried to add in infection with the wrong hash")
		WriteHashDifferenceError(w)
		return
	}

	// infection date
	infectionUnix := time.Now().Unix()

	// set hash and let Redis remove infection after 14 days
	// https://redis.io/commands/expire
	if err := h.pool.Do(
		radix.Cmd(nil, "SETEX",
			databaseInfectionCode.Hash,         // hashed Bluetooth ID
			strconv.Itoa(int(14*24*time.Hour)), // how many days this infection should be stored
			strconv.Itoa(int(infectionUnix)),   // value: timestamp of infection
		),
	); err != nil {
		log.Error().Err(err).Msg("Could not insert infection")
		WriteParseError(w)
		return
	}
}
