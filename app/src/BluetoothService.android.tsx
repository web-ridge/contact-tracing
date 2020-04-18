import BLEPeripheral from 'react-native-ble-peripheral'

export async function startAdvertising(deviceUUID: string) {
  BLEPeripheral.addService(deviceUUID, true) //for primary service
  BLEPeripheral.setName('')
  const response = await BLEPeripheral.start()
  console.log({ response })
  return
}
