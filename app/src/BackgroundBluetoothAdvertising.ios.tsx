// // WebRidge Design

import Peripheral, { Characteristic, Service } from 'react-native-peripheral'
import { contactTracingServiceUUID, safeLog } from './Utils'

// startOrRefreshAdvertising registers an UUID which starts with an identifier
// so we know this device has the contact-tracing app
export async function startOrRefreshAdvertising(deviceKey: string) {
  // stop because we want to advertise with another device key
  // to maintain users privacy
  if (Peripheral.isAdvertising()) {
    await Peripheral.stopAdvertising()
  }

  const ch = new Characteristic({
    uuid: deviceKey,
    value: '', // Base64-encoded string
    properties: ['read'],
    permissions: ['readable'],
  })
  const service = new Service({
    uuid: contactTracingServiceUUID,
    characteristics: [ch],
  })

  // register GATT services that your device provides
  await Peripheral.addService(service)

  // start advertising to make your device discoverable
  // the contactTracingServiceUUID is only visible for other iOS devices and not for Android devices
  await Peripheral.startAdvertising({
    name: '',
    serviceUuids: [contactTracingServiceUUID, deviceKey],
  })

  safeLog('started advertising iOS with deviceKey', deviceKey)
}
export async function stopAdvertising() {
  if (Peripheral.isAdvertising()) {
    // await Peripheral.removeAllServices()
    return await Peripheral.stopAdvertising()
  }
}
