// THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.
package main

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/rs/zerolog/log"
	fm "github.com/web-ridge/contact-tracing/backend/graphql_models"
	. "github.com/web-ridge/contact-tracing/backend/helpers"
	dm "github.com/web-ridge/contact-tracing/backend/models"
)

type Resolver struct {
	db *sql.DB
}

const inputKey = "input"

func (r *mutationResolver) CreateInfectedEncounters(ctx context.Context, input fm.InfectedEncountersCreateInput) (*fm.InfectedEncounterCreatePayload, error) {

	// batch create in database

	return &fm.InfectedEncounterCreatePayload{
		Ok: true,
	}, nil
}

// groupInfectedEncounterOnFirstPartOfHash so we know how many interactions with this hash
// not the full hash because we don't want it to be tracable
func groupInfectedEncounterOnFirstPartOfHash(infectedEncounters []*dm.InfectedEncounter) map[string]*dm.InfectedEncounter {
	m := make(map[string][]*dm.InfectedEncounter)
	for _, infectedEncounter := range infectedEncounters {
		key := infectedEncounter.StartOfCreatorHash.String
		groupedValue, valueExist := m[key]
		if valueExist {
			m[key] = append(groupedValue, infectedEncounter)
		} else {
			m[key] = []*dm.InfectedEncounter{infectedEncounter}
		}
	}
	return m
}



// getRiskPercentage returns int based on encounters with maximum risk
func getRisk(infectedEncounters []*dm.InfectedEncounter) (int) {

	risk := 0

	
	for _, encounter := range infectedEncounters {
		if !encounter.Rssi.Valid {
			continue
		} 

		// not so many hits probably not good enough
		if encounter.Hits.Int < 5 {
			continue
		}

		if encounter.Rssi.Int > -65 {
			risk += 4
		} else if  encounter.Rssi.Int > -70 {
			if encounter.Hits.Int > 50 {
				risk += 2
			} else {
				risk += 1
			}
		}
	}

	return risk
}

func (r *queryResolver) InfectedEncounters(ctx context.Context, hash string) (*fm.InfectionSummary, error) {
	// TODO get encounters for hash
	// time.now()
	// time.now - incubation period
	// make infection summary

	infectedEncounters, err := dm.InfectedEncounters(
	// TODO check with time and incubation period
	// dm.InfectedEncounterWhere.Time.LTE()
	// dm.InfectedEncounterWhere.Time.GTE()
	).All(ctx, r.db)
	if err != nil {
		log.Error().Err(err).Msg("could not open database connection")
		return nil, fmt.Errorf("could not get summary from database")
	}



	groupedEncounters := groupInfectedEncounterOnFirstPartOfHash(infectedEncounters)
	
	highRiskInteractions := 0
	middleRiskInteractions := 0
	lowRiskInteractions := 0

	for _, groupedEncounters := groupedEncountersPerHash {
		getRisk(groupedEncounters)
		// TODO, TODO
	}

	// GroupBy first part of hash

	return &fm.InfectionSummary{
		HighRiskInteractions:   highRiskInteractions,
		MiddleRiskInteractions: middleRiskInteractions,
		LowRiskInteractions:    lowRiskInteractions,
		MaxSymptonDate:         nil,
		MinSymptonDate:         nil,
	}, nil
}

func (r *Resolver) Mutation() fm.MutationResolver { return &mutationResolver{r} }
func (r *Resolver) Query() fm.QueryResolver       { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
