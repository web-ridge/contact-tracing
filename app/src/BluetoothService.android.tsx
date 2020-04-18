import BLEPeripheral from 'react-native-ble-peripheral'

// startAdvertising registers an UUID which starts with an identifier
// so we know this device has the contact-tracing app
export async function startAdvertising(deviceKey: string) {
  // stop because we want to advertise with another device key
  // to maintain users privacy
  if (BLEPeripheral.isAdvertising()) {
    BLEPeripheral.stop()
  }

  BLEPeripheral.addService(deviceKey, true) //for primary service
  BLEPeripheral.setName('')
  const response = await BLEPeripheral.start()
  console.log({ response })
  return
}
