// WebRidge Design

import Realm from 'realm'
import { getDatabaseEncryptionKey } from './Utils'

export const EncounterSchema = {
  name: 'Encounter',
  primaryKey: 'id',
  properties: {
    id: 'string', // primary key
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
  primaryKey: 'id',
  properties: {
    id: 'string', // primary key
    key: 'string', // external identifier for other devices
    password: 'string', // used to secure own encounters which are sent by others
    internalTime: { type: 'int', default: 0 },
    externalTime: { type: 'int', default: 0 },
  },
}

let realm: Realm | undefined

export async function getDatabase(): Promise<Realm> {
  // if already exist in memory let's return that database
  if (realm) {
    return realm
  }

  const encryptionKey = await getDatabaseEncryptionKey()
  realm = new Realm({ schema: [EncounterSchema, KeysSchema], encryptionKey })
  // TODO :try to re-generate another database if decryption failed
  return realm
}
