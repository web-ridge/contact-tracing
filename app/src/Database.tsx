import Realm from 'realm'
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'
import RNSimpleCrypto from 'react-native-simple-crypto'
import Base64 from './Base64'
const encryptionKeyID = 'contactTractingEncryptionKey'

async function getEncryptionKey(): Promise<ArrayBuffer> {
  const exist = await RNSecureStorage.exists(encryptionKeyID)
  console.log({ exist })
  if (exist) {
    const stringKey = await RNSecureStorage.get(encryptionKeyID)
    console.log({ stringKey })

    if (stringKey && stringKey.length > 0) {
      return Uint8Array.from(Base64.atob(stringKey), (c) => c.charCodeAt(0))
    }
  }

  // key does not exist (yet)
  var randomArrayBuffer = await RNSimpleCrypto.utils.randomBytes(64)

  console.log({ randomArrayBuffer })
  // to string
  var randomKeyString = RNSimpleCrypto.utils.convertArrayBufferToBase64(
    randomArrayBuffer
  )

  // store so we can de-crypt next time
  await RNSecureStorage.set(encryptionKeyID, randomKeyString, {
    accessible: ACCESSIBLE.ALWAYS, // we need to write, even when device is in sleep mode
  })

  return randomArrayBuffer
}

export const EncounterSchema = {
  name: 'Encounter',
  primaryKey: 'id',
  properties: {
    id: 'string', // primary key
    hash: 'string',
    rssi: { type: 'int', default: 0 },
    hits: { type: 'int', default: 0 },
    time: { type: 'int', default: 0 },
  },
}

let realm: Realm | undefined

export async function getDatabase(): Promise<Realm> {
  // if already exist in memory let's return that database
  if (realm) {
    return realm
  }

  const encryptionKey = await getEncryptionKey()
  console.log({ encryptionKey })
  realm = new Realm({ schema: [EncounterSchema], encryptionKey })
  return realm
}
