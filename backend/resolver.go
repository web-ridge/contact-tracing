// THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.
package main

import (
	"context"
	"database/sql"
	"fmt"
	"math/rand"
	"sync"
	"time"

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

	boilerRows := InfectedEncounterCreateInputsToBoiler(input.InfectedEncounters)
	if len(boilerRows) == 0 {
		log.Debug().Msg("No encounters so returning OK=true")
		return &fm.OkPayload{
			Ok: true,
		}, nil
	}

	// four random characters which are used to group infections later to filter out unique encounters
	// will not be tracable back to a specific person since it's not nearly unique enough for that :-D
	randomString := randSeq(4)

	sql, values := InfectedEncountersToQuery(boilerRows, randomString)
	if _, err := r.db.Exec(sql, values...); err != nil {
		log.Error().Err(err).Msg("Could not insert infected encounters from database")
		return nil, fmt.Errorf("could not sync infected encounters")
	}
	log.Debug().Int("howManyEncounters", len(boilerRows)).Msg("inserted encounters into database")
	return &fm.OkPayload{
		Ok: true,
	}, nil
}

func getDeviceKeysFromParams(deviceKeysParams []*fm.DeviceKeyParam) []string {
	a := make([]string, len(deviceKeysParams))
	for i, deviceKey := range deviceKeysParams {
		a[i] = deviceKey.Hash
	}
	return a
}

// findSecuryDeviceKey returns true if the hash and password match in database
func isValidKeyParam(realSecureKeys dm.DeviceKeySlice, userInput *fm.DeviceKeyParam) bool {
	for _, realSecureKey := range realSecureKeys {
		if userInput.Hash == realSecureKey.Hash &&
			userInput.Password == realSecureKey.Password {
			return true
		}
	}
	return false
}

func getDeviceParamForEncounter(deviceKeysParams []*fm.DeviceKeyParam, encounterHash string) *fm.DeviceKeyParam {
	for _, deviceKeysParam := range deviceKeysParams {
		if deviceKeysParam.Hash == encounterHash {
			return deviceKeysParam
		}
	}
	return nil
}

// secureEncounters filters the encounters slice from database and checks it the device keys have the right hash and password
func secureEncounters(
	encounters dm.InfectedEncounterSlice,
	deviceKeysParams []*fm.DeviceKeyParam,
	realSecureKeys dm.DeviceKeySlice,
) dm.InfectedEncounterSlice {
	secureEncounters := dm.InfectedEncounterSlice{}
	for _, encounter := range encounters {
		deviceParam := getDeviceParamForEncounter(deviceKeysParams, encounter.PossibleInfectedHash)
		if deviceParam != nil && isValidKeyParam(realSecureKeys, deviceParam) {
			secureEncounters = append(secureEncounters, encounter)
		}
	}
	return secureEncounters
}

func secureHashes(deviceKeysParams []*fm.DeviceKeyParam,
	realSecureKeys dm.DeviceKeySlice) []string {
	var validHashes []string
	for _, deviceKeyParam := range deviceKeysParams {
		if isValidKeyParam(realSecureKeys, deviceKeyParam) {
			validHashes = append(validHashes, deviceKeyParam.Hash)
		}
	}
	return validHashes
}

// getHashesFromOptionalEncounters returns all device hashes which are possible iOS
func getHashesFromOptionalEncounters(optionalEncounters []*fm.EncounterInput) []string {
	a := make([]string, len(optionalEncounters))
	for _, optionalEncounter := range optionalEncounters {
		a = append(a, optionalEncounter.Hash)
	}
	return a
}

// filterOptionalEncountersByInfectedDeviceKeys only used on Android if they opt-in for iOS alert
// User infection status is fetchable by some-one else if they know the device hash of that certain day
func filterOptionalEncountersByInfectedDeviceKeys(optionalEncounters []*fm.EncounterInput, infectedDevices dm.DeviceKeySlice) []*fm.EncounterInput {
	var infectedEncounters []*fm.EncounterInput
	for _, optionalEncounter := range optionalEncounters {
		for _, infectedDevice := range infectedDevices {
			if optionalEncounter.Hash == infectedDevice.Hash {
				infectedEncounters = append(infectedEncounters, optionalEncounter)
			}
		}
	}
	return infectedEncounters
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

	//  1-14 days, most commonly around five days.
	beginOfIncubationPeriod := time.Now().AddDate(0, 0, -14)

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
			dm.InfectedEncounterWhere.Time.GTE(int(beginOfIncubationPeriod.Unix())),
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
		return nil, fmt.Errorf("could not get summary from database")
	}

	// infectedDeviceKeys or user encounters to support iOS alert for Android
	extraInfectedEncounters := EncountersInputsToBoiler(filterOptionalEncountersByInfectedDeviceKeys(optionalEncounters, infectedDeviceKeys))

	// We filter all encounters on the persisted device keys, we can't hard remove because
	// server could have removed them sooner than device + we don't want people to know if key exists yes/no
	securedEncounters := secureEncounters(infectedEncounters, deviceHashesOfMyOwn, realSecureKeys)

	// calculate risk for user based on his encounters
	return getRiskAlerts(append(securedEncounters, extraInfectedEncounters...)), nil
}

