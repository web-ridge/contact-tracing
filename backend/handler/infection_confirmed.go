package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/rs/zerolog/log"
)

// AcceptedInfectionCodeRequest contains the scanned code
type AcceptedInfectionCodeRequest struct {
	Hash string `json:"hash"`
}

func (h *Handler) UserConfirmedInfection(w http.ResponseWriter, r *http.Request) {
	var infectionRequest AcceptedInfectionCodeRequest
	err := json.NewDecoder(r.Body).Decode(&infectionRequest)
	if err != nil {
		log.Warn().Err(err).Msg("Could not parse accepted infection code request")
		WriteParseError(w)
		return
	}

	// set hash and let Redis remove infection after 14 days
	// https://redis.io/commands/expire
	if err := h.redisClient.Set(
		infectionRequest.Hash, // hashed Bluetooth ID
		time.Now().Unix(),     // when infection was created
		14*24*time.Hour,       // how many days this infection should be stored
	).Err(); err != nil {
		log.Error().Err(err).Msg("Could not insert infection")
		WriteParseError(w)
		return
	}
}
