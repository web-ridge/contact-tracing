package handler

import (
	"encoding/json"
	"net/http"
)

type CheckInfectionsRequest struct {
	Hashes []string `json:"hashes"`
}
type CheckInfectionsResponse struct {
	Confirmed []string `json:"confirmed"`
}

func (h *Handler) CheckInfections(w http.ResponseWriter, r *http.Request) {
	var checkInfectionRequest CheckInfectionsRequest
	err := json.NewDecoder(r.Body).Decode(&checkInfectionRequest)
	if err != nil {
		WriteParseError(w)
		return
	}

	// Let's request all hashes
	var values []string
	if err := h.redisClient.MGet(checkInfectionRequest.Hashes...).Err(); err != nil {
		WriteGlobalError(w)
		return
	}

	WriteJSON(w, &CheckInfectionsResponse{
		Confirmed: withoutEmptyStrings(values),
	})
}

func withoutEmptyStrings(a []string) []string {
	var filledSlice []string
	for _, s := range a {
		if s != "" {
			filledSlice = append(filledSlice, s)
		}
	}
	return filledSlice
}