// WebRidge Design

import BLEPeripheral from 'react-native-ble-peripheral'
import { contactTracingServiceUUID, safeLog } from './Utils'

// startOrRefreshAdvertising registers an UUID which starts with an identifier
// so we know this device has the contact-tracing app
export async function startOrRefreshAdvertising(deviceKey: string) {
  // stop because we want to advertise with another device key
  // to maintain users privacy
  if (BLEPeripheral.isAdvertising()) {
    BLEPeripheral.stop()
  }

  // BLEPeripheral.setName(deviceKey)
  safeLog('started advertising Android', {
    contactTracingServiceUUID,
    deviceKey,
  })
  BLEPeripheral.addService(contactTracingServiceUUID, true) //for primary service
  BLEPeripheral.addService(deviceKey, false) //for primary service

  // BLEPeripheral.addCharacteristicToService()
  const response = await BLEPeripheral.start()
  safeLog('BLEPeripheral', { response })
  return
}

export async function stopAdvertising() {
  return BLEPeripheral.stop()
}
