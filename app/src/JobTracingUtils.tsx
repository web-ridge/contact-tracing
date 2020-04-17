import { RSSIMap } from './types'
import { syncRSSIMap } from './DatabaseUtils'
import { Device, BleError } from 'react-native-ble-plx'
import { BleManager } from 'react-native-ble-plx'
import Base64 from './Base64'

let rssiValues: RSSIMap = {}

// every 15 minutes
const hour = 1 * 1000 * 60 * 60
const minute = 1 * 1000 * 60
export const jobInterval = //@ts-ignore
  process.env.NODE_ENV === 'development'
    ? Math.round(hour / 4)
    : Math.round(hour / 4)

export async function syncMap(): Promise<boolean> {
  console.log({ rssiValues })
  const done = await syncRSSIMap(rssiValues)
  if (done) {
    console.log('syncing rrsi values done')
    rssiValues = {}
    return true
  } else {
    console.log('syncing rrsi not done')
  }
  return false
}

export async function deviceScanned(
  error: BleError | null,
  scannedDevice: null | Device,
  bleManager: BleManager
) {
  if (error) {
    throw error
  }

  // not relevant
  if (!scannedDevice || !scannedDevice.rssi || -70 > scannedDevice.rssi) {
    console.log('not valid device', scannedDevice && scannedDevice.id)
    return
  }

  // we save the maximum RSSI and how many times the RSSI has changed
  const previousValue = rssiValues[scannedDevice.id]
  const latestRSSI = scannedDevice.rssi
  const didComeCloser = !previousValue || latestRSSI > previousValue.rssi

  if (didComeCloser) {
    rssiValues[scannedDevice.id] = previousValue
      ? {
          rssi:
            latestRSSI > previousValue.rssi ? latestRSSI : previousValue.rssi,
          hits: previousValue.hits + 1,
        }
      : {
          rssi: latestRSSI,
          hits: 1,
        }

    // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
      console.log(
        'changed',
        scannedDevice.id,
        scannedDevice.manufacturerData,
        scannedDevice.mtu,
        scannedDevice.name,
        scannedDevice.localName,
        rssiValues[scannedDevice.id]
      )
    }
  }

  // if many hits exchange keys
  const hits = rssiValues[scannedDevice.id].hits
  console.log({ serviceUUIDs: scannedDevice.serviceUUIDs })

  // if (hits < 10) {
  //   console.log('hits too low', scannedDevice.id, hits)
  //   return
  // }

  console.log('lets exchange keys')

  let isConnected = await scannedDevice.isConnected()
  if (!isConnected) {
    scannedDevice = await scannedDevice.connect()
  }
  isConnected = await scannedDevice.isConnected()
  if (!isConnected) {
    console.log('not connected', { scannedDevice })
    return
  }
  console.log('conncted try to exchange key!', {})

  try {
    const servicesAndMore = await scannedDevice.discoverAllServicesAndCharacteristics()
    console.log('servicesAndMore!!', { servicesAndMore })

    // read from other device
    const readCharacteristic = await servicesAndMore.readCharacteristicForService(
      '12ab',
      '34cd'
    ) // assuming the device is already connected

    console.log({ readValue: readCharacteristic.value })

    // write unique id to each other
    const characteristic = await servicesAndMore.writeCharacteristicWithResponseForService(
      '12ab',
      '34cd',
      'aGVsbG8gbWlzcyB0YXBweQ=='
    )

    console.log('characteristic.deviceID', characteristic.deviceID)

    console.log({ characteristic })
  } catch (e) {
    console.log('could not connect', e)
  }
}
