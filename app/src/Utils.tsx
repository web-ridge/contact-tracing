import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'
import { Base64 } from 'js-base64'
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
import { v4 as uuidv4 } from 'uuid'
// export const contactTracingServiceUUID = '48464861-d2ea-434a-aa73-b5aaf343f701'

export const contactTracingKeyCharacteristicUUID =
  'bf6bdef8-6080-4507-bfbb-3fb3a83a8ea8'

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

// dateToUnix ..
export function dateToUnix(date: Date): number {
  return Math.round(date.getTime() / 1000)
}

const encryptionDatabaseKey = 'contactTractingEncryptionKey'

export async function getDatabaseEncryptionKey(): Promise<ArrayBuffer> {
  return getSecureKeyArrayBuffer(encryptionDatabaseKey, 64)
}

const encryptionDeviceUUIDKey = 'contactTractingDeviceUUID'
export async function getDeviceUUID(): Promise<string> {
  // 87253eb2
  // f508a9ea-d62b-4199-a196-41b62237ac45
  // ctrcwebr
  const uuid = await getSecureUUID(encryptionDeviceUUIDKey)

  // let others devices know this is a contact tracing device
  const uuidParts = uuid.split('-')
  const contactTracingUUID = uuidParts
    .map((uuidPart, i) => (i === 0 ? 'f508a9ea' : uuidPart))
    .join('-')
  // console.log(contactTracingUUID)
  return contactTracingUUID
}

async function getSecureKeyArrayBuffer(
  key: string,
  howManyBytes: number
): Promise<ArrayBuffer> {
  const stringKey = await getSecureKey(key, howManyBytes)
  const arrayBuffer = _base64ToArrayBuffer(stringKey)
  return arrayBuffer
}

async function getSecureUUID(key: string): Promise<string> {
  const exist = await RNSecureStorage.exists(key)
  if (exist) {
    const stringKey = await RNSecureStorage.get(key)
    if (stringKey) {
      return stringKey
    }
  }

  // key does not exist (yet)
  //@ts-ignore
  let uuid: string = uuidv4()
  // store so we can de-crypt next time
  await RNSecureStorage.set(key, uuid, {
    accessible: ACCESSIBLE.ALWAYS, // we need to write, even when device is in sleep mode
  })
  return uuid
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
