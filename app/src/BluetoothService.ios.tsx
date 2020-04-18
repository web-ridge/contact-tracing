import Peripheral, { Service, Characteristic } from 'react-native-peripheral'

export async function startAdvertising(deviceKey: string) {
  // add the characteristic to a service
  const service = new Service({
    uuid: deviceKey,
  })

  // register GATT services that your device provides
  await Peripheral.addService(service)

  // start advertising to make your device discoverable
  Peripheral.startAdvertising({
    name: '-',
    serviceUuids: [deviceKey],
  })
}
