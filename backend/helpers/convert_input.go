// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package helpers

import (
	"github.com/volatiletech/sqlboiler/boil"
	"github.com/web-ridge/contact-tracing/backend/graphql_models"
	"github.com/web-ridge/contact-tracing/backend/models"
	"github.com/web-ridge/gqlgen-sqlboiler/helper"
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
		StartOfCreatorHash:   helper.PointerStringToNullDotString(m.StartOfCreatorHash),
		PossibleInfectedHash: helper.PointerStringToNullDotString(m.PossibleInfectedHash),
		Rssi:                 helper.PointerIntToNullDotInt(m.Rssi),
		Hits:                 helper.PointerIntToNullDotInt(m.Hits),
		Time:                 helper.PointerIntToNullDotTime(m.Time),
	}
	return r
}

func InfectedEncounterCreateInputToModelM(
	input map[string]interface{},
	m graphql_models.InfectedEncounterCreateInput,
) models.M {
	modelM := models.M{}
	for key, _ := range input {
		switch key {
		case "startOfCreatorHash":
			modelM[models.InfectedEncounterColumns.StartOfCreatorHash] = helper.PointerStringToNullDotString(m.StartOfCreatorHash)
		case "possibleInfectedHash":
			modelM[models.InfectedEncounterColumns.PossibleInfectedHash] = helper.PointerStringToNullDotString(m.PossibleInfectedHash)
		case "rssi":
			modelM[models.InfectedEncounterColumns.Rssi] = helper.PointerIntToNullDotInt(m.Rssi)
		case "hits":
			modelM[models.InfectedEncounterColumns.Hits] = helper.PointerIntToNullDotInt(m.Hits)
		case "time":
			modelM[models.InfectedEncounterColumns.Time] = helper.PointerIntToNullDotTime(m.Time)
		}
	}
	return modelM
}

func InfectedEncounterCreateInputToBoilerWhitelist(input map[string]interface{}, extraColumns ...string) boil.Columns {
	columnsWhichAreSet := []string{}
	for key, _ := range input {
		switch key {
		case "startOfCreatorHash":
			columnsWhichAreSet = append(columnsWhichAreSet, models.InfectedEncounterColumns.StartOfCreatorHash)
		case "possibleInfectedHash":
			columnsWhichAreSet = append(columnsWhichAreSet, models.InfectedEncounterColumns.PossibleInfectedHash)
		case "rssi":
			columnsWhichAreSet = append(columnsWhichAreSet, models.InfectedEncounterColumns.Rssi)
		case "hits":
			columnsWhichAreSet = append(columnsWhichAreSet, models.InfectedEncounterColumns.Hits)
		case "time":
			columnsWhichAreSet = append(columnsWhichAreSet, models.InfectedEncounterColumns.Time)
		}
	}
	columnsWhichAreSet = append(columnsWhichAreSet, extraColumns...)
	return boil.Whitelist(columnsWhichAreSet...)
}
