// WebRidge Design

import Realm from 'realm'
import { getDatabaseEncryptionKey } from './Utils'

export const EncounterSchema = {
  name: 'Encounter',
  primaryKey: 'has',
  properties: {
    hash: 'string',
    // isIos: 'bool', // used to fetch infected iOS targets later on if user opted-in for that
    rssi: { type: 'int', default: 0 }, // max rrsi signal strenght
    hits: { type: 'int', default: 0 }, // how many times the signal has changed upwards
    time: { type: 'int', default: 0 }, // hours/seconds are removed, only for easy filtering with unix
    duration: { type: 'int', default: 0 },
  },
}

export const KeysSchema = {
  name: 'DeviceKey',
  primaryKey: 'key',
  properties: {
    key: 'string', // external identifier for other devices
    password: 'string', // used to secure own encounters which are sent by others
    internalTime: { type: 'int', default: 0 },
    externalTime: { type: 'int', default: 0 },
  },
}

export const IgnoredDeviceSchema = {
  name: 'IgnoredDevice',
  primaryKey: 'bluetoothId',
  properties: {
    bluetoothId: 'string', // external identifier for other devices
    time: { type: 'int', default: 0 },
  },
}

// cache Realm instance so we don't need to heavy logic every time
let realm: Realm | undefined

// getDatabase returns a cached Realm instance or get the encryption key from Keychain / Keylock
// and gets the Realm instance
export async function getDatabase(): Promise<Realm> {
  // if already exist in memory let's return that database
  if (realm) {
    return realm
  }

  const encryptionKey = await getDatabaseEncryptionKey()
  realm = new Realm({
    schema: [EncounterSchema, KeysSchema, IgnoredDeviceSchema],
    encryptionKey,
  })
  return realm
}
