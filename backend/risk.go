package main

import (
	dm "github.com/web-ridge/contact-tracing/backend/models"
)

const (
	highRisk   = iota
	middleRisk = iota
	lowRisk    = iota
)

// groupInfectedEncounterOnFirstPartOfHash so we know how many different encounters with this hash
func groupInfectedEncounterOnFirstPartOfHash(infectedEncounters []*dm.InfectedEncounter) map[string][]*dm.InfectedEncounter {
	m := make(map[string][]*dm.InfectedEncounter)
	for _, infectedEncounter := range infectedEncounters {
		hash := infectedEncounter.StartOfCreatorHash
		groupedValue, valueExist := m[hash]
		if valueExist {
			m[hash] = append(groupedValue, infectedEncounter)
		} else {
			m[hash] = []*dm.InfectedEncounter{infectedEncounter}
		}
	}
	return m
}

func getRiskPercentageOfEncounter(encounter *dm.InfectedEncounter) int {

}

// getRiskPercentage returns int based on encounters with maximum risk
func getRisk(encounters []*dm.InfectedEncounter) int {

	risk := 0

	for _, encounter := range encounters {

		// not so many hits probably not good enough
		if encounter.Hits < 5 {
			continue
		}

		if encounter.Rssi > -65 {
			risk += 4
		} else if encounter.Rssi > -70 {
			if encounter.Hits > 50 {
				risk += 2
			} else {
				risk += 1
			}
		}
	}

	return risk
}
