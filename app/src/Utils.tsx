// WebRidge Design

import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'
import { Base64 } from 'js-base64'
import 'react-native-get-random-values'
import { Platform } from 'react-native'
import {
  check,
  request,
  PERMISSIONS,
  Permission,
} from 'react-native-permissions'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler'

export function safeLog(message?: any, ...optionalParams: any[]): void {
  // @ts-ignore
  if (process.env.NODE_ENV === 'development') {
    console.log(message, ...optionalParams)
  }
}

// these are used to identify contact tracing device based on service UUID (Contact Tracing Device (Andriod | IOS))
export const contactTracingServiceUUID = '00001200-0000-1000-8000-00805f9b34fb'

export const secondPartOfContactTracingUUID = 'c0d0'

//getAnonymizedTimestamp removes hours seconds and milli seconds so only date is left
// this is more anonymous since nobody can possible prove that you met someone on that specific time
// only the date
export function getAnonymizedTimestamp(): number {
  let date = new Date()
  date.setHours(0, 0, 0, 0) // remove hours, minutes, seconds and miliseconds to anonomize timestamp
  return dateToUnix(date)
}

const twoWeeksInJavascript = 12096e5

export function getStartOfRiskUnix(): number {
  const date = new Date(Date.now() - twoWeeksInJavascript)
  date.setHours(0, 0, 0, 0) // remove hours, minutes, seconds and miliseconds to anonomize timestamp
  return dateToUnix(date)
}

// getExpireDateOfDeviceKey is used to detect when new device key should be created
export function getExpireDateOfDeviceKey(): number {
  const date = new Date()
  return dateToUnix(date) - 60 * 60 * 2 // 2 hour a.t.m.
}

// getMaxExpireDateOfDeviceKey is used to show alert when device has no internet and
// it that takes too long we take action to force to renew it or else stop
export function getMaxExpireDateOfDeviceKey(): number {
  const date = new Date()
  return dateToUnix(date) - 60 * 60 * 24 // 24 hour a.t.m.
}

// now function is used to calculate duration of encounter in app (backend does not know start and stop)
export function now(): number {
  const date = new Date()
  return dateToUnix(date)
}

// dateToUnix ..
export function dateToUnix(date: Date): number {
  return Math.round(date.getTime() / 1000)
}

export const encryptionDatabaseKey = 'contactTractingEncryptionKey'

export async function getDatabaseEncryptionKey(): Promise<ArrayBuffer> {
  const secureKeyArrayBuffer = getSecureKeyArrayBuffer(
    encryptionDatabaseKey,
    64
  )
  safeLog({ secureKeyArrayBuffer })
  return secureKeyArrayBuffer
}

async function getSecureKeyArrayBuffer(
  key: string,
  howManyBytes: number
): Promise<ArrayBuffer> {
  const stringKey = await getSecureKey(key, howManyBytes)
  const arrayBuffer = _base64ToArrayBuffer(stringKey)
  return arrayBuffer
}

async function getSecureKey(
  key: string,
  howManyBytes: number
): Promise<string> {
  const exist = await RNSecureStorage.exists(key)
  safeLog('getSecureKey', { exist })

  if (exist) {
    const stringKey = await RNSecureStorage.get(key)
    if (stringKey) {
      safeLog('got string from secure storage', { stringKey })

      return stringKey
    }
  }
  safeLog('key does not exist (yet)')

  // key does not exist (yet)
  var array = new Uint8Array(howManyBytes)
  safeLog('new Uint8Array', array, howManyBytes)

  //@ts-ignore
  var randomArrayBuffer = crypto.getRandomValues(array)

  // to string
  var randomKeyString = _arrayBufferToBase64(randomArrayBuffer)
  safeLog('randomKeyString', randomKeyString)

  // store so we can de-crypt next time
  const secureValue = await RNSecureStorage.set(key, randomKeyString, {
    accessible: ACCESSIBLE.ALWAYS, // we need to write, even when device is in sleep mode
  })
  safeLog('secured storage', { secureValue })

  return secureValue || randomKeyString
}

export function getRandomString() {
  var array = new Uint8Array(50)
  console.log({ array })
  //@ts-ignore
  var randomArrayBuffer = crypto.getRandomValues(array)
  console.log({ randomArrayBuffer })
  var randomKeyString = _arrayBufferToBase64(randomArrayBuffer)
  console.log({ randomKeyString })
  return randomKeyString
}

function _arrayBufferToBase64(buffer: ArrayBuffer): string {
  var binary = ''
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return Base64.btoa(binary)
}
function _base64ToArrayBuffer(base64: string): ArrayBuffer {
  var binary_string = Base64.atob(base64)
  var len = binary_string.length
  var bytes = new Uint8Array(len)
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i)
  }
  return bytes.buffer
}

const bluetoothPermission: Permission = Platform.select({
  ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
})!

export async function requestBluetoothStatus() {
  // can be done in parallel
  let bluetoothStatus = await check(bluetoothPermission)
  if (bluetoothStatus === 'denied') {
    bluetoothStatus = await request(bluetoothPermission)
  }
  return bluetoothStatus
}

export async function requestLocationAccess(): Promise<boolean> {
  try {
    const data = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded(
      { interval: 10000, fastInterval: 5000 }
    )
    return data === 'already-enabled' || data === 'enabled'
  } catch (e) {
    console.log({ e })
    return false
  }
}

export function commitMutation(
  environment: Environment,
  options: CommitMutationOptions
) {
  return new Promise((resolve, reject) => {
    commitMutationDefault(environment, {
      ...options,
      onError: (error: Error) => {
        reject(error)
      },
      onCompleted: (response: object) => {
        resolve(response)
      },
    })
  })
}
