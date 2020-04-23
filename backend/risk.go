// WebRidge Design
// Need someone with expertise in incubation period and chance of infections
// to make risk calculation better
// Hit me on GitHub, LinkedIn, etc.
// Maybe we could also ask the user if he had a lot of coughing in the period before
// That way we can ++ the risk of users in the neightborhood

package main

import (
	fm "github.com/web-ridge/contact-tracing/backend/graphql_models"
	dm "github.com/web-ridge/contact-tracing/backend/models"
)

const (
	highRisk   = iota
	middleRisk = iota
	lowRisk    = iota
	noRisk     = iota
)

// https://www.researchgate.net/figure/Bluetooth-signal-strength-RSSI-as-a-function-of-distance-A-Scans-between-two-phones_fig2_263708916
// getRiskPercentageOfEncounter returns percentage of risk of encounter
const FirstMeterRSSI = -65
const SecondMeterRSSI = -75
const ThirdMeterRSSI = -85

func getRiskOfEncounter(encounter *dm.InfectedEncounter) int {

	// how many times the RSSI value changed
	signalChanges := encounter.Hits

	// TODO do something with duration

	// between 0 and 1 m
	if encounter.Rssi > FirstMeterRSSI {
		return highRisk
	} else if encounter.Rssi > SecondMeterRSSI {
		// between 1 and 2 m
		if signalChanges > 10 {
			return middleRisk
		}
		return lowRisk
	} else if encounter.Rssi > ThirdMeterRSSI {
		// between 2 and 3 m
		if signalChanges > 20 {
			return middleRisk
		}
		return lowRisk
	}
	return noRisk
}

// getRiskPercentage returns int based on encounters with maximum risk
func getRiskOfEncounters(encounters []*dm.InfectedEncounter) int {

	howManyLowRiskInteractions := 0
	howManyMiddleRiskInteractions := 0
	howManyHighRiskInteractions := 0

	for _, encounter := range encounters {
		risk := getRiskOfEncounter(encounter)
		if risk == lowRisk {
			howManyLowRiskInteractions++
		}
		if risk == middleRisk {
			howManyMiddleRiskInteractions++
		}
		if risk == highRisk {
			howManyHighRiskInteractions++
		}
	}

	if howManyHighRiskInteractions > 0 {
		return highRisk
	}
	if howManyMiddleRiskInteractions > 0 {
		if howManyMiddleRiskInteractions > 2 {
			return highRisk
		}
		return middleRisk
	}
	if howManyLowRiskInteractions > 0 {
		if howManyLowRiskInteractions > 5 {
			return highRisk
		}
		if howManyLowRiskInteractions > 3 {
			return middleRisk
		}
		return lowRisk
	}
	return noRisk
}

// getDurationOfEncounters returns total duration in seconds
func getDurationOfEncounters(encounters []*dm.InfectedEncounter) int {
	var duration int
	for _, encounter := range encounters {
		duration += encounter.Duration
	}
	return duration
}

// groupInfectedEncounterOnRandomPart so we know how many different encounters probably from 1 device
func groupInfectedEncounterOnRandomPart(infectedEncounters []*dm.InfectedEncounter) map[string][]*dm.InfectedEncounter {
	m := make(map[string][]*dm.InfectedEncounter)
	for _, infectedEncounter := range infectedEncounters {
		hash := infectedEncounter.RandomPart
		groupedValue, valueExist := m[hash]
		if valueExist {
			m[hash] = append(groupedValue, infectedEncounter)
		} else {
			m[hash] = []*dm.InfectedEncounter{infectedEncounter}
		}
	}
	return m
}

func getRiskAlerts(infectedEncounters []*dm.InfectedEncounter) []*fm.InfectionAlert {
	encounterPerSickPerson := groupInfectedEncounterOnRandomPart(infectedEncounters)

	alerts := []*fm.InfectionAlert{}
	for _, value := range encounterPerSickPerson {
		risk := getRiskOfEncounters(value)
		if risk == noRisk {
			continue
		}

		totalDuration := getDurationOfEncounters(value)

		// 2 minutes
		if totalDuration > 60*2 {
			alerts = append(alerts, &fm.InfectionAlert{
				HowManyEncounters: len(value),
				Risk:              riskToGraphql(risk),
			})
		}
	}
	return alerts
}

func riskToGraphql(risk int) fm.Risk {
	if risk == highRisk {
		return fm.RiskHighRisk
	}
	if risk == middleRisk {
		return fm.RiskMiddleRisk
	}
	if risk == lowRisk {
		return fm.RiskLowRisk
	}
	// will be filtered out and not shown
	return fm.RiskLowRisk
}
