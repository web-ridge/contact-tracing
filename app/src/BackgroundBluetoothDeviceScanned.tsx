// WebRidge Design

import { RSSICache, UUIDCache, PromiseCache } from './types'
import {
  getContactTracingIdFromServiceUUIDs,
  contactTracingServiceUUID,
  now,
  safeLog,
} from './Utils'
import {
  syncRSSICache,
  isIgnoredDevice,
  setIgnoredDevice,
} from './DatabaseUtils'
import { Device, BleError } from 'react-native-ble-plx'
import { Platform } from 'react-native'

// We don't want to write directly to database for every little change
// Keep some values in cache before writing it down
// only used on Android since iOS job need to close as soon as possible
let rssiCache: RSSICache = {}

// When an iOS device goes to background we need to scan for the UUID
// In order to save battery we cache those for some period
// only used on Android since iOS job need to close as soon as possible
let uuuidCache: UUIDCache = {}
let uuidResolverCache: PromiseCache = {}

export function clearCache() {
  rssiCache = {}
  uuuidCache = {}
  uuidResolverCache = {}
}

// sometimes the device is not close enough to obtain something so connection time outs
// if that is the case we retry later to see if device came closer
export function clearIdCache(device: Device) {
  delete uuidResolverCache[device.id]
  delete uuuidCache[device.id]
}

async function getiOSContactTracingIdByConnection(
  device: Device
): Promise<string | undefined | BleError> {
  try {
    const isIgnored = await isIgnoredDevice(device.id)
    if (isIgnored) {
      safeLog('ignored, not a contact tracing device', device.id)
      return undefined
    }

    // safeLog(device.id, Platform.OS, 'getiOSContactTracingIdByConnection')
    device = await device.connect({ autoConnect: false, timeout: 1000 * 3 })
    device = await device.discoverAllServicesAndCharacteristics()
    const characters = await device.characteristicsForService(
      contactTracingServiceUUID
    )

    const cUUIds = characters.map((c) => c.uuid)

    const contactTracingId = getContactTracingIdFromServiceUUIDs(cUUIds || [])
    if (contactTracingId) {
      safeLog(
        device.id,
        'found contact tracing id from iOS device on_' + Platform.OS,
        {
          contactTracingId,
        }
      )
    }
    return contactTracingId
  } catch (error) {
    safeLog(
      'setIgnoredDevice',
      'getiOSContactTracingIdByConnection' + Platform.OS,
      device.id,
      { error },
      error.reason
    )

    // save it as ignored since we could not scan this device
    await setIgnoredDevice(device.id)

    return error
  }
}

// getContactTracingUUID is used when someone's iPhone is in background and we still need
// to know the serviceUUIDs it checks cache to save battery
async function getiOSContactTracingIdByPromise(
  device: Device
): Promise<string | BleError | undefined> {
  // iOS local name is hidden in background so only pick hidden BLE devices ;-)
  // to prevent battery drain
  if (device.localName) {
    return undefined
  }
  if (uuidResolverCache[device.id]) {
    return uuidResolverCache[device.id]
  }
  uuidResolverCache[device.id] = new Promise((resolve, reject) => {
    if (uuidResolverCache[device.id]) {
      resolve(uuidResolverCache[device.id])
      return
    }
    // @ts-ignore
    uuidResolverCache[device.id] = getiOSContactTracingIdByConnection(device)
    resolve(uuidResolverCache[device.id])
    return
  })
  return uuidResolverCache[device.id]
}

// function shouldRetry(error: BleError) {
//   // services where not found so never try again ;)
//   if (error.errorCode > 300) {
//     return false
//   }
//   // make some exceptions
//   // TODO: maybe OperationTimedOut = 3,
//   // Need to verify in real life situtatoin
//   return false
// }

async function getiOSContactTracingId(
  device: Device
): Promise<string | undefined> {
  let uuidOrError = await getiOSContactTracingIdByPromise(device)
  let isString = typeof uuidOrError === 'string'

  if (isString) {
    return uuidOrError as string
  }
  // else if (shouldRetry(uuidOrError as BleError)) {
  //   // try again
  //   uuidOrError = await getiOSContactTracingIdByPromise(device)
  //   isString = typeof uuidOrError === 'string'
  //   if (isString) {
  //     return uuidOrError as string
  //   }
  // }

  // safeLog('Returning undefined')
  return undefined
}

// syncDevicesInMemoryToLocalDatabase writes scanned maps from memory to disk
// we don't do this real-time since it's CPU intensive task and we need to keep battery percentage low for adoption
// also hashing of BluetoothUUID is done inside that function
export async function syncDevicesInMemoryToLocalDatabase(): Promise<boolean> {
  const done = await syncRSSICache(rssiCache)
  if (done) {
    // clear in memory cache to prevent memory issues after a while
    clearCache()
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
      safeLog('local', { error })
    } else {
      safeLog('else', { error })
      throw error
    }
    return
  }

  // not relevant enough
  if (!scannedDevice || !scannedDevice.rssi || -70 > scannedDevice.rssi) {
    // safeLog(
    //   'not a valid contact tracing device',
    //   Platform.OS,
    //   scannedDevice && scannedDevice.id
    // )
    return
  }

  const scannedDeviceUUIDs = (scannedDevice.serviceUUIDs || []).concat(
    scannedDevice.overflowServiceUUIDs || []
  )
  let scannedDeviceUUID = getContactTracingIdFromServiceUUIDs(
    scannedDeviceUUIDs
  )

  // only iOS devices can find overflowServiceUUIDS, on Android we need to connect
  // to device to find it :(
  if (!scannedDeviceUUID && Platform.OS === 'android') {
    try {
      // safeLog(
      //   scannedDevice.id,
      //   'await getiOSContactTracingId(scannedDevice)',
      //   Platform.OS,
      //   scannedDeviceUUID
      // )
      scannedDeviceUUID = await getiOSContactTracingId(scannedDevice)
      // safeLog(scannedDevice.id, 'YESSSSSS', Platform.OS, scannedDeviceUUID)
    } catch (error) {
      safeLog(scannedDevice.id, 'Could not scan potential iOS device', {
        error,
      })
    }
  }

  if (!scannedDeviceUUID) {
    // safeLog(scannedDevice.id, 'could not fetch device ', { error })
    return
  }

  // we save the maximum RSSI and how many times the RSSI has changed
  const previousValue = rssiCache[scannedDeviceUUID]
  const latestRSSI = scannedDevice.rssi
  const didComeCloser = !previousValue || latestRSSI > previousValue.rssi
  if (didComeCloser) {
    rssiCache[scannedDeviceUUID] = previousValue
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

    safeLog('______________________________')
    safeLog(
      `[${Platform.OS} (my platform)] found a contact tracing uuid`,
      scannedDeviceUUID,
      rssiCache[scannedDeviceUUID]
    )
    safeLog('____________________________________________')
  }
}
