import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'
import { Base64 } from 'js-base64'
import 'react-native-get-random-values'

export const beginningOfContactTracingUUID = 'f508a9ea'

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

// now function is used to calculate duration of encounter in app (backend does not know start and stop)
export function now(): number {
  const date = new Date()
  return dateToUnix(date)
}

// dateToUnix ..
export function dateToUnix(date: Date): number {
  return Math.round(date.getTime() / 1000)
}

const encryptionDatabaseKey = 'contactTractingEncryptionKey'

export async function getDatabaseEncryptionKey(): Promise<ArrayBuffer> {
  return getSecureKeyArrayBuffer(encryptionDatabaseKey, 64)
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
  if (exist) {
    const stringKey = await RNSecureStorage.get(key)
    if (stringKey) {
      return stringKey
    }
  }

  // key does not exist (yet)
  var array = new Uint8Array(howManyBytes)

  //@ts-ignore
  var randomArrayBuffer = crypto.getRandomValues(array)

  // to string
  var randomKeyString = _arrayBufferToBase64(randomArrayBuffer)
  console.log({ randomKeyString })

  // store so we can de-crypt next time
  await RNSecureStorage.set(key, randomKeyString, {
    accessible: ACCESSIBLE.ALWAYS, // we need to write, even when device is in sleep mode
  })

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
