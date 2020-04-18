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

func getDeviceKeysFromParams(deviceKeysParams []fm.DeviceKeyParam) []string {
	a := make([]string, len(deviceKeysParams))
	for i, deviceKey := range deviceKeysParams {
		a[i] = deviceKey.Hash
	}
	return a
}

// findSecuryDeviceKey returns true if the hash and password match in database
func isValidKeyParam(realSecureKeys dm.DeviceKeySlice, userInput fm.DeviceKeyParam) bool {
	for _, realSecureKey := range realSecureKeys {
		if userInput.Hash == realSecureKey.Hash &&
			userInput.Password == realSecureKey.Password {
			return true
		}
	}
	return false
}

func getDeviceParamForEncounter(deviceKeysParams []fm.DeviceKeyParam, encounterHash string) (fm.DeviceKeyParam, bool) {
	for _, deviceKeysParam := range deviceKeysParams {
		if deviceKeysParam.Hash == encounterHash {
			return deviceKeysParam, true
		}
	}
	return fm.DeviceKeyParam{}, false
}

// secureEncounters filters the encounters slice from database and checks it the device keys have the right hash and password
func secureEncounters(
	encounters dm.InfectedEncounterSlice,
	deviceKeysParams []fm.DeviceKeyParam,
	realSecureKeys dm.DeviceKeySlice,
) dm.InfectedEncounterSlice {
	secureEncounters := dm.InfectedEncounterSlice{}
	for _, encounter := range encounters {
		deviceParam, exist := getDeviceParamForEncounter(deviceKeysParams, encounter.PossibleInfectedHash)
		if exist && isValidKeyParam(realSecureKeys, deviceParam) {
			secureEncounters = append(secureEncounters, encounter)
		}
	}
	return secureEncounters
}

// InfectedEncounters fetches the shared encounters of other users with my device key. Only the user will be able to fetch
// these since the others don't have the password which is in a local persisted database
// optionalExtraDeviceHashes is used to check infected device keys since iOS users won't be able to track in the background
// they can register their device as being infected (and remove it every time they want)
func (r *queryResolver) InfectedEncounters(ctx context.Context, deviceKeysOfUserParams []fm.DeviceKeyParam, optionalExtraDeviceHashes []string) ([]*fm.InfectionAlert, error) {

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
				getDeviceKeysFromParams(deviceKeysOfUserParams),
			),
		).All(ctx, r.db)
		infectedEncounters = infectedEncounters
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		infectedEncounters, infectedEncountersError = dm.InfectedEncounters(
			dm.InfectedEncounterWhere.PossibleInfectedHash.IN(
				getDeviceKeysFromParams(deviceKeysOfUserParams),
			),
			dm.InfectedEncounterWhere.Time.GTE(int(beginOfIncubationPeriod.Unix())),
		).All(ctx, r.db)
		infectedEncounters = infectedEncounters
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		infectedDeviceKeys, infectedDeviceKeyError = dm.DeviceKeys(
			dm.DeviceKeyWhere.Hash.IN(optionalExtraDeviceHashes),
			dm.DeviceKeyWhere.Infected.EQ(true), // only iOS devices are registered with their permission
		).All(ctx, r.db)
	}()

	// wait till all queries are resolved
	wg.Wait()

	if infectedEncountersError != nil || infectedDeviceKeyError != nil || realSecureKeysError != nil {
		log.Debug().Err(infectedEncountersError).Msg("infectedEncountersError")
		log.Debug().Err(infectedDeviceKeyError).Msg("infectedDeviceKeyError")
		log.Debug().Err(realSecureKeysError).Msg("realKeysError")

		log.Error().Err(infectedEncountersError).Msg("Could not get infected encounters from database")
		return nil, fmt.Errorf("could not get summary from database")
	}

	// TODO: infectedDeviceKeys or user encounters to support iOS alert for Android

	// We filter all encounters on the persisted device keys, we can't hard remove because
	// server could have removed them sooner than device + we don't want people to know if key exists yes/no
	securedEncounters := secureEncounters(infectedEncounters, deviceKeysOfUserParams, realSecureKeys)

	// calculate risk for user
	return getRiskAlerts(securedEncounters), nil
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
