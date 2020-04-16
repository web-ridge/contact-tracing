import { RSSIMap, Encounter } from './types'
import { getDatabase, EncounterSchema } from './Database'
import RNSimpleCrypto from 'react-native-simple-crypto'

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
  let rssiMap: RSSIMap = {}
  Object.keys(rssiMapUnsafe).forEach(async (bluetoothID) => {
    const hash = await RNSimpleCrypto.SHA.sha256(bluetoothID)
    rssiMap[hash] = rssiMapUnsafe[bluetoothID]
  })

  try {
    const database = await getDatabase()
    // sync encounters to database with a encrypted hash of bluetooth ID
    database.write(() => {
      Object.keys(rssiMap).forEach((bluetoothHash) => {
        const rrsiValue = rssiMap[bluetoothHash]
        database.create(EncounterSchema.name, {
          hash: bluetoothHash,
          rssi: rrsiValue.rssi,
          hits: rrsiValue.hits,
          time: Math.round(new Date().getTime() / 1000),
        })
      })
    })
    return true
  } catch (error) {
    console.log('Could not sync rssi encounters')
    console.log({ error })
    return false
  }
}
