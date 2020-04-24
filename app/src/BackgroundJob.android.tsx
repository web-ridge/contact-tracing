// WebRidge Design
import { BleManager } from 'react-native-ble-plx'
import BackgroundTimer from 'react-native-background-timer'
import BackgroundService from 'react-native-background-actions'
import {
  syncDevicesInMemoryToLocalDatabase,
  deviceScanned,
} from './BackgroundBluetoothDeviceScanned'
import { stopAdvertising } from './BackgroundBluetoothAdvertising'
import { safeLog } from './Utils'
import {
  refreshJob,
  refreshAdvertiseService,
  jobInterval,
  taskOptions,
} from './BackgroundJobFunctions'

let manager = new BleManager()

// advertiseAndScan will register a unique bluetooth UUID for the device
async function advertiseAndScan() {
  // start promise which never resolves
  await new Promise(async (resolve) => {
    try {
      // refresh advertise service if something needs to change
      const latestDeviceKey = await refreshAdvertiseService()
      if (!latestDeviceKey) {
        stopTracing()
      }

      // Android devices can't read the hidden overflow the 16 bit UUID is hidden on iPhones
      // That's why we listen to all devices in background (which works in Android)
      manager = new BleManager()
      manager.startDeviceScan(null, {}, deviceScanned)
    } catch (error) {
      safeLog('could not start device scan or advertising', { error })
      await stopTracing()
      return
    }

    BackgroundTimer.setInterval(async () => {
      const ok = await refreshJob()
      if (!ok) {
        return false
      }
    }, jobInterval)
  })
}

export async function stopTracing() {
  try {
    if (manager) {
      manager.stopDeviceScan()
      manager.destroy()
    }
    await stopAdvertising()
    await syncDevicesInMemoryToLocalDatabase()
    await BackgroundService.stop()
  } catch (error) {
    console.log('Could not stop tracing', error)
  }
}

export async function isRunningInBackground() {
  return BackgroundService.isRunning()
}

export async function startTracing() {
  return await BackgroundService.start(advertiseAndScan, taskOptions)
}
