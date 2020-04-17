import { RSSIMap } from './types'
import { syncRSSIMap } from './DatabaseUtils'
import { Device, BleError } from 'react-native-ble-plx'

let rssiValues: RSSIMap = {}

// every 15 minutes
const hour = 1 * 1000 * 60 * 60
const minute = 1 * 1000 * 60
export const jobInterval = Math.round(hour / 4)

export async function syncMap() {
  console.log({ rssiValues })
  const done = await syncRSSIMap(rssiValues)
  if (done) {
    console.log('syncing rrsi values done')
    rssiValues = {}
  } else {
    console.log('syncing rrsi not done')
  }
}

export function deviceScanned(
  error: BleError | null,
  scannedDevice: null | Device
) {
  if (error) {
    console.log('error while scanning device', { error })
    return
  }

  // not relevant
  if (!scannedDevice || !scannedDevice.rssi || -100 > scannedDevice.rssi) {
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
      console.log('changed', scannedDevice.id, rssiValues[scannedDevice.id])
    }
  }
}
