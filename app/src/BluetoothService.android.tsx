import BLEPeripheral from 'react-native-ble-peripheral'
import {
  contactTracingServiceUUID,
  contactTracingKeyCharacteristicUUID,
} from './Utils'

export async function startAdvertising(deviceKey: string) {
  try {
    BLEPeripheral.addService(contactTracingServiceUUID, true) //for primary service
    BLEPeripheral.addCharacteristicToService(
      contactTracingServiceUUID,
      contactTracingKeyCharacteristicUUID,
      2,
      2,
      deviceKey
    ) //this is a Characteristic with read property

    // register GATT services that your device provides
    BLEPeripheral.setName('-')
    const response = await BLEPeripheral.start()

    console.log({ response })
  } catch (e) {
    console.log({ e })
  }

  return
}
function strToUtf16Bytes(str: string): any {
  const bytes = []
  for (let ii = 0; ii < str.length; ii++) {
    const code = str.charCodeAt(ii) // x00-xFFFF
    bytes.push(code & 255, code >> 8) // low, high
  }
  return bytes
}
