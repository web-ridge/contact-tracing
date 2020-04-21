// WebRidge Design
import PushNotification from 'react-native-push-notification'
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
  getExpireDateOfDeviceKey,
  getMaxExpireDateOfDeviceKey,
  now,
  safeLog,
  commitMutationPromise,
} from './Utils'
import { v4 as uuidv4 } from 'uuid'
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

export async function getInfectedEncountersQueryVariables(): Promise<
  InfectionAlertsQueryVariables
> {
  let deviceKeys = await getDeviceKeys()
  safeLog('getInfectedEncountersQueryVariables deviceKeys', deviceKeys)

  let deviceHashesOfMyOwn = deviceKeysToParams(deviceKeys)
  safeLog(
    'getInfectedEncountersQueryVariables deviceHashesOfMyOwn',
    deviceHashesOfMyOwn
  )
  return {
    deviceHashesOfMyOwn,
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
          .filtered(`internalTime < ${getExpireDateOfDeviceKey()}`)
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
  const expireUnix = getExpireDateOfDeviceKey()
  const database = await getDatabase()

  // device keys which are not expired yet
  const keys = database
    .objects(KeysSchema.name)
    .filtered(`internalTime > ${expireUnix}`)

  if (keys.length > 0) {
    return keys[0] as any
  }

  // no key found
  // lets generate and save a new DeviceKey
  // Save directly to backend so it cant't be claimed by some-one else who see's this UUID in bluetooth

  // create new deviceKey and password
  const password = getRandomString()
  const newDeviceKey = generateBluetootTraceKey()
  const newDeviceHash = sha256(newDeviceKey)

  const anomizedDateUnix = getAnonymizedTimestamp()

  const deviceKey: DeviceKey = {
    id: 'id' + nanoid(),
    key: newDeviceKey,
    password,
    internalTime: now(),
    externalTime: anomizedDateUnix,
  }

  // persist key on server
  try {
    commitMutation<DatabaseUtilsCreateDeviceKeyMutation>(RelayEnvironment, {
      mutation: createDeviceKeyMutation,
      variables: {
        deviceKey: {
          hash: newDeviceHash,
          password,
          time: anomizedDateUnix, // only date no time saved
        },
      },
      onCompleted: async (response, errors) => {
        if (
          response &&
          response.createDeviceKey &&
          response.createDeviceKey.ok
        ) {
          console.log('wrote device key and pass to database')
          database.write(() => {
            database.create(KeysSchema.name, deviceKey)
          })

          // we return device key here
          return deviceKey
        }
        throw Error('no device key')
      },
      onError: (err) => {
        throw Error('no device key')
      },
    })
  } catch (error) {
    // use old device key for max period of time since user could have
    // no internet connection for a while
    const previousKeys = database.objects(KeysSchema.name)
    if (previousKeys.length > 0) {
      safeLog(
        'Use old device key since we could not renew it (probably internet connection)'
      )
      PushNotification.localNotification({
        largeIcon: 'ic_stat_info', // (optional) default: "ic_launcher"
        smallIcon: 'ic_stat_info', // (optional) default: "ic_notification" with fallback for "ic_launcher"
        title: 'Privacy waarschuwing', // (optional)
        message:
          'Zet je internet aan om je anomiteit beter te kunnen waarborgen', // (required)
        priority: 'default',
        visibility: 'private',
        importance: 'default',
        playSound: false,
      })
      const found = (previousKeys[0] as unknown) as DeviceKey

      // e.g. 14.5 oktober vs 15 oktober
      if (found.internalTime < getMaxExpireDateOfDeviceKey()) {
        // Key is still somewhat valid
        return found
      }
    }

    // no device key could be found or is really too old
    PushNotification.localNotification({
      largeIcon: 'ic_stat_info', // (optional) default: "ic_launcher"
      smallIcon: 'ic_stat_info', // (optional) default: "ic_notification" with fallback for "ic_launcher"

      title: 'Privacycontrole', // (optional)
      message: 'Open de app om je unieke nummer te vernieuwen via internet', // (required)
      // subText: 'This is a subText', // (optional) default: none
      priority: 'high',
      visibility: 'private', // (optional) set notification visibility, default: private
      importance: 'high',
      playSound: true,
      // repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
      // actions: '["Yes", "No"]',
    })
    // just crash
    throw Error('could not get a new device key')
  }
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
        // isIos: rssiValue.isIos,
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
      // so we know the user has accepted the terms
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
