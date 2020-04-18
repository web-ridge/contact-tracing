import { RSSIMap, Encounter } from './types'
import { getDatabase, EncounterSchema, KeysSchema } from './Database'
import { sha256 } from 'js-sha256'
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
import { getAnonymizedTimestamp, getStartOfRiskUnix } from './Utils'

export async function removeAllEncounters(): Promise<boolean> {
  const database = await getDatabase()
  try {
    database.write(() => {
      database.delete(database.objects(EncounterSchema.name))
    })
    return true
  } catch (error) {
    console.log({ error })
    return false
  }
}

// getDeviceKeys fetches the keys from realm where risk is for infection (1-14 days)
// it also removes device keys older than 14 days since they are not needed anymore
export async function getDeviceKeys(): Promise<string[]> {
  const database = await getDatabase()
  try {
    // delete old device keys
    database.write(() => {
      database.delete(
        database
          .objects(KeysSchema.name)
          .filtered(`time < ${getStartOfRiskUnix()}`)
      )
    })

    let keys = database.objects(KeysSchema.name)

    return []
  } catch (error) {
    console.log('getDeviceKeys', { error })
    return []
  }

  // TODO: create new deviceKey and password
  // TODO: register deviceKey and password
  //
}

export async function getCurrentDeviceKeyOrCreate() {
  // TODO: check if device key exist for this date
  // TODO: create new deviceKey and password
  // TODO: register deviceKey and password
  //
}

export async function removeOldEncounters(): Promise<boolean> {
  const database = await getDatabase()
  try {
    database.write(() => {
      database.delete(
        database
          .objects(EncounterSchema.name)
          .filtered(`time < ${getStartOfRiskUnix()}`)
      )
    })
    return true
  } catch (error) {
    console.log({ error })
    return false
  }
}

export async function getEncounters(): Promise<Encounter[]> {
  try {
    const database = await getDatabase()
    let encounters = database
      .objects(EncounterSchema.name)
      .filtered(`time > ${getStartOfRiskUnix()}`)
    if (!encounters) {
      return []
    }
    return encounters as any
  } catch (e) {
    console.log('Could not get encounters')
    console.log({ e })
    return []
  }
}

export async function syncRSSIMap(rssiMapUnsafe: RSSIMap): Promise<boolean> {
  const objectsToCreate: Encounter[] = Object.keys(rssiMapUnsafe).map(
    (contactTracingDeviceUUID) => {
      const rssiValue = rssiMapUnsafe[contactTracingDeviceUUID]
      const hash = sha256(contactTracingDeviceUUID)
      return {
        id: 'id' + nanoid(),
        hash,
        rssi: rssiValue.rssi,
        hits: rssiValue.hits,
        time: getAnonymizedTimestamp(),
      }
    }
  )

  console.log({ objectsToCreate })

  try {
    const database = await getDatabase()
    // sync encounters to database with a encrypted hash of bluetooth ID
    database.write(() => {
      objectsToCreate.map((objectToCreate) =>
        database.create(EncounterSchema.name, objectToCreate)
      )
    })
    return true
  } catch (error) {
    console.log('Could not sync rssi encounters')
    console.log({ error })
    return false
  }
}
