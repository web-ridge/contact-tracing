package helpers

import (
	"fmt"
	"strings"

	"github.com/web-ridge/contact-tracing/backend/models"
)

var InfectedEncountersBatchCreateColumns = []string{
	models.InfectedEncounterColumns.RandomPart,
	models.InfectedEncounterColumns.PossibleInfectedHash,
	models.InfectedEncounterColumns.Rssi,
	models.InfectedEncounterColumns.Hits,
	models.InfectedEncounterColumns.Time,
}

var InfectedEncountersatchCreateColumnsMarks = "('?', '?', '?', '?', '?')"

func InfectedEncounterToBatchCreateValues(e *models.InfectedEncounter, randomString string) []interface{} {
	return []interface{}{
		randomString,
		strings.TrimSpace(e.PossibleInfectedHash),
		e.Rssi,
		e.Hits,
		e.Time,
	}
}

func InfectedEncountersToBatchCreate(a []*models.InfectedEncounter, randomString string) ([]string, []interface{}) {
	queryMarks := make([]string, len(a))
	values := []interface{}{}
	for i, boilerRow := range a {
		queryMarks[i] = InfectedEncountersatchCreateColumnsMarks
		values = append(values, InfectedEncounterToBatchCreateValues(boilerRow, randomString)...)
	}
	return queryMarks, values
}

func InfectedEncountersToQuery(a []*models.InfectedEncounter, randomString string) (string, []interface{}) {
	queryMarks, values := InfectedEncountersToBatchCreate(a, randomString)
	// nolint: gosec -> remove warning because no user input without questions marks
	return fmt.Sprintf(`INSERT INTO "%s" (%s) VALUES %s`,
		models.TableNames.InfectedEncounter,
		strings.Join(InfectedEncountersBatchCreateColumns, ", "),
		strings.Join(queryMarks, ", "),
	), values
}
