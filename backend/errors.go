package main

import "errors"

// Public errors which will be returned from api so should not contain something
var publicInfectedEncountersError = errors.New("could not get summary from database")
var publicRegisterDeviceKeysAsInfectedError = errors.New("could not register device keys as infected")
var publicRemoveDeviceKeysError = errors.New("could not delete device keys")
var publicDeleteInfectedEncountersOnKeysError = errors.New("could not delete infected encounters")
var publicCreateDeviceKeyError = errors.New("could not create device key")
var publicCreateInfectedEncountersError = errors.New("could not sync infected encounters")
var publicCreateInfectionCreateKeyUnauthorized = errors.New("could not create infection key")