const createDeviceKeyError = "could not create device key"

func (r *mutationResolver) CreateDeviceKey(ctx context.Context, input fm.DeviceKeyCreateInput) (*fm.OkPayload, error) {

	boilerModel := DeviceKeyCreateInputToBoiler(&input)
	if err := boilerModel.Insert(ctx, r.db, boil.Infer()); err != nil {
		log.Error().Err(err).Msg("Could not insert device key")
		return nil, fmt.Errorf(createDeviceKeyError)
	}
	return &fm.OkPayload{Ok: true}, nil
}

const deleteInfectedEncountersOnKeysError = "could not delete infected encounters"

func (r *mutationResolver) DeleteInfectedEncountersOnKeys(ctx context.Context, deviceKeysOfUserParams []*fm.DeviceKeyParam) (*fm.OkPayload, error) {
	realSecureKeys, err := dm.DeviceKeys(
		dm.DeviceKeyWhere.Hash.IN(
			getDeviceKeysFromParams(deviceKeysOfUserParams),
		),
	).All(ctx, r.db)
	if err != nil {
		log.Error().Err(err).Msg("Could not fetch device keys")
		return nil, fmt.Errorf(deleteInfectedEncountersOnKeysError)
	}

	// only use validated hashes in query
	secureHashes := secureHashes(deviceKeysOfUserParams, realSecureKeys)
	if len(secureHashes) == 0 {
		return &fm.OkPayload{Ok: true}, nil
	}
	if _, err := dm.InfectedEncounters(dm.InfectedEncounterWhere.PossibleInfectedHash.IN(secureHashes)).DeleteAll(ctx, r.db); err != nil {
		log.Error().Err(err).Msg("Could not delete device keys")
		return nil, fmt.Errorf(removeDeviceKeysError)
	}
	return &fm.OkPayload{Ok: true}, nil
}

const removeDeviceKeysError = "could not delete device keys"

func (r *mutationResolver) RemoveDeviceKeys(ctx context.Context, deviceKeysOfUserParams []*fm.DeviceKeyParam) (*fm.OkPayload, error) {
	realSecureKeys, err := dm.DeviceKeys(
		dm.DeviceKeyWhere.Hash.IN(
			getDeviceKeysFromParams(deviceKeysOfUserParams),
		),
	).All(ctx, r.db)

	if err != nil {
		log.Error().Err(err).Msg("Could not fetch device keys")
		return nil, fmt.Errorf(removeDeviceKeysError)
	}

	// only use validated hashes in query
	secureHashes := secureHashes(deviceKeysOfUserParams, realSecureKeys)
	if len(secureHashes) == 0 {
		return &fm.OkPayload{Ok: true}, nil
	}

	if _, err := dm.DeviceKeys(dm.DeviceKeyWhere.Hash.IN(secureHashes)).DeleteAll(ctx, r.db); err != nil {
		log.Error().Err(err).Msg("Could not delete device keys")
		return nil, fmt.Errorf(removeDeviceKeysError)
	}

	return &fm.OkPayload{Ok: true}, nil
}

const registerDeviceKeysAsInfectedError = "Could not register device keys as infected"

func (r *mutationResolver) RegisterDeviceKeysAsInfected(ctx context.Context, deviceKeysOfUserParams []*fm.DeviceKeyParam) (*fm.OkPayload, error) {
	realSecureKeys, err := dm.DeviceKeys(
		dm.DeviceKeyWhere.Hash.IN(
			getDeviceKeysFromParams(deviceKeysOfUserParams),
		),
	).All(ctx, r.db)

	if err != nil {
		log.Error().Err(err).Msg("could not fetch secure keys")
		return nil, fmt.Errorf(registerDeviceKeysAsInfectedError)
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
		return nil, fmt.Errorf(registerDeviceKeysAsInfectedError)
	}

	return &fm.OkPayload{Ok: true}, nil

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
