import { BleManager } from 'react-native-ble-plx'
import BackgroundTimer from 'react-native-background-timer'
import BackgroundService from 'react-native-background-actions'
import { syncMap, deviceScanned, jobInterval } from './JobTracingUtils'
import { removeOldData } from './DatabaseUtils'
import { getStartOfRiskUnix, getDeviceKey } from './Utils'
import { startAdvertising } from './BluetoothService'
import { giveAlerts } from './JobInfectionChecker'
import { Platform } from 'react-native'

function sleep(ms: number) {
  return new Promise((resolve) => BackgroundTimer.setTimeout(resolve, ms))
}

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).
async function advertiseAndScan() {
  await new Promise(async (resolve) => {
    // cache old device key to know if we need to advertise with new uuid
    let deviceKey: string | undefined = undefined
    async function refreshAdvertiseService() {
      // start advertising as a bluetooth service for other devices
      // so other devices will know this is an advertisable
      let newDeviceKey = await getDeviceKey()
      if (newDeviceKey !== deviceKey) {
        deviceKey = newDeviceKey
        await startAdvertising(newDeviceKey)
      }
    }

    // on Android devices we scan for other contact tracing services
    // on iOS we do something else
    if (Platform.OS === 'android') {
      const manager = new BleManager()
      try {
        manager.startDeviceScan(
          null, // uuids
          {},
          deviceScanned // options
        )
      } catch (e) {
        console.log('could not start device scan')
      }
    }

    // this job will be repeated over-and-over
    for (let i = 0; BackgroundService.isRunning(); i++) {
      const removed = await removeOldData()
      if (!removed) {
        // stop if we can not remove old data from device
        BackgroundService.stop()
      }

      // refresh advertising service
      // so new key's will be added if date changes
      refreshAdvertiseService()

      console.log('sleep')
      await sleep(jobInterval)

      console.log('syncMap')

      // sync RSSI values
      const synced = await syncMap()
      if (!synced) {
        BackgroundService.stop()
      }
      console.log('giveAlerts')

      // Check notification alerts
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
  return await BackgroundService.start(advertiseAndScan, options)
}
