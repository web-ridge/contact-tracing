// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package helpers

import (
	"github.com/web-ridge/contact-tracing/backend/graphql_models"
	"github.com/web-ridge/contact-tracing/backend/models"
)

func InfectedEncounterCreateInputsToBoiler(am []*graphql_models.InfectedEncounterCreateInput) []*models.InfectedEncounter {
	ar := make([]*models.InfectedEncounter, len(am))
	for i, m := range am {
		ar[i] = InfectedEncounterCreateInputToBoiler(
			m,
		)
	}
	return ar
}

func InfectedEncounterCreateInputToBoiler(
	m *graphql_models.InfectedEncounterCreateInput,
) *models.InfectedEncounter {
	if m == nil {
		return nil
	}
	r := &models.InfectedEncounter{
		PossibleInfectedHash: m.PossibleInfectedHash,
		Rssi:                 m.Rssi,
		Hits:                 m.Hits,
		Time:                 m.Time,
	}
	return r
}
