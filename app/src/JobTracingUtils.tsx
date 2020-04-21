// WebRidge Design

import { RSSIMap } from './types'
import {
  secondPartOfContactTracingUUID,
  contactTracingServiceUUID,
  now,
  safeLog,
} from './Utils'
import { syncRSSIMap } from './DatabaseUtils'
import { Device, BleError, BleManager } from 'react-native-ble-plx'
import { Platform } from 'react-native'
import { Characteristic } from 'react-native-peripheral'

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
  // manager: BleManager
) {
  // console.log('deviceScanned', Platform.OS)
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
  if (
    !scannedDevice ||
    !scannedDevice.rssi ||
    -70 > scannedDevice.rssi ||
    !scannedDevice.serviceUUIDs
  ) {
    // safeLog(
    //   'not a valid contact tracing device',
    //   scannedDevice && scannedDevice.id
    // )
    return
  }

  // console.log('scannedDevice.serviceUUIDs', scannedDevice.serviceUUIDs)
  // detect if device is contact tracing device
  // console.log(Platform.OS, { scannedDevice })

  // console.log({ isAndroid, scannedDevice })
  // const isAndroid: boolean = !!scannedDevice?.localName?.includes('-')
  // console.log({ isAndroid, scannedDevice })

  const scannedDeviceUUID = (scannedDevice.serviceUUIDs || []).find((uuid) =>
    uuid
      .split('-')
      .some((part, i) => i === 1 && part === secondPartOfContactTracingUUID)
  )

  if (!scannedDeviceUUID) {
    safeLog(Platform.OS, 'no device uuid found', scannedDevice.serviceUUIDs)
    return
  }

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

    safeLog(
      'changed_',
      Platform.OS,
      scannedDeviceUUID,
      // scannedDevice.manufacturerData,
      // scannedDevice.mtu,
      // scannedDevice.name,
      // scannedDevice.localName,
      rssiValues[scannedDeviceUUID]
    )
  }
}
