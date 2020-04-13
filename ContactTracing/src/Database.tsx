import Realm from 'realm'
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'
import RNSimpleCrypto from 'react-native-simple-crypto'

const encryptionKeyID = 'contactTractingEncryptionKey'

async function getEncryptionKey(): Promise<ArrayBuffer> {
  const exist = await RNSecureStorage.exists(encryptionKeyID)
  if (exist) {
    const stringKey = await RNSecureStorage.get(encryptionKeyID)
    console.log({ stringKey })
    if (stringKey) {
      return RNSimpleCrypto.utils.convertBase64ToArrayBuffer(stringKey)
    }
  }

  // key does not exist (yet)
  var randomKey = await RNSimpleCrypto.utils.randomBytes(64)

  console.log({ randomKey })
  // to string
  var randomKeyString = RNSimpleCrypto.utils.convertArrayBufferToBase64(
    randomKey
  )

  // store so we can de-crypt next time
  await RNSecureStorage.set(encryptionKeyID, randomKeyString, {
    accessible: ACCESSIBLE.ALWAYS, // we need to write, even when device is in sleep mode
  })

  // return
  return randomKey
}

export const EncounterSchema = {
  name: 'Encounter',
  primaryKey: 'hash',
  properties: {
    hash: 'string',
    rssi: { type: 'int', default: 0 },
    hits: { type: 'int', default: 0 },
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
