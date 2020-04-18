import Realm from 'realm'
import { getDatabaseEncryptionKey } from './Utils'

export const EncounterSchema = {
  name: 'Encounter',
  primaryKey: 'id',
  properties: {
    id: 'string', // primary key
    hash: 'string',
    rssi: { type: 'int', default: 0 },
    hits: { type: 'int', default: 0 },
    time: { type: 'int', default: 0 }, // hours/seconds are removed, only for easy filtering with unix
  },
}

export const KeysSchema = {
  name: 'DeviceKey',
  primaryKey: 'id',
  properties: {
    id: 'string', // primary key
    key: 'string', // external identifier for other devices
    password: 'string', // used to secure risk counts on Android
    synced: 'boolean', // used to secure risk counts on Android
    time: { type: 'int', default: 0 },
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
  return realm
}
