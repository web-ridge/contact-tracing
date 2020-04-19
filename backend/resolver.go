// THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.
package main

import (
	"context"
	"database/sql"
	"os"
	"sync"

	"github.com/rs/zerolog/log"
	"github.com/volatiletech/sqlboiler/boil"
	fm "github.com/web-ridge/contact-tracing/backend/graphql_models"

	. "github.com/web-ridge/contact-tracing/backend/helpers"
	dm "github.com/web-ridge/contact-tracing/backend/models"
)

type Resolver struct {
	db *sql.DB
}

// CreateInfectedEncounters persists shared contacts from Android devices
func (r *mutationResolver) CreateInfectedEncounters(ctx context.Context, input fm.InfectedEncountersCreateInput) (*fm.OkPayload, error) {

	if input.InfectionCreateKey != nil ||
		len(input.InfectionCreateKey.Key) < 25 ||
		len(input.InfectionCreateKey.Password) < 25 {
		log.Debug().Msg("infection create key not provided")
		return nil, publicCreateInfectedEncountersError
	}

	// verify user input with database
	databaseKey, err := dm.InfectionCreateKeys(
		dm.InfectionCreateKeyWhere.Key.EQ(input.InfectionCreateKey.Key),
		dm.InfectionCreateKeyWhere.Password.EQ(input.InfectionCreateKey.Password),
	).One(ctx, r.db)

	// if key could not be found + double check
	if err != nil ||
		databaseKey.Key != input.InfectionCreateKey.Key || // database check is enough, but double check
		databaseKey.Password != input.InfectionCreateKey.Password { // // database check is enough, but double check
		log.Error().Err(err).Msg("Could not insert infected encounters from database")
		return nil, publicCreateInfectedEncountersError
	}

	boilerRows := filterRowsOutsideRange(InfectedEncounterCreateInputsToBoiler(input.InfectedEncounters), databaseKey)
	if len(boilerRows) == 0 {
		log.Debug().Msg("No encounters so returning OK=true")
		return &fm.OkPayload{
			Ok: true,
		}, nil
	}

	// 2 random characters which are used to group infections later to filter out unique encounters
	// will not be tracable back to a specific person since it's not nearly unique enough for that :)
	randomString := randSeq(2)

	sql, values := InfectedEncountersToQuery(boilerRows, randomString)
	if _, err := r.db.Exec(sql, values...); err != nil {
		log.Error().Err(err).Msg("Could not insert infected encounters from database")
		return nil, publicCreateInfectedEncountersError
	}
	log.Debug().Int("howManyEncounters", len(boilerRows)).Msg("inserted encounters into database")
	return &fm.OkPayload{
		Ok: true,
	}, nil
}

