// WebRidge Design

import { BleManager, BleError, Device } from 'react-native-ble-plx'
import {
  deviceScanned,
  syncDevicesInMemoryToLocalDatabase,
} from './BackgroundBluetoothDeviceScanned'
import { stopAdvertising } from './BackgroundBluetoothAdvertising'
import { contactTracingServiceUUID, safeLog, now } from './Utils'
import {
  refreshJob,
  refreshAdvertiseService,
  taskOptions,
} from './BackgroundJobFunctions'
import Peripheral from 'react-native-peripheral'
import BackgroundService from 'react-native-background-actions'
import AsyncStorage from '@react-native-community/async-storage'

let m: undefined | BleManager
function getManager(): BleManager {
  if (m) {
    return m
  }
  return new BleManager({
    restoreStateIdentifier: 'ContactTracingInBackground',
    restoreStateFunction: (restoredState) => {
      if (restoredState == null) {
        // BleManager was constructed for the first time.
      } else {
        // BleManager was restored. Check `restoredState.connectedPeripherals` property.
        console.log({ restoredState })

        restoredState.connectedPeripherals.forEach(async (device) => {
          await deviceScanned(null, device)
        })
        afterDeviceScan()
      }
    },
  })
}

// advertiseAndScan will register a unique bluetooth UUID for the device
async function advertiseAndScan() {
  // start promise which never resolves
  await new Promise(async (resolve) => {
    try {
      // refresh advertise service if something needs to change
      const latestDeviceKey = await refreshAdvertiseService()
      if (!latestDeviceKey) {
        await stopTracing()
        return
      }

      const manager = getManager()

      manager.onStateChange((state) => {
        safeLog('manager.onStateChange', { state })
        if (state === 'PoweredOn') {
          manager.startDeviceScan(
            [contactTracingServiceUUID], // provide uuids to keep scanning in background working
            {},
            (error: BleError | null, scannedDevice: null | Device) => {
              deviceScanned(error, scannedDevice)
              //persist to disk on iOS
              afterDeviceScan()
            }
          )
        }
      })
    } catch (error) {
      safeLog('could not start device scan or advertising', { error })
      await stopTracing()
      return
    }
  })
}

export async function afterDeviceScan() {
  // on iOS we can't keep background mode working very long
  // so we use the wake up function of the app to do the work ;)

  // rssi cache will not be saved in background, so write it to disk with Realm
  await syncDevicesInMemoryToLocalDatabase()
  const previousSyncS = await AsyncStorage.getItem(previousSyncedKey)
  safeLog({ previousSyncS })
  const nowUnix = now()
  const hourInSeconds = 60 * 60
  safeLog({
    number: Number(previousSyncS),
    plusValue: hourInSeconds > nowUnix,
  })

  if (!previousSyncS || Number(previousSyncS) + hourInSeconds > nowUnix) {
    safeLog('refresh job on iOS')
    const ok = await refreshJob()
    if (!ok) {
      safeLog('error while refreshing job in iOS')
    }
    // safe previous sync
    await AsyncStorage.setItem(previousSyncedKey, `${nowUnix}`)
  }
}

const previousSyncedKey = 'previousSyncedKey'

export async function stopTracing() {
  try {
    const manager = getManager()
    if (manager) {
      manager.stopDeviceScan()
      manager.destroy()
    }
    await stopAdvertising()
    await BackgroundService.stop()
  } catch (error) {
    console.log('Could not stop tracing', error)
  }
}

export async function isRunningInBackground() {
  const isAdvertising = await Peripheral.isAdvertising()
  // console.log({ isAdvertising })
  return isAdvertising
}

export async function startTracing() {
  // @ts-ignore
  await BackgroundService.start(advertiseAndScan, taskOptions)
}
