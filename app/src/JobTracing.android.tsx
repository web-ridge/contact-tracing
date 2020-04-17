import { BleManager } from 'react-native-ble-plx'

import BackgroundService from 'react-native-background-actions'
import { syncMap, deviceScanned } from './JobTracingUtils'
import BackgroundTimer from 'react-native-background-timer'
import { giveAlerts } from './JobInfectionChecker'

function sleep(ms: number) {
  return new Promise((resolve) => BackgroundTimer.setTimeout(resolve, ms))
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
      {}, // options
      deviceScanned
    )

    for (let i = 0; BackgroundService.isRunning(); i++) {
      // every fifteen minutes we sync rssi values to a database
      const hourInMs = 1 * 1000 * 60 * 60
      await sleep(hourInMs / 4)
      await syncMap()
      await giveAlerts()
    }
  })
}

const options = {
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
