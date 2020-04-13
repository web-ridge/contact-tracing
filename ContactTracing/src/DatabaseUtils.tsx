import { RSSIMap } from './types'
import { getDatabase, EncounterSchema } from './Database'
import RNSimpleCrypto from 'react-native-simple-crypto'

export async function syncRSSI(rssiMap: RSSIMap): Promise<boolean> {
  try {
    const database = await getDatabase()
    // sync encounters to database with a encrypted hash of bluetooth ID
    database.write(() => {
      Object.keys(rssiMap).forEach((bluetoothID) => {
        database.create(EncounterSchema.name, {
          hash: RNSimpleCrypto.SHA.sha256(bluetoothID),
          rssi: rssiMap[bluetoothID],
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
