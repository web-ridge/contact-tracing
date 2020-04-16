// THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.
package main

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/rs/zerolog/log"
	fm "github.com/web-ridge/contact-tracing/backend/graphql_models"

	// . "github.com/web-ridge/contact-tracing/backend/helpers"
	dm "github.com/web-ridge/contact-tracing/backend/models"
)

type Resolver struct {
	db *sql.DB
}

const inputKey = "input"

func (r *mutationResolver) CreateInfectedEncounters(ctx context.Context, input fm.InfectedEncountersCreateInput) (*fm.InfectedEncounterCreatePayload, error) {

	// batch create in database
	// INSERT INTO films (code, title, did, date_prod, kind) VALUES
	// ('B6717', 'Tampopo', 110, '1985-02-10', 'Comedy'),
	// ('HG120', 'The Dinner Game', 140, DEFAULT, 'Comedy');

	return &fm.InfectedEncounterCreatePayload{
		Ok: true,
	}, nil
}

func (r *queryResolver) InfectedEncounters(ctx context.Context, hash string) (*fm.InfectionSummary, error) {

	//  1-14 days, most commonly around five days.
	now := time.Now()
	beginOfIncubationPeriod := now.AddDate(0, 0, -14)

	// get infected encounters for this hash in incubation period
	infectedEncounters, err := dm.InfectedEncounters(
		dm.InfectedEncounterWhere.PossibleInfectedHash.EQ(hash),
		dm.InfectedEncounterWhere.Time.LTE(now),
		dm.InfectedEncounterWhere.Time.GTE(beginOfIncubationPeriod),
	).All(ctx, r.db)

	if err != nil {
		log.Error().Err(err).Msg("could not get infected encounters from database")
		return nil, fmt.Errorf("could not get summary from database")
	}

	groupedEncountersPerHash := groupInfectedEncounterOnFirstPartOfHash(infectedEncounters)

	highRiskInteractions := 0
	middleRiskInteractions := 0
	lowRiskInteractions := 0

	for _, value := range groupedEncountersPerHash {
		risk := getRisk(value)
		if risk > 10 {
			highRiskInteractions++
		} else if risk > 5 {
			middleRiskInteractions++
		} else {
			lowRiskInteractions++
		}
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
