// WebRidge Design

import Peripheral, { Service } from 'react-native-peripheral'
import { contactTracingServiceUUID, safeLog } from './Utils'

// startAdvertising registers an UUID which starts with an identifier
// so we know this device has the contact-tracing app
export async function startAdvertising(deviceKey: string) {
  // stop because we want to advertise with another device key
  // to maintain users privacy
  if (Peripheral.isAdvertising()) {
    await Peripheral.stopAdvertising()
  }

  // add the characteristic to a service
  const service = new Service({
    uuid: deviceKey,
  })

  // register GATT services that your device provides
  await Peripheral.addService(service)

  // start advertising to make your device discoverable
  await Peripheral.startAdvertising({
    name: '',
    serviceUuids: [deviceKey, contactTracingServiceUUID],
  })
  safeLog('started advertising iOS with deviceKey', deviceKey)
}
