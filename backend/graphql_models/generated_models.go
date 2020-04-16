// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package graphql_models

import (
	"fmt"
	"io"
	"strconv"
)

type InfectedEncounterCreateInput struct {
	StartOfCreatorHash   string `json:"startOfCreatorHash"`
	PossibleInfectedHash string `json:"possibleInfectedHash"`
	Rssi                 int    `json:"rssi"`
	Hits                 int    `json:"hits"`
	Time                 int    `json:"time"`
}

type InfectedEncounterCreatePayload struct {
	Ok bool `json:"ok"`
}

type InfectedEncountersCreateInput struct {
	InfectedEncounters []*InfectedEncounterCreateInput `json:"infectedEncounters"`
}

type InfectionAlert struct {
	HowManyEncounters int  `json:"howManyEncounters"`
	Risk              Risk `json:"risk"`
}

type Risk string

const (
	RiskHighRisk   Risk = "HIGH_RISK"
	RiskMiddleRisk Risk = "MIDDLE_RISK"
	RiskLowRisk    Risk = "LOW_RISK"
)

var AllRisk = []Risk{
	RiskHighRisk,
	RiskMiddleRisk,
	RiskLowRisk,
}

func (e Risk) IsValid() bool {
	switch e {
	case RiskHighRisk, RiskMiddleRisk, RiskLowRisk:
		return true
	}
	return false
}

func (e Risk) String() string {
	return string(e)
}

func (e *Risk) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = Risk(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid Risk", str)
	}
	return nil
}

func (e Risk) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
