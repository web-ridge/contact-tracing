// THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.
package main

import (
	"context"
	"database/sql"
	"fmt"
	"math/rand"
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
		log.Debug().Msg("No encounters so returning OK=true")
		return &fm.InfectedEncounterCreatePayload{
			Ok: true,
		}, nil
	}

	// four random characters which are used to group infections later to filter out unique encounters
	// will not be tracable back to a specific person since it's not nearly unique enough for that :-D
	randomString := randSeq(4)

	sql, values := InfectedEncountersToQuery(boilerRows, randomString)
	fmt.Println(sql)
	fmt.Println(values)
	fmt.Println("LENGHT OF VALUES", len(values))
	//prepare the statement
	stmt, err := r.db.Prepare(sql)
	fmt.Println(stmt, err)
	if err != nil {
		log.Error().Err(err).Msg("could not prepare batch create query")
		return nil, fmt.Errorf("could not sync infected encounters")
	}

	if _, err := stmt.Exec(values...); err != nil {
		log.Error().Err(err).Msg("Could not insert infected encounters from database")
		return nil, fmt.Errorf("could not sync infected encounters")
	}
	log.Debug().Int("howManyEncounters", len(boilerRows)).Msg("Inserted encounters into database")
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
		dm.InfectedEncounterWhere.Time.LTE(int(now.Unix())),
		dm.InfectedEncounterWhere.Time.GTE(int(beginOfIncubationPeriod.Unix())),
	).All(ctx, r.db)

	if err != nil {
		log.Error().Err(err).Msg("Could not get infected encounters from database")
		return nil, fmt.Errorf("could not get summary from database")
	}

	return getRiskAlerts(infectedEncounters), nil
}

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

// randSeq does not need be to be really unique
func randSeq(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func (r *Resolver) Mutation() fm.MutationResolver { return &mutationResolver{r} }
func (r *Resolver) Query() fm.QueryResolver       { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
