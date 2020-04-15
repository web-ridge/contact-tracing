// THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.
package main

import (
	"database/sql"

	fm "github.com/web-ridge/contact-tracing/backend/graphql_models"
	. "github.com/web-ridge/contact-tracing/backend/helpers"
)

type Resolver struct {
	db *sql.DB
}

const inputKey = "input"

func (r *Resolver) Mutation() fm.MutationResolver { return &mutationResolver{r} }
func (r *Resolver) Query() fm.QueryResolver       { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
