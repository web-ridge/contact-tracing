import { RSSIMap } from './types'
import { beginningOfContactTracingUUID, now } from './Utils'
import { syncRSSIMap } from './DatabaseUtils'
import { Device, BleError } from 'react-native-ble-plx'

let rssiValues: RSSIMap = {}

// every 15 minutes
const hour = 1 * 1000 * 60 * 60
const minute = 1 * 1000 * 60
export const jobInterval = //@ts-ignore
  process.env.NODE_ENV === 'development'
    ? Math.round(minute)
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
  scannedDevice: null | Device
) {
  if (error) {
    if (error.errorCode >= 200) {
      console.log('local', { error })
    } else {
      console.log('else', { error })
      throw error
    }
    return
  }

  // not relevant
  if (!scannedDevice || !scannedDevice.rssi || -70 > scannedDevice.rssi) {
    console.log('not valid device', scannedDevice && scannedDevice.id)
    return
  }

  const scannedDeviceUUID = (
    scannedDevice.serviceUUIDs || []
  ).find((su: string) => su.startsWith(beginningOfContactTracingUUID))

  if (!scannedDeviceUUID) {
    console.log(
      'not a contact tracing device',
      scannedDevice && scannedDeviceUUID
    )
    return
  }
  console.log({ scannedDeviceUUID })

  // we save the maximum RSSI and how many times the RSSI has changed
  const previousValue = rssiValues[scannedDeviceUUID]
  const latestRSSI = scannedDevice.rssi
  const didComeCloser = !previousValue || latestRSSI > previousValue.rssi

  if (didComeCloser) {
    rssiValues[scannedDeviceUUID] = previousValue
      ? {
          rssi:
            latestRSSI > previousValue.rssi ? latestRSSI : previousValue.rssi,
          hits: previousValue.hits + 1,
          start: previousValue.start,
          end: now(),
        }
      : {
          rssi: latestRSSI,
          hits: 1,
          start: now(),
          end: now(),
        }

    // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
      console.log(
        'changed',
        scannedDeviceUUID,
        scannedDevice.manufacturerData,
        scannedDevice.mtu,
        scannedDevice.name,
        scannedDevice.localName,
        rssiValues[scannedDeviceUUID]
      )
    }
  }
}
