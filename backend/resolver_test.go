package main

import "testing"

// Priority is given to test if a data leak is prevented in all possible ways firt
// At this moment we don't care if users can mass create or mass delete data since it's not in production
// Other tests like these

// SEND PR to be done as soon as possible
func CreateInfectedEncountersTest(t testing.T) {

	// Test if it works

	// Test if it returns error when provided wrong key

	// Test if it returns error when provided wrong password

	// Test if it returns error if not valid anymore
}

func InfectedEncountersTest(t testing.T) {
	// resolver := &queryResolver{
	// 	db:
	// }
	// // create key user should not see because he has no permission
	// // create key
	// resolver.InfectedEncounters()
}
