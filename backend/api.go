package main

import (
	"encoding/json"
	"net/http"
)

const GLOBAL_ERROR_MESSAGE = "something went wrong"
const GLOBAL_ERROR_CODE = http.StatusInternalServerError
const GLOBAL_ERROR_INTERNAL_CODE = "GLOBAL_ERROR"

const PARSE_ERROR_MESSAGE = "could not parse request"
const PARSE_ERROR_CODE = http.StatusBadRequest
const PARSE_ERROR_INTERNAL_CODE = "PARSE_ERROR"

const RATE_LIMIT_MESSAGE = "rate limit exceeded"
const RATE_LIMIT_ERROR_CODE = http.StatusTooManyRequests
const RATE_LIMIT_INTERNAL_CODE = "LIMIT_EXCEEDED"

const HASH_DIFFERENCE_MESSAGE = "this hash is not confirmed as infection by an offical institute"
const HASH_DIFFERENCE_ERROR_CODE = http.StatusNotAcceptable
const HASH_DIFFERENCE_INTERNAL_CODE = "HASH_DIFFERENCE"

//Error a struct to return on error
type Error struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

//Message a struct to return on error
type Message struct {
	Code    int32  `json:"code"`
	Message string `json:"message"`
}

func WriteJSON(w http.ResponseWriter, rsp interface{}) {
	w.Header().Set("Content-Type", "application/json")
	response, err := json.Marshal(rsp)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte(`{"code": 500, "message": "Could not write response"}`))
		return
	}
	w.WriteHeader(200)
	w.Write(response)
}

func WriteJSONWithStatus(w http.ResponseWriter, rsp interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	response, err := json.Marshal(rsp)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte(`{"code": 500, "message": "Could not write response"}`))
		return
	}
	w.WriteHeader(statusCode)
	w.Write(response)
}

// WriteOK writes the given interface as JSON to the given writer
func WriteOK(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write([]byte(`{"ok":true}`))
}

// WriteJSONError writes the given error as JSON to the given writer
func WriteJSONError(w http.ResponseWriter, message string, internalCode string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	response, err := json.Marshal(Error{
		Code:    internalCode,
		Message: message,
	})
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte(`{"code": 500, "message": "Could not write response"}`))
		return
	}
	w.WriteHeader(statusCode)
	w.Write(response)
}

func WriteParseError(w http.ResponseWriter) {
	WriteJSONError(w, PARSE_ERROR_MESSAGE, PARSE_ERROR_INTERNAL_CODE, PARSE_ERROR_CODE)
}
func WriteGlobalError(w http.ResponseWriter) {
	WriteJSONError(w, GLOBAL_ERROR_MESSAGE, GLOBAL_ERROR_INTERNAL_CODE, GLOBAL_ERROR_CODE)
}
func WriteHashDifferenceError(w http.ResponseWriter) {
	WriteJSONError(w, HASH_DIFFERENCE_MESSAGE, HASH_DIFFERENCE_INTERNAL_CODE, HASH_DIFFERENCE_ERROR_CODE)
}

// WriteJSONError writes the given error as JSON to the given writer
func HandleRateLimiting(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	response, err := json.Marshal(Error{
		Code:    RATE_LIMIT_INTERNAL_CODE,
		Message: RATE_LIMIT_MESSAGE,
	})
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte(`{"code": 500, "message": "Could not write response"}`))
		return
	}
	w.WriteHeader(RATE_LIMIT_ERROR_CODE)
	w.Write(response)
}
