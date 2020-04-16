// THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.
package main

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/rs/zerolog/log"
	fm "github.com/web-ridge/contact-tracing/backend/graphql_models"

	. "github.com/web-ridge/contact-tracing/backend/helpers"
	dm "github.com/web-ridge/contact-tracing/backend/models"
)

type Resolver struct {
	db *sql.DB
}

func (r *mutationResolver) CreateInfectedEncounters(ctx context.Context, input fm.InfectedEncountersCreateInput) (*fm.InfectedEncounterCreatePayload, error) {
	boilerRows := InfectedEncounterCreateInputsToBoiler(input.InfectedEncounters)
	if len(boilerRows) == 0 {
		return &fm.InfectedEncounterCreatePayload{
			Ok: true,
		}, nil
	}

	sql, values := InfectedEncountersToQuery(boilerRows)
	if _, err := r.db.Exec(sql, values...); err != nil {
		log.Error().Err(err).Msg("Could not insert infected encounters from database")
		return nil, fmt.Errorf("could not sync infected encounters")
	}

	return &fm.InfectedEncounterCreatePayload{
		Ok: true,
	}, nil
}

func (r *queryResolver) InfectedEncounters(ctx context.Context, hash string) ([]*fm.InfectionAlert, error) {

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
		log.Error().Err(err).Msg("Could not get infected encounters from database")
		return nil, fmt.Errorf("could not get summary from database")
	}

	return getRiskAlerts(infectedEncounters), nil
}

func (r *Resolver) Mutation() fm.MutationResolver { return &mutationResolver{r} }
func (r *Resolver) Query() fm.QueryResolver       { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
