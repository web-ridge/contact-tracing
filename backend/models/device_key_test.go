// Code generated by SQLBoiler 3.6.1 (https://github.com/volatiletech/sqlboiler). DO NOT EDIT.
// This file is meant to be re-generated in place and/or deleted at any time.

package models

import (
	"bytes"
	"context"
	"reflect"
	"testing"

	"github.com/volatiletech/sqlboiler/boil"
	"github.com/volatiletech/sqlboiler/queries"
	"github.com/volatiletech/sqlboiler/randomize"
	"github.com/volatiletech/sqlboiler/strmangle"
)

var (
	// Relationships sometimes use the reflection helper queries.Equal/queries.Assign
	// so force a package dependency in case they don't.
	_ = queries.Equal
)

func testDeviceKeys(t *testing.T) {
	t.Parallel()

	query := DeviceKeys()

	if query.Query == nil {
		t.Error("expected a query, got nothing")
	}
}

func testDeviceKeysDelete(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &DeviceKey{}
	if err = randomize.Struct(seed, o, deviceKeyDBTypes, true, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if rowsAff, err := o.Delete(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := DeviceKeys().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testDeviceKeysQueryDeleteAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &DeviceKey{}
	if err = randomize.Struct(seed, o, deviceKeyDBTypes, true, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if rowsAff, err := DeviceKeys().DeleteAll(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := DeviceKeys().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testDeviceKeysSliceDeleteAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &DeviceKey{}
	if err = randomize.Struct(seed, o, deviceKeyDBTypes, true, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice := DeviceKeySlice{o}

	if rowsAff, err := slice.DeleteAll(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := DeviceKeys().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testDeviceKeysExists(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &DeviceKey{}
	if err = randomize.Struct(seed, o, deviceKeyDBTypes, true, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	e, err := DeviceKeyExists(ctx, tx, o.ID)
	if err != nil {
		t.Errorf("Unable to check if DeviceKey exists: %s", err)
	}
	if !e {
		t.Errorf("Expected DeviceKeyExists to return true, but got false.")
	}
}

func testDeviceKeysFind(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &DeviceKey{}
	if err = randomize.Struct(seed, o, deviceKeyDBTypes, true, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	deviceKeyFound, err := FindDeviceKey(ctx, tx, o.ID)
	if err != nil {
		t.Error(err)
	}

	if deviceKeyFound == nil {
		t.Error("want a record, got nil")
	}
}

func testDeviceKeysBind(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &DeviceKey{}
	if err = randomize.Struct(seed, o, deviceKeyDBTypes, true, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if err = DeviceKeys().Bind(ctx, tx, o); err != nil {
		t.Error(err)
	}
}

func testDeviceKeysOne(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &DeviceKey{}
	if err = randomize.Struct(seed, o, deviceKeyDBTypes, true, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if x, err := DeviceKeys().One(ctx, tx); err != nil {
		t.Error(err)
	} else if x == nil {
		t.Error("expected to get a non nil record")
	}
}

func testDeviceKeysAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	deviceKeyOne := &DeviceKey{}
	deviceKeyTwo := &DeviceKey{}
	if err = randomize.Struct(seed, deviceKeyOne, deviceKeyDBTypes, false, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}
	if err = randomize.Struct(seed, deviceKeyTwo, deviceKeyDBTypes, false, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = deviceKeyOne.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}
	if err = deviceKeyTwo.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice, err := DeviceKeys().All(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if len(slice) != 2 {
		t.Error("want 2 records, got:", len(slice))
	}
}

func testDeviceKeysCount(t *testing.T) {
	t.Parallel()

	var err error
	seed := randomize.NewSeed()
	deviceKeyOne := &DeviceKey{}
	deviceKeyTwo := &DeviceKey{}
	if err = randomize.Struct(seed, deviceKeyOne, deviceKeyDBTypes, false, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}
	if err = randomize.Struct(seed, deviceKeyTwo, deviceKeyDBTypes, false, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = deviceKeyOne.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}
	if err = deviceKeyTwo.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := DeviceKeys().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 2 {
		t.Error("want 2 records, got:", count)
	}
}

func deviceKeyBeforeInsertHook(ctx context.Context, e boil.ContextExecutor, o *DeviceKey) error {
	*o = DeviceKey{}
	return nil
}

func deviceKeyAfterInsertHook(ctx context.Context, e boil.ContextExecutor, o *DeviceKey) error {
	*o = DeviceKey{}
	return nil
}

func deviceKeyAfterSelectHook(ctx context.Context, e boil.ContextExecutor, o *DeviceKey) error {
	*o = DeviceKey{}
	return nil
}

func deviceKeyBeforeUpdateHook(ctx context.Context, e boil.ContextExecutor, o *DeviceKey) error {
	*o = DeviceKey{}
	return nil
}

func deviceKeyAfterUpdateHook(ctx context.Context, e boil.ContextExecutor, o *DeviceKey) error {
	*o = DeviceKey{}
	return nil
}

func deviceKeyBeforeDeleteHook(ctx context.Context, e boil.ContextExecutor, o *DeviceKey) error {
	*o = DeviceKey{}
	return nil
}

func deviceKeyAfterDeleteHook(ctx context.Context, e boil.ContextExecutor, o *DeviceKey) error {
	*o = DeviceKey{}
	return nil
}

func deviceKeyBeforeUpsertHook(ctx context.Context, e boil.ContextExecutor, o *DeviceKey) error {
	*o = DeviceKey{}
	return nil
}

func deviceKeyAfterUpsertHook(ctx context.Context, e boil.ContextExecutor, o *DeviceKey) error {
	*o = DeviceKey{}
	return nil
}

func testDeviceKeysHooks(t *testing.T) {
	t.Parallel()

	var err error

	ctx := context.Background()
	empty := &DeviceKey{}
	o := &DeviceKey{}

	seed := randomize.NewSeed()
	if err = randomize.Struct(seed, o, deviceKeyDBTypes, false); err != nil {
		t.Errorf("Unable to randomize DeviceKey object: %s", err)
	}

	AddDeviceKeyHook(boil.BeforeInsertHook, deviceKeyBeforeInsertHook)
	if err = o.doBeforeInsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeInsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeInsertHook function to empty object, but got: %#v", o)
	}
	deviceKeyBeforeInsertHooks = []DeviceKeyHook{}

	AddDeviceKeyHook(boil.AfterInsertHook, deviceKeyAfterInsertHook)
	if err = o.doAfterInsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterInsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterInsertHook function to empty object, but got: %#v", o)
	}
	deviceKeyAfterInsertHooks = []DeviceKeyHook{}

	AddDeviceKeyHook(boil.AfterSelectHook, deviceKeyAfterSelectHook)
	if err = o.doAfterSelectHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterSelectHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterSelectHook function to empty object, but got: %#v", o)
	}
	deviceKeyAfterSelectHooks = []DeviceKeyHook{}

	AddDeviceKeyHook(boil.BeforeUpdateHook, deviceKeyBeforeUpdateHook)
	if err = o.doBeforeUpdateHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeUpdateHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeUpdateHook function to empty object, but got: %#v", o)
	}
	deviceKeyBeforeUpdateHooks = []DeviceKeyHook{}

	AddDeviceKeyHook(boil.AfterUpdateHook, deviceKeyAfterUpdateHook)
	if err = o.doAfterUpdateHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterUpdateHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterUpdateHook function to empty object, but got: %#v", o)
	}
	deviceKeyAfterUpdateHooks = []DeviceKeyHook{}

	AddDeviceKeyHook(boil.BeforeDeleteHook, deviceKeyBeforeDeleteHook)
	if err = o.doBeforeDeleteHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeDeleteHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeDeleteHook function to empty object, but got: %#v", o)
	}
	deviceKeyBeforeDeleteHooks = []DeviceKeyHook{}

	AddDeviceKeyHook(boil.AfterDeleteHook, deviceKeyAfterDeleteHook)
	if err = o.doAfterDeleteHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterDeleteHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterDeleteHook function to empty object, but got: %#v", o)
	}
	deviceKeyAfterDeleteHooks = []DeviceKeyHook{}

	AddDeviceKeyHook(boil.BeforeUpsertHook, deviceKeyBeforeUpsertHook)
	if err = o.doBeforeUpsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeUpsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeUpsertHook function to empty object, but got: %#v", o)
	}
	deviceKeyBeforeUpsertHooks = []DeviceKeyHook{}

	AddDeviceKeyHook(boil.AfterUpsertHook, deviceKeyAfterUpsertHook)
	if err = o.doAfterUpsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterUpsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterUpsertHook function to empty object, but got: %#v", o)
	}
	deviceKeyAfterUpsertHooks = []DeviceKeyHook{}
}

func testDeviceKeysInsert(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &DeviceKey{}
	if err = randomize.Struct(seed, o, deviceKeyDBTypes, true, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := DeviceKeys().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}
}

func testDeviceKeysInsertWhitelist(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &DeviceKey{}
	if err = randomize.Struct(seed, o, deviceKeyDBTypes, true); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Whitelist(deviceKeyColumnsWithoutDefault...)); err != nil {
		t.Error(err)
	}

	count, err := DeviceKeys().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}
}

