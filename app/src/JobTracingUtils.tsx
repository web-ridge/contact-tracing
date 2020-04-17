import { RSSIMap } from './types'
import { syncRSSIMap } from './DatabaseUtils'
import { Device, BleError } from 'react-native-ble-plx'

export let rssiValues: RSSIMap = {}

export async function syncMap() {
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
    console.log('devicescan', { error })
    return
  }

  // not relevant
  if (!scannedDevice || !scannedDevice.rssi || -100 > scannedDevice.rssi) {
    console.log('devices not good enough', { scannedDevice })
    return
  }

  // we map rssi values so we can see if device did come closer
  // Closer to zero is better!
  // -50 (min 50) fairly good,
  // -70 (min 70) good
  // -100 bleghh

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

    console.log('changed', scannedDevice.id, rssiValues[scannedDevice.id])
  }
}
