// WebRidge Design

import { BleManager } from 'react-native-ble-plx'
import { deviceScanned } from './BackgroundBluetoothDeviceScanned'
import { stopAdvertising } from './BackgroundBluetoothAdvertising'
import { contactTracingServiceUUID, safeLog } from './Utils'
import { refreshAdvertiseService, taskOptions } from './BackgroundJobFunctions'
import Peripheral from 'react-native-peripheral'
import BackgroundService from 'react-native-background-actions'

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
      }
    },
  })
}

// advertiseAndScan will register a unique bluetooth UUID for the device
async function advertiseAndScan() {
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
          deviceScanned
        )
      }
    })
  } catch (error) {
    safeLog('could not start device scan or advertising', { error })
    await stopTracing()
    return
  }
}

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
  console.log({ isAdvertising })
  return isAdvertising
}

export async function startTracing() {
  // @ts-ignore
  await BackgroundService.start(advertiseAndScan, taskOptions)
}
