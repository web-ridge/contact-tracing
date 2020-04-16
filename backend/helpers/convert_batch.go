package helpers

import (
	"fmt"
	"strings"

	"github.com/web-ridge/contact-tracing/backend/models"
)

func columnsAsQuestionMarks(columns []string) []string {
	params := make([]string, len(columns))
	for i := range columns {
		params[i] = "?"
	}
	return params
}

func getRowMarks(columns []string) string {
	return fmt.Sprintf("(%v)", strings.Join(columnsAsQuestionMarks(columns), ","))
}

var InfectedEncountersBatchCreateColumns = []string{
	models.InfectedEncounterColumns.StartOfCreatorHash,
	models.InfectedEncounterColumns.PossibleInfectedHash,
	models.InfectedEncounterColumns.Rssi,
	models.InfectedEncounterColumns.Hits,
	models.InfectedEncounterColumns.Time,
}

var InfectedEncountersatchCreateColumnsMarks = getRowMarks(InfectedEncountersBatchCreateColumns)

func InfectedEncounterToBatchCreateValues(e *models.InfectedEncounter) []interface{} {
	return []interface{}{
		e.StartOfCreatorHash,
		e.PossibleInfectedHash,
		e.Rssi,
		e.Hits,
		e.Time,
	}
}

func InfectedEncountersToBatchCreate(a []*models.InfectedEncounter) ([]string, []interface{}) {
	queryMarks := make([]string, len(a))
	values := []interface{}{}
	for i, boilerRow := range a {
		queryMarks[i] = InfectedEncountersatchCreateColumnsMarks
		values = append(values, InfectedEncounterToBatchCreateValues(boilerRow)...)
	}
	return queryMarks, values
}

func InfectedEncountersToQuery(a []*models.InfectedEncounter) (string, []interface{}) {
	queryMarks, values := InfectedEncountersToBatchCreate(a)
	// nolint: gosec -> remove warning because no user input
	return fmt.Sprintf(`INSERT INTO %s (%s) VALUES %s`,
		models.TableNames.InfectedEncounter,
		strings.Join(InfectedEncountersBatchCreateColumns, ","),
		strings.Join(queryMarks, ","),
	), values
}
