package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	tb "github.com/didip/tollbooth"
	tbc "github.com/didip/tollbooth_chi"
	"github.com/go-chi/chi"
	_ "github.com/joho/godotenv/autoload"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/volatiletech/sqlboiler/boil"
	_ "github.com/volatiletech/sqlboiler/drivers"
	_ "github.com/volatiletech/sqlboiler/drivers/sqlboiler-psql/driver"
	"github.com/web-ridge/contact-tracing/backend/graphql_models"
	"github.com/web-ridge/gqlgen-sqlboiler/examples/social-network/auth"
	"github.com/web-ridge/utils-go/api"
)

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

func initDb() *sql.DB {
	// Start database connection
	connStr := fmt.Sprintf(`host=%v port=%v user=%v dbname=%v password=%v sslmode=%v`,
		os.Getenv("DATABASE_HOST"),
		os.Getenv("DATABASE_PORT"),
		os.Getenv("DATABASE_USER"),
		os.Getenv("DATABASE_NAME"),
		os.Getenv("DATABASE_PASSWORD"),
		os.Getenv("DATABASE_SSL_MODE"),
	)

	if os.Getenv("DATABASE_DEBUG") == "true" {
		boil.DebugMode = true
	}

	// Open handle to database like normal
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal().Err(err).Msg("could not open database connection")
	}
	// https://www.alexedwards.net/blog/configuring-sqldb
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err = db.Ping(); err != nil {
		log.Fatal().Err(err).Msg("no real database connection")
	}
	return db
}

func main() {

	initLogger()
	db := initDb()

	port := os.Getenv("PORT")

	// Create a limiter
	lmt := tb.NewLimiter(100, nil)
	lmt.SetOnLimitReached(api.HandleRateLimiting)

	//NEW

	srv := handler.New(graphql_models.NewExecutableSchema(graphql_models.Config{
		Resolvers: &Resolver{
			db: db,
		},
	}))
	srv.Use(extension.Introspection{})
	// srv.AddTransport(transport.Websocket{
	// 	KeepAlivePingInterval: 10 * time.Second,
	// })
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
	// srv.AddTransport(transport.MultipartForm{})

	r := chi.NewRouter()
	r.Use(tbc.LimitHandler(lmt))
	r.Use(auth.Middleware(db))
	// r.Handle("/", playground.Handler("GraphQL playground", "/graphql"))

	r.Handle("/graphql", srv)

	log.Info().Str("host", "localhost").Str("port", port).Msg("Connect GraphQL playground")
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal().Err(err).Str("Could not listen to port", port).Send()
	}
}
