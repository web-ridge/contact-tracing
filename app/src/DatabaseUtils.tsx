import { RSSIMap, Encounter, DeviceKey } from './types'
import { getDatabase, EncounterSchema, KeysSchema } from './Database'
import { sha256 } from 'js-sha256'
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
import {
  getAnonymizedTimestamp,
  getStartOfRiskUnix,
  secondPartOfContactTracingUUID,
  getRandomString,
} from './Utils'
import { v4 as uuidv4 } from 'uuid'
import AsyncStorage from '@react-native-community/async-storage'
import { commitMutation, graphql } from 'react-relay'
import RelayEnvironment from './RelayEnvironment'
import {
  InfectionAlertsQueryVariables,
  DeviceKeyParam,
} from './__generated__/InfectionAlertsQuery.graphql'
import { DatabaseUtilsCreateDeviceKeyMutation } from './__generated__/DatabaseUtilsCreateDeviceKeyMutation.graphql'

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

const acceptediOSAlertsKey = 'acceptediOSAlerts'
export async function getInfectedEncountersQueryVariables(): Promise<
  InfectionAlertsQueryVariables
> {
  const acceptediOSAlerts = await AsyncStorage.getItem(acceptediOSAlertsKey)
  const database = await getDatabase()

  // first trigger token if not yet created
  await getCurrentDeviceKeyOrRenew()

  let deviceKeys = await getDeviceKeys()

  let optionalEncountersWithiOSDevices: Encounter[] | undefined
  if (acceptediOSAlerts) {
    optionalEncountersWithiOSDevices = database
      .objects(EncounterSchema.name)
      .filtered(`isIos = true`) as any
  }

  console.log(
    'deviceKeys',
    deviceKeys.map((o) => o)
  )

  return {
    deviceHashesOfMyOwn: deviceKeysToParams(deviceKeys),
    // will only be sent if user opted in for iOS alerts
    optionalEncounters: (optionalEncountersWithiOSDevices || []).map(
      ({ hash, rssi, hits, time, duration }) => ({
        hash,
        rssi,
        hits,
        time,
        duration,
      })
    ),
  }
}

export function deviceKeysToParams(keys: DeviceKey[]): DeviceKeyParam[] {
  return (
    keys.map((deviceKey) => ({
      hash: sha256(deviceKey.key),
      password: deviceKey.password,
    })) || []
  )
}

// getDeviceKeys fetches the keys from realm where there is risk for an infection (1-14 days)
// it also removes device keys older than 14 days since they are not needed anymore
export async function getDeviceKeys(): Promise<DeviceKey[]> {
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
    if (!keys) {
      return []
    }
    return keys as any
  } catch (error) {
    console.log('getDeviceKeys', { error })
    return []
  }
}

const createDeviceKeyMutation = graphql`
  mutation DatabaseUtilsCreateDeviceKeyMutation(
    $deviceKey: DeviceKeyCreateInput!
  ) {
    createDeviceKey(input: $deviceKey) {
      ok
    }
  }
`
export async function getCurrentDeviceKeyOrRenew(): Promise<DeviceKey> {
  // check if device key exist for this date
  const currentDate = getAnonymizedTimestamp()
  const database = await getDatabase()
  const keys = database
    .objects(KeysSchema.name)
    .filtered(`time = ${currentDate}`)
  if (keys.length > 0) {
    return keys[0] as any
  }
  // beginningOfContactTracingUUID
  // lets generate and save a new DeviceKey
  // Save directly to backend so it cant't be claimed by some-one else who see's this UUID in bluetooth

  // TODO: create password
  // TODO: create new deviceKey and password
  //@ts-ignore

  const password = getRandomString()
  const newDeviceKey = generateBluetootTraceKey()
  const newDeviceHash = sha256(newDeviceKey)
  const time = getAnonymizedTimestamp()

  const deviceKey: DeviceKey = {
    id: 'id' + nanoid(),
    key: newDeviceKey,
    password,
    time,
  }

  // persist key on server
  commitMutation<DatabaseUtilsCreateDeviceKeyMutation>(RelayEnvironment, {
    mutation: createDeviceKeyMutation,
    variables: {
      deviceKey: {
        hash: newDeviceHash,
        password,
        time,
      },
    },
    onCompleted: async (response, errors) => {
      if (response && response.createDeviceKey && response.createDeviceKey.ok) {
        console.log('wrote device key and pass to database')
        database.write(() => {
          database.create(KeysSchema.name, deviceKey)
        })
        return deviceKey
      } else {
        console.log('response is not ok')
      }
    },
    onError: (err) => {
      // keep the old key till there is internet connection
      console.log('Could not renew device key', { err })
    },
  })

  // TODO: Show notification?
  console.log(
    'Use old device key since we could not renew it (probably internet connection)'
  )
  const previousKeys = database.objects(KeysSchema.name)
  if (previousKeys.length > 0) {
    return previousKeys[0] as any
  }

  // just crash

  throw Error('could not get a new device key')
}

// // syncDeviceKeys syncs the generated Bluetooth UUIDs with their password
// // so no-one can see infections from someone else
// export async function syncDeviceKeys() {
//   //
// }

export async function removeOldData(): Promise<boolean> {
  const oldEncountersRemoved = await removeOldEncounters()
  const oldDeviceKeysRemoved = await removeOldDeviceKeys()
  return oldEncountersRemoved && oldDeviceKeysRemoved
}

export async function removeOldDeviceKeys(): Promise<boolean> {
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
        duration: rssiValue.end - rssiValue.start,
        isIos: rssiValue.isIos,
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

function generateBluetootTraceKey() {
  let uuid: string = uuidv4()

  // let others devices know this is a contact tracing device
  const uuidParts = uuid.split('-')

  const contactTracingUUID = uuidParts
    .map((uuidPart, i) => {
      // e.g. we have uuid of dcef893e-f0b2-4ddc-80e6-cf4c11080848
      // and we want it to be dcef893e-c0d0-4ddc-80e6-cf4c11080848
      // or
      // and we want it to be dcef893e-c0d1-4ddc-80e6-cf4c11080848

      if (i === 1) {
        return secondPartOfContactTracingUUID
      }

      return uuidPart
    })
    .join('-')

  return contactTracingUUID
}