// InfectedEncounters fetches the shared encounters of other users with my device key. Only the user will be able to fetch
// these since the others don't have the password which is in a local persisted database
// optionalExtraDeviceHashes is used to check infected device keys since iOS users won't be able to track in the background
// they can register their device as being infected (and remove it every time they want)
func (r *queryResolver) InfectedEncounters(ctx context.Context, deviceHashesOfMyOwn []*fm.DeviceKeyParam, optionalEncounters []*fm.EncounterInput) ([]*fm.InfectionAlert, error) {

	// if no device hashes are sent, return empty request
	if len(deviceHashesOfMyOwn) == 0 {
		return []*fm.InfectionAlert{}, nil
	}

	// get secure keys from database so we can check if they are the same as sent ones
	var realSecureKeys dm.DeviceKeySlice
	var realSecureKeysError error

	// get infected encounters for this hash in incubation period
	var infectedEncounters dm.InfectedEncounterSlice
	var infectedEncountersError error

	// get infected device keys so Android users can be alerted
	var infectedDeviceKeys dm.DeviceKeySlice
	var infectedDeviceKeyError error

	var wg sync.WaitGroup

	wg.Add(1)
	go func() {
		defer wg.Done()
		realSecureKeys, realSecureKeysError = dm.DeviceKeys(
			dm.DeviceKeyWhere.Hash.IN(
				getDeviceKeysFromParams(deviceHashesOfMyOwn),
			),
		).All(ctx, r.db)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		infectedEncounters, infectedEncountersError = dm.InfectedEncounters(
			dm.InfectedEncounterWhere.PossibleInfectedHash.IN(
				getDeviceKeysFromParams(deviceHashesOfMyOwn),
			),
			dm.InfectedEncounterWhere.Time.GTE(getIncubationStartTimeUnix()),
		).All(ctx, r.db)
	}()

	// only used if user has opt-in for alerts on iOS devices
	// the status of iOS infected could be publicily fetched if someone knew their character id
	if len(optionalEncounters) > 0 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			infectedDeviceKeys, infectedDeviceKeyError = dm.DeviceKeys(
				dm.DeviceKeyWhere.Hash.IN(getHashesFromOptionalEncounters(optionalEncounters)),
				dm.DeviceKeyWhere.Infected.EQ(true), // only iOS devices are registered with their permission
			).All(ctx, r.db)
		}()
	}

	// wait till all queries are resolved
	wg.Wait()

	// if something went wrong, let the user know
	if infectedEncountersError != nil || infectedDeviceKeyError != nil || realSecureKeysError != nil {
		log.Debug().Err(infectedEncountersError).Msg("infectedEncountersError")
		log.Debug().Err(infectedDeviceKeyError).Msg("infectedDeviceKeyError")
		log.Debug().Err(realSecureKeysError).Msg("realKeysError")

		log.Error().Err(infectedEncountersError).Msg("Could not get infected encounters from database")
		return nil, publicInfectedEncountersError
	}

	// infectedDeviceKeys or user encounters to support iOS alert for Android
	extraInfectedEncounters := EncountersInputsToBoiler(filterOptionalEncountersByInfectedDeviceKeys(optionalEncounters, infectedDeviceKeys))

	// We filter all encounters on the persisted device keys, we can't hard remove because
	// server could have removed them sooner than device + we don't want people to know if key exists yes/no
	securedEncounters := secureEncounters(infectedEncounters, deviceHashesOfMyOwn, realSecureKeys)

	// calculate risk for user based on his encounters
	return getRiskAlerts(append(securedEncounters, extraInfectedEncounters...)), nil
}

func (r *mutationResolver) CreateDeviceKey(ctx context.Context, input fm.DeviceKeyCreateInput) (*fm.OkPayload, error) {

	boilerModel := DeviceKeyCreateInputToBoiler(&input)
	if err := boilerModel.Insert(ctx, r.db, boil.Infer()); err != nil {
		log.Error().Err(err).Msg("Could not insert device key")
		return nil, publicCreateDeviceKeyError
	}
	return &fm.OkPayload{Ok: true}, nil
}

func (r *mutationResolver) DeleteInfectedEncountersOnKeys(ctx context.Context, deviceKeysOfUserParams []*fm.DeviceKeyParam) (*fm.OkPayload, error) {
	// if no device hashes are sent, return empty request
	if len(deviceKeysOfUserParams) == 0 {
		return &fm.OkPayload{Ok: true}, nil
	}

	realSecureKeys, err := dm.DeviceKeys(
		dm.DeviceKeyWhere.Hash.IN(
			getDeviceKeysFromParams(deviceKeysOfUserParams),
		),
	).All(ctx, r.db)
	if err != nil {
		log.Error().Err(err).Msg("Could not fetch device keys")
		return nil, publicDeleteInfectedEncountersOnKeysError
	}

	// only use validated hashes in query
	secureHashes := secureHashes(deviceKeysOfUserParams, realSecureKeys)
	if len(secureHashes) == 0 {
		return &fm.OkPayload{Ok: true}, nil
	}
	if _, err := dm.InfectedEncounters(dm.InfectedEncounterWhere.PossibleInfectedHash.IN(secureHashes)).DeleteAll(ctx, r.db); err != nil {
		log.Error().Err(err).Msg("Could not delete device keys")
		return nil, publicDeleteInfectedEncountersOnKeysError
	}
	return &fm.OkPayload{Ok: true}, nil
}

func (r *mutationResolver) RemoveDeviceKeys(ctx context.Context, deviceKeysOfUserParams []*fm.DeviceKeyParam) (*fm.OkPayload, error) {
	// if no device hashes are sent, return empty request
	if len(deviceKeysOfUserParams) == 0 {
		return &fm.OkPayload{Ok: true}, nil
	}
	realSecureKeys, err := dm.DeviceKeys(
		dm.DeviceKeyWhere.Hash.IN(
			getDeviceKeysFromParams(deviceKeysOfUserParams),
		),
	).All(ctx, r.db)

	if err != nil {
		log.Error().Err(err).Msg("Could not fetch device keys")
		return nil, publicRemoveDeviceKeysError
	}

	// only use validated hashes in query
	secureHashes := secureHashes(deviceKeysOfUserParams, realSecureKeys)
	if len(secureHashes) == 0 {
		return &fm.OkPayload{Ok: true}, nil
	}

	if _, err := dm.DeviceKeys(dm.DeviceKeyWhere.Hash.IN(secureHashes)).DeleteAll(ctx, r.db); err != nil {
		log.Error().Err(err).Msg("Could not delete device keys")
		return nil, publicRemoveDeviceKeysError
	}

	return &fm.OkPayload{Ok: true}, nil
}

