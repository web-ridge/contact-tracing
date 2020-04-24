// WebRidge Design
import PushNotification from 'react-native-push-notification'
import { RSSICache, Encounter, DeviceKey } from './types'
import {
  getDatabase,
  EncounterSchema,
  KeysSchema,
  IgnoredDeviceSchema,
} from './Database'
import { sha256 } from 'js-sha256'
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
import { commitMutation, graphql } from 'react-relay'

import {
  getAnonymizedTimestamp,
  getStartOfRiskUnix,
  getRandomString,
  getExpireDateOfDeviceKey,
  getMaxExpireDateOfDeviceKey,
  now,
  safeLog,
  createContactTracingId,
} from './Utils'

import RelayEnvironment from './RelayEnvironment'
import {
  InfectionAlertsQueryVariables,
  DeviceKeyParam,
} from './__generated__/InfectionAlertsQuery.graphql'
import { DatabaseUtilsCreateDeviceKeyMutation } from './__generated__/DatabaseUtilsCreateDeviceKeyMutation.graphql'
import { Platform } from 'react-native'

export async function removeAllEncounters(): Promise<boolean> {
  try {
    const database = await getDatabase()
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
  try {
    const database = await getDatabase()
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
export async function getCurrentDeviceKeyOrRenew(): Promise<
  DeviceKey | undefined
> {
  const database = await getDatabase()

  // check if device key exist for this date
  const expireUnix = getExpireDateOfDeviceKey()

  // device keys which are not expired yet
  const keys = database
    .objects(KeysSchema.name)
    .filtered(`internalTime > ${expireUnix} SORT(internalTime DESC) LIMIT(1)`)

  if (keys.length > 0) {
    return keys[0] as any
  }

  // no key found
  // lets generate and save a new DeviceKey
  // Save directly to backend so it cant't be claimed by some-one else who see's this UUID in bluetooth

  // create new deviceKey and password
  const password = getRandomString()
  const newDeviceKey = createContactTracingId()
  const newDeviceHash = sha256(newDeviceKey)

  const anomizedDateUnix = getAnonymizedTimestamp()

  const deviceKey: DeviceKey = {
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
      onCompleted: (response, errors) => {
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
        console.log('DatabaseUtils getCurrentDeviceKeyOrRenew onError', { err })
        throw Error('no device key')
      },
    })
  } catch (error) {
    // use old device key for max period of time since user could have
    // no internet connection for a while
    const previousKeys = database
      .objects(KeysSchema.name)
      .filtered('SORT(internalTime DESC) LIMIT(1)')

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
    return undefined
  }
  return undefined
}

// // syncDeviceKeys syncs the generated Bluetooth UUIDs with their password
// // so no-one can see infections from someone else
// export async function syncDeviceKeys() {
//   //
// }

export async function removeOldData(): Promise<boolean> {
  const oldEncountersRemoved = await removeOldEncounters()
  const oldDeviceKeysRemoved = await removeOldDeviceKeys()
  const oldIgnoredDevicesRemoved = await removeOldIgnoredDevices()
  return (
    oldEncountersRemoved && oldDeviceKeysRemoved && oldIgnoredDevicesRemoved
  )
}

export async function removeOldDeviceKeys(): Promise<boolean> {
  try {
    const database = await getDatabase()
    database.write(() => {
      database.delete(
        database
          .objects(KeysSchema.name)
          .filtered(`internalTime < ${getStartOfRiskUnix()}`)
      )
    })
    return true
  } catch (error) {
    console.log({ error })
    return false
  }
}

export async function setIgnoredDevice(bluetoothId: string): Promise<boolean> {
  try {
    const database = await getDatabase()
    database.write(() => {
      database.create(IgnoredDeviceSchema.name, {
        bluetoothId,
        time: getAnonymizedTimestamp(),
      })
    })
    return false
  } catch (error) {
    console.log('could not setIgnoredDevice', { error })
    return false
  }
}

// We don't want to check bluetooth devices to check if this device is a contact tracing device
// Let's check if this a ignored device (e.g. at home your local machines would not need to be checked) everytime
export async function isIgnoredDevice(bluetoothId: string): Promise<boolean> {
  try {
    const database = await getDatabase()
    const objects = database
      .objects(IgnoredDeviceSchema.name)
      .filtered(`bluetoothId = '${bluetoothId}' LIMIT(1)`)
    if (objects && objects.length > 0) {
      return true
    }
    return false
  } catch (error) {
    console.log('isIgnoredDevice', { error })
    return false
  }
}

export async function removeOldIgnoredDevices(): Promise<boolean> {
  try {
    const database = await getDatabase()
    database.write(() => {
      database.delete(
        database
          .objects(IgnoredDeviceSchema.name)
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
  try {
    const database = await getDatabase()
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

// getRiskyEncountersOfLastTwoWeeks gets encounters which were riskfulle enough to create infection
export async function getRiskyEncountersOfLastTwoWeeks(): Promise<Encounter[]> {
  try {
    const database = await getDatabase()
    let encounters = database
      .objects(EncounterSchema.name)
      .filtered(`time > ${getStartOfRiskUnix()}`)
    // TODO: add duration as filter here so we don't send too much useless data to server

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

export async function syncRSSICache(rssiCache: RSSICache): Promise<boolean> {
  const database = await getDatabase()
  const dateTime = getAnonymizedTimestamp()

  const encountersFromMemoryMap: Encounter[] = Object.keys(rssiCache).map(
    (contactTracingDeviceUUID) => {
      const rssiValue = rssiCache[contactTracingDeviceUUID]
      const hash = sha256(contactTracingDeviceUUID)
      return {
        id: 'id' + nanoid(),
        hash,
        rssi: rssiValue.rssi,
        hits: rssiValue.hits,
        time: dateTime,
        duration:
          rssiValue.end - rssiValue.start + (Platform.OS === 'ios' ? 10 : 0), // +10 because iOS devices are limited in their memory
      }
    }
  )

  safeLog({ encountersFromMemoryMap })

  // get other devices in our database with the same hash (hash could be available for min 1 hour / and max 1 day if user does not have internet)
  // so the more we can group them together the more reliable it is
  let otherEncountersWhereHashIs: Encounter[] = []
  if (encountersFromMemoryMap.length > 0) {
    const filterQuery = [
      `(${encountersFromMemoryMap
        .map((e) => `hash = '${e.hash}'`)
        .join(' OR ')})`,
      `time = ${dateTime}`,
    ].join(' AND ')
    safeLog({ filterQuery })
    const otherEncountersWhereHashIs = (database
      .objects(EncounterSchema.name)
      .filtered(filterQuery) as unknown) as Encounter[]

    safeLog({ otherEncountersWhereHashIs })
  }

  const objectsToCreate = encountersFromMemoryMap.map((newEncounter) => {
    const oldEncounter = otherEncountersWhereHashIs.find(
      (old) => old.hash === newEncounter.hash
    )

    // we know this is the same person because is hash has not changed yet
    if (oldEncounter) {
      return {
        id: oldEncounter.hash,
        hash: oldEncounter.hash,
        rssi: Math.max(oldEncounter.rssi, newEncounter.rssi),
        hits: oldEncounter.hits + newEncounter.hits,
        time: dateTime,
        duration: oldEncounter.duration + newEncounter.duration,
      }
    }
    // this hash is not seen before in database
    // could be the same person but his hash did change
    return {
      id: 'id' + nanoid(),
      hash: newEncounter.hash,
      rssi: newEncounter.rssi,
      hits: newEncounter.hits,
      time: dateTime,
      duration: newEncounter.duration,
    }
  })

  safeLog({ objectsToCreate })

  try {
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
