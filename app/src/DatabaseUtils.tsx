import { RSSIMap, Encounter } from './types'
import { getDatabase, EncounterSchema } from './Database'
import { sha256 } from 'js-sha256'
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
import { getAnonymizedTimestamp } from './Utils'

export async function removeAllEncounters(): Promise<boolean> {
  const database = await getDatabase()
  try {
    database.write(() => {
      database.delete(database.objects('Encounter'))
    })
    return true
  } catch (error) {
    console.log({ error })
    return false
  }
}

export async function removeEncountersOlderThan(
  unix: number
): Promise<boolean> {
  const database = await getDatabase()
  try {
    database.write(() => {
      database.delete(database.objects('Encounter').filtered(`time < ${unix}`))
    })
    return true
  } catch (error) {
    console.log({ error })
    return false
  }
}

export async function getEncountersAfter(unix: number): Promise<Encounter[]> {
  try {
    const database = await getDatabase()
    let encounters = database.objects('Encounter').filtered(`time > ${unix}`)
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