func (r *mutationResolver) RegisterDeviceKeysAsInfected(ctx context.Context, deviceKeysOfUserParams []*fm.DeviceKeyParam) (*fm.OkPayload, error) {
	// if no device hashes are sent, return empty request
	if len(deviceKeysOfUserParams) == 0 {
		return &fm.OkPayload{Ok: true}, nil
	}
	realSecureKeys, err := dm.DeviceKeys(
		dm.DeviceKeyWhere.Hash.IN(
			getDeviceKeysFromParams(deviceKeysOfUserParams),
		),
	).All(ctx, r.db)

	if err != nil {
		log.Error().Err(err).Msg("could not fetch secure keys")
		return nil, publicRegisterDeviceKeysAsInfectedError
	}

	// only use validated hashes in query
	secureHashes := secureHashes(deviceKeysOfUserParams, realSecureKeys)
	if len(secureHashes) == 0 {
		return &fm.OkPayload{Ok: true}, nil
	}

	if _, err := dm.DeviceKeys(dm.DeviceKeyWhere.Hash.IN(secureHashes)).UpdateAll(ctx, r.db, dm.M{
		dm.DeviceKeyColumns.Infected: true,
	}); err != nil {
		log.Error().Err(err).Msg("Could not update device keys")
		return nil, publicRegisterDeviceKeysAsInfectedError
	}

	return &fm.OkPayload{Ok: true}, nil

}

func (r *mutationResolver) CreateInfectionCreateKey(ctx context.Context, singleSignOnKey string, singleSignOnSecondKey string) (*fm.InfectionCreateKey, error) {

	// validate request of instance
	// TODO in real situation should be user with password of GGD
	// If they will work together we will build that ;)
	realKey := os.Getenv("SINGLE_SIGN_ON_KEY")
	realSecondKey := os.Getenv("SINGLE_SIGN_ON_SECOND_KEY")
	wrongKey := realKey != singleSignOnKey
	wrongSecondKey := realSecondKey != singleSignOnSecondKey
	if wrongKey || wrongSecondKey || len(realKey) != 100 || len(realSecondKey) != 100 {
		log.Error().
			Bool("wrongKey", wrongKey).
			Bool("wrongSecondKey", wrongSecondKey).
			Msg("Could not create infection key")
		return nil, publicCreateInfectionCreateKeyUnauthorized
	}

	createKey, err := getRandomInfectionCreateKey()
	if err != nil {
		log.Error().Err(err).Msg("Could not create infection key")
		return nil, publicCreateInfectionCreateKeyUnauthorized
	}
	if err := createKey.Insert(ctx, r.db, boil.Infer()); err != nil {
		log.Error().Err(err).Msg("Could insert infection key")
		return nil, publicCreateDeviceKeyError
	}

	return InfectionCreateKeyToGraphQL(createKey), nil
}

func (r *mutationResolver) CreateInfectionCreateKeyUnauthorized(ctx context.Context) (*fm.InfectionCreateKey, error) {
	// This is only possible for testing purpopes
	isDisabled := os.Getenv("USER_INFECTION_CREATE_KEYS_ALLOWED") != "true"
	if isDisabled {
		return nil, publicCreateDeviceKeyError
	}

	createKey, err := getRandomInfectionCreateKey()
	if err != nil {
		log.Error().Err(err).Msg("Could not create infection key")
		return nil, publicCreateInfectionCreateKeyUnauthorized
	}
	if err := createKey.Insert(ctx, r.db, boil.Infer()); err != nil {
		log.Error().Err(err).Msg("Could insert infection key")
		return nil, publicCreateDeviceKeyError
	}
	return InfectionCreateKeyToGraphQL(createKey), nil
}

func (r *Resolver) Mutation() fm.MutationResolver { return &mutationResolver{r} }
func (r *Resolver) Query() fm.QueryResolver       { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
