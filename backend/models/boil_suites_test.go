// Code generated by SQLBoiler 3.6.1 (https://github.com/volatiletech/sqlboiler). DO NOT EDIT.
// This file is meant to be re-generated in place and/or deleted at any time.

package models

import "testing"

// This test suite runs each operation test in parallel.
// Example, if your database has 3 tables, the suite will run:
// table1, table2 and table3 Delete in parallel
// table1, table2 and table3 Insert in parallel, and so forth.
// It does NOT run each operation group in parallel.
// Separating the tests thusly grants avoidance of Postgres deadlocks.
func TestParent(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncounters)
}

func TestDelete(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncountersDelete)
}

func TestQueryDeleteAll(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncountersQueryDeleteAll)
}

func TestSliceDeleteAll(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncountersSliceDeleteAll)
}

func TestExists(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncountersExists)
}

func TestFind(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncountersFind)
}

func TestBind(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncountersBind)
}

func TestOne(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncountersOne)
}

func TestAll(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncountersAll)
}

func TestCount(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncountersCount)
}

func TestHooks(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncountersHooks)
}

func TestInsert(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncountersInsert)
	t.Run("InfectedEncounters", testInfectedEncountersInsertWhitelist)
}

// TestToOne tests cannot be run in parallel
// or deadlocks can occur.
func TestToOne(t *testing.T) {}

// TestOneToOne tests cannot be run in parallel
// or deadlocks can occur.
func TestOneToOne(t *testing.T) {}

// TestToMany tests cannot be run in parallel
// or deadlocks can occur.
func TestToMany(t *testing.T) {}

// TestToOneSet tests cannot be run in parallel
// or deadlocks can occur.
func TestToOneSet(t *testing.T) {}

// TestToOneRemove tests cannot be run in parallel
// or deadlocks can occur.
func TestToOneRemove(t *testing.T) {}

// TestOneToOneSet tests cannot be run in parallel
// or deadlocks can occur.
func TestOneToOneSet(t *testing.T) {}

// TestOneToOneRemove tests cannot be run in parallel
// or deadlocks can occur.
func TestOneToOneRemove(t *testing.T) {}

// TestToManyAdd tests cannot be run in parallel
// or deadlocks can occur.
func TestToManyAdd(t *testing.T) {}

// TestToManySet tests cannot be run in parallel
// or deadlocks can occur.
func TestToManySet(t *testing.T) {}

// TestToManyRemove tests cannot be run in parallel
// or deadlocks can occur.
func TestToManyRemove(t *testing.T) {}

func TestReload(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncountersReload)
}

func TestReloadAll(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncountersReloadAll)
}

func TestSelect(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncountersSelect)
}

func TestUpdate(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncountersUpdate)
}

func TestSliceUpdateAll(t *testing.T) {
	t.Run("InfectedEncounters", testInfectedEncountersSliceUpdateAll)
}
