// THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.
package main

import (
	"context"
	"database/sql"

	fm "github.com/web-ridge/contact-tracing/backend/graphql_models"
	. "github.com/web-ridge/contact-tracing/backend/helpers"
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

func (r *queryResolver) InfectedEncounters(ctx context.Context, hash string) (*fm.InfectionSummary, error) {
	// TODO get encounters for hash
	// time.now()
	// time.now - incubation period
	// make infection summary

	return &fm.InfectionSummary{
		HighRiskInteractions:   0,
		MiddleRiskInteractions: 0,
		LowRiskInteractions:    0,
		MaxSymptonDate:         0,
		MinSymptonDate:         0,
	}, nil
}

func (r *Resolver) Mutation() fm.MutationResolver { return &mutationResolver{r} }
func (r *Resolver) Query() fm.QueryResolver       { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
