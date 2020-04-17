package main

import (
	"context"
	"database/sql"
	"net/http"
	"os"
	"time"

	dm "github.com/web-ridge/contact-tracing/backend/models"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	tb "github.com/didip/tollbooth"
	tbc "github.com/didip/tollbooth_chi"
	"github.com/go-chi/chi"
	"github.com/go-co-op/gocron"
	_ "github.com/joho/godotenv/autoload"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	_ "github.com/volatiletech/sqlboiler/drivers"
	_ "github.com/volatiletech/sqlboiler/drivers/sqlboiler-psql/driver"
	"github.com/web-ridge/contact-tracing/backend/graphql_models"
	"github.com/web-ridge/gqlgen-sqlboiler/examples/social-network/auth"
	"github.com/web-ridge/utils-go/api"
)

var port = os.Getenv("PORT")

func main() {
	// create fast logging
	initLogger()

	// create re-usable database object
	db := getDatabase()

	// create a cron-job to remove old data
	scheduler := gocron.NewScheduler(time.UTC)
	scheduler.Every(6).Hours().Do(removeOldData, db)
	scheduler.StartAsync() // scheduler starts running jobs and current thread continues to execute

	// Create a limiter to prevent DDOS'ing
	lmt := tb.NewLimiter(100, nil)
	lmt.SetOnLimitReached(api.HandleRateLimiting)
	srv := handler.New(graphql_models.NewExecutableSchema(graphql_models.Config{
		Resolvers: &Resolver{
			db: db,
		},
	}))
	srv.Use(extension.Introspection{})
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	r := chi.NewRouter()
	r.Use(tbc.LimitHandler(lmt))
	r.Use(auth.Middleware(db))
	r.Handle("/graphql", srv)

	log.Info().Str("host", "localhost").Str("port", port).Msg("Contact Tracing API started!")
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal().Err(err).Str("Could not listen to port", port).Send()
	}
}

// removeOldData executes a delete query to remove data which is not needed anymore for the purpose of the contact
// tracing app
func removeOldData(db *sql.DB) {
	//  1-14 days
	beginOfIncubationPeriod := time.Now().AddDate(0, 0, -14)

	// get infected encounters for this hash in incubation period
	_, err := dm.InfectedEncounters(
		dm.InfectedEncounterWhere.Time.LT(int(beginOfIncubationPeriod.Unix())),
	).DeleteAll(context.Background(), db)
	if err != nil {
		// TODO: send mail to AVG person in webRidge // os.Getenv("EMAIL")
		log.Error().Err(err).Msg("issue with removing data")
	}
}

func initLogger() {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	level, levelError := zerolog.ParseLevel(os.Getenv("LOG_LEVEL"))
	if levelError != nil {
		// Default level for this example is info, unless debug flag is present
		zerolog.SetGlobalLevel(zerolog.InfoLevel)
	} else {
		zerolog.SetGlobalLevel(level)
	}
}
