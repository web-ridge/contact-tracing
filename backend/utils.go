package main

import (
	"fmt"
	"math/rand"
	"time"

	fm "github.com/web-ridge/contact-tracing/backend/graphql_models"

	dm "github.com/web-ridge/contact-tracing/backend/models"
)

// user could send timestamp which are not at all real so we check it with the date of key
// also we filter out alerts which are too late since the user posted his key too late
func filterRowsOutsideRange(rows []*dm.InfectedEncounter, createKey *dm.InfectionCreateKey) []*dm.InfectedEncounter {
	var filtered []*dm.InfectedEncounter

	// day user was test positive
	dateOfTested := createKey.Time - int(howLongForTestResult.Seconds())

	// start data which should get user warnings
	startDateOfContamination := dateOfTested - int(incubationPeriodIndays.Seconds())
	endDateOfContamination := int(time.Now().Unix())

	for _, row := range rows {
		// this encounter is before the user was contagious
		if row.Time < startDateOfContamination {
			continue
		}

		// this is probably not valid since user tries to add contamination in future
		if row.Time > endDateOfContamination {
			continue
		}

		// Good to go :)
		filtered = append(filtered, row)
	}

	return filtered
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

func getRandomInfectionCreateKey() (*dm.InfectionCreateKey, error) {
	randomKeyBytes := make([]byte, 25)
	randomPasswordBytes := make([]byte, 25)
	_, randomKeyBytesError := rand.Read(randomKeyBytes)
	if randomKeyBytesError != nil {
		return nil, fmt.Errorf("could not generate random key for infection create: %v", randomKeyBytesError)
	}
	_, randomPasswordBytesError := rand.Read(randomPasswordBytes)
	if randomPasswordBytesError != nil {
		return nil, fmt.Errorf("could not generate random password for infection create: %v", randomPasswordBytesError)
	}
	return &dm.InfectionCreateKey{
		Key:      string(randomKeyBytes),
		Password: string(randomPasswordBytes),
		Time:     int(time.Now().Unix()),
	}, nil
}

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

// randSeq does not need be to be really unique just a tiny little bit
func randSeq(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func getRemoveStartTimeUnix() int {
	return int(time.Now().Unix()) - int(incubationPeriodIndays.Seconds())
}
func getIncubationStartTimeUnix() int {
	return int(time.Now().Unix()) - int(incubationPeriodIndays.Seconds())
}
