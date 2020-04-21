package main

import (
	secureRandom "crypto/rand"
	unsafeRandom "math/rand"

	"fmt"
	"io"
	"time"

	fm "github.com/web-ridge/contact-tracing/backend/graphql_models"

	dm "github.com/web-ridge/contact-tracing/backend/models"
)

// Adapted from https://elithrar.github.io/article/generating-secure-random-numbers-crypto-rand/

func init() {
	assertAvailablePRNG()
}

func assertAvailablePRNG() {
	// Assert that a cryptographically secure PRNG is available.
	// Panic otherwise.
	buf := make([]byte, 1)

	_, err := io.ReadFull(secureRandom.Reader, buf)
	if err != nil {
		panic(fmt.Sprintf("crypto/rand is unavailable: Read() failed with %#v", err))
	}
}

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

func getRandomInfectionCreateKey() (*dm.InfectionCreateKey, error) {

	key, randomKeyBytesError := GenerateRandomString(50)
	if randomKeyBytesError != nil {
		return nil, fmt.Errorf("could not generate random key for infection create: %v", randomKeyBytesError)
	}
	pass, randomPasswordBytesError := GenerateRandomString(50)
	if randomPasswordBytesError != nil {
		return nil, fmt.Errorf("could not generate random password for infection create: %v", randomPasswordBytesError)
	}
	return &dm.InfectionCreateKey{
		Key:      key,
		Password: pass,
		Time:     int(time.Now().Unix()),
	}, nil
}

func getRemoveStartTimeUnix() int {
	return int(time.Now().Unix()) - int(incubationPeriodIndays.Seconds())
}
func getIncubationStartTimeUnix() int {
	return int(time.Now().Unix()) - int(incubationPeriodIndays.Seconds())
}

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

// unsafeRandomRandSeq does not need be to be really unique just a tiny little bit
func unsafeRandomRandSeq(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[unsafeRandom.Intn(len(letters))]
	}
	return string(b)
}

// GenerateRandomBytes returns securely generated random bytes.
// It will return an error if the system's secure random
// number generator fails to function correctly, in which
// case the caller should not continue.
func GenerateRandomBytes(n int) ([]byte, error) {
	b := make([]byte, n)
	_, err := secureRandom.Read(b)
	// Note that err == nil only if we read len(b) bytes.
	if err != nil {
		return nil, err
	}

	return b, nil
}

// GenerateRandomString returns a securely generated random string.
// It will return an error if the system's secure random
// number generator fails to function correctly, in which
// case the caller should not continue.
func GenerateRandomString(n int) (string, error) {
	const letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-"
	bytes, err := GenerateRandomBytes(n)
	if err != nil {
		return "", err
	}
	for i, b := range bytes {
		bytes[i] = letters[b%byte(len(letters))]
	}
	return string(bytes), nil
}
