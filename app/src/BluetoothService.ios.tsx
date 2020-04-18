import Peripheral, { Service, Characteristic } from 'react-native-peripheral'
import {
  getDeviceKey,
  contactTracingServiceUUID,
  contactTracingKeyCharacteristicUUID,
} from './Utils'

export async function startAdvertising(deviceKey: string) {
  // first, define a characteristic with a value
  const ch = new Characteristic({
    uuid: contactTracingKeyCharacteristicUUID,
    value: deviceKey, // Base64-encoded string
    properties: ['read'],
    permissions: ['readable'],
  })

  // add the characteristic to a service
  const service = new Service({
    uuid: contactTracingServiceUUID,
    characteristics: [ch],
  })

  // register GATT services that your device provides
  await Peripheral.addService(service)

  // start advertising to make your device discoverable
  Peripheral.startAdvertising({
    name: '-',
    serviceUuids: [contactTracingServiceUUID],
  })
}
