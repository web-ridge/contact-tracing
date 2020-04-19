import Peripheral, { Service } from 'react-native-peripheral'

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
  Peripheral.startAdvertising({
    name: '',
    serviceUuids: [deviceKey],
  })
}