func testDeviceKeysReload(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &DeviceKey{}
	if err = randomize.Struct(seed, o, deviceKeyDBTypes, true, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if err = o.Reload(ctx, tx); err != nil {
		t.Error(err)
	}
}

func testDeviceKeysReloadAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &DeviceKey{}
	if err = randomize.Struct(seed, o, deviceKeyDBTypes, true, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice := DeviceKeySlice{o}

	if err = slice.ReloadAll(ctx, tx); err != nil {
		t.Error(err)
	}
}

func testDeviceKeysSelect(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &DeviceKey{}
	if err = randomize.Struct(seed, o, deviceKeyDBTypes, true, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice, err := DeviceKeys().All(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if len(slice) != 1 {
		t.Error("want one record, got:", len(slice))
	}
}

var (
	deviceKeyDBTypes = map[string]string{`ID`: `integer`, `Hash`: `text`, `Password`: `text`, `Time`: `integer`}
	_                = bytes.MinRead
)

func testDeviceKeysUpdate(t *testing.T) {
	t.Parallel()

	if 0 == len(deviceKeyPrimaryKeyColumns) {
		t.Skip("Skipping table with no primary key columns")
	}
	if len(deviceKeyAllColumns) == len(deviceKeyPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	o := &DeviceKey{}
	if err = randomize.Struct(seed, o, deviceKeyDBTypes, true, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := DeviceKeys().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}

	if err = randomize.Struct(seed, o, deviceKeyDBTypes, true, deviceKeyPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	if rowsAff, err := o.Update(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only affect one row but affected", rowsAff)
	}
}

func testDeviceKeysSliceUpdateAll(t *testing.T) {
	t.Parallel()

	if len(deviceKeyAllColumns) == len(deviceKeyPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	o := &DeviceKey{}
	if err = randomize.Struct(seed, o, deviceKeyDBTypes, true, deviceKeyColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := DeviceKeys().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}

	if err = randomize.Struct(seed, o, deviceKeyDBTypes, true, deviceKeyPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	// Remove Primary keys and unique columns from what we plan to update
	var fields []string
	if strmangle.StringSliceMatch(deviceKeyAllColumns, deviceKeyPrimaryKeyColumns) {
		fields = deviceKeyAllColumns
	} else {
		fields = strmangle.SetComplement(
			deviceKeyAllColumns,
			deviceKeyPrimaryKeyColumns,
		)
	}

	value := reflect.Indirect(reflect.ValueOf(o))
	typ := reflect.TypeOf(o).Elem()
	n := typ.NumField()

	updateMap := M{}
	for _, col := range fields {
		for i := 0; i < n; i++ {
			f := typ.Field(i)
			if f.Tag.Get("boil") == col {
				updateMap[col] = value.Field(i).Interface()
			}
		}
	}

	slice := DeviceKeySlice{o}
	if rowsAff, err := slice.UpdateAll(ctx, tx, updateMap); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("wanted one record updated but got", rowsAff)
	}
}

func testDeviceKeysUpsert(t *testing.T) {
	t.Parallel()

	if len(deviceKeyAllColumns) == len(deviceKeyPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	// Attempt the INSERT side of an UPSERT
	o := DeviceKey{}
	if err = randomize.Struct(seed, &o, deviceKeyDBTypes, true); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Upsert(ctx, tx, false, nil, boil.Infer(), boil.Infer()); err != nil {
		t.Errorf("Unable to upsert DeviceKey: %s", err)
	}

	count, err := DeviceKeys().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}
	if count != 1 {
		t.Error("want one record, got:", count)
	}

	// Attempt the UPDATE side of an UPSERT
	if err = randomize.Struct(seed, &o, deviceKeyDBTypes, false, deviceKeyPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize DeviceKey struct: %s", err)
	}

	if err = o.Upsert(ctx, tx, true, nil, boil.Infer(), boil.Infer()); err != nil {
		t.Errorf("Unable to upsert DeviceKey: %s", err)
	}

	count, err = DeviceKeys().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}
	if count != 1 {
		t.Error("want one record, got:", count)
	}
}
