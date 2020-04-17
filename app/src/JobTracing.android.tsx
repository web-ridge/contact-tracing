import { BleManager } from 'react-native-ble-plx'
import BackgroundTimer from 'react-native-background-timer'
import BackgroundService from 'react-native-background-actions'
import { Device, BleError } from 'react-native-ble-plx'

import { syncMap, deviceScanned, jobInterval } from './JobTracingUtils'
import { removeEncountersOlderThan } from './DatabaseUtils'
import { getStartOfRiskUnix } from './Utils'
import { giveAlerts } from './JobInfectionChecker'

function sleep(ms: number) {
  return new Promise((resolve) => BackgroundTimer.setTimeout(resolve, ms))
}

const tryScanDevice = (manager: BleManager) => (
  error: BleError | null,
  scannedDevice: null | Device
) => {
  try {
    return deviceScanned(error, scannedDevice, manager)
  } catch (e) {
    BackgroundService.stop()
  }
  return () => {}
}

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).
async function scanForBluetoothDevices() {
  await new Promise(async (resolve) => {
    const manager = new BleManager()

    manager.startDeviceScan(
      null, // uuids
      {},
      tryScanDevice(manager) // options
    )

    for (let i = 0; BackgroundService.isRunning(); i++) {
      const removed = await removeEncountersOlderThan(getStartOfRiskUnix())

      // stop if we can not remove old data
      if (!removed) {
        BackgroundService.stop()
      }

      console.log('sleep')
      await sleep(jobInterval)

      console.log('syncMap')
      const synced = await syncMap()
      if (!synced) {
        BackgroundService.stop()
      }
      console.log('giveAlerts')
      await giveAlerts()

      console.log('start over')
    }
  })
}

const options = {
  // TODO: translate
  taskName: 'Contacten opslaan',
  taskTitle: 'Contacten lokaal opslaan',
  taskDesc: 'Bluetooth apparaten worden lokaal opgeslagen.',
  taskIcon: {
    name: 'ic_stat_sentiment_satisfied_alt',
    type: 'mipmap',
  },
  color: '#F27188',
  parameters: {
    delay: 1000,
  },
}
export async function stopTracing() {
  await syncMap()
  await BackgroundService.stop()
}
export async function startTracing() {
  return await BackgroundService.start(scanForBluetoothDevices, options)
}
