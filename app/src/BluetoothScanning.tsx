// WebRidge Design
import { Platform } from 'react-native'
import { BleManager } from 'react-native-ble-plx'
import { play1YearOfSummer } from './JobPlatform'
import BackgroundTimer from 'react-native-background-timer'
import BackgroundService from 'react-native-background-actions'
import { syncMap, deviceScanned, jobInterval } from './JobTracingUtils'
import { removeOldData, getCurrentDeviceKeyOrRenew } from './DatabaseUtils'
import { startAdvertising } from './BluetoothService'
import { giveAlerts } from './JobInfectionChecker'
import { contactTracingServiceUUID, safeLog } from './Utils'
import { DeviceKey } from './types'

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
      let newDeviceKey: DeviceKey | undefined
      try {
        newDeviceKey = await getCurrentDeviceKeyOrRenew()
      } catch (e) {
        // Device key is too old we stop sending it since the chances the key is not unique
        // enough anymore
        safeLog('STOP BACKGROUND SERVICE', { e })
        await BackgroundService.stop()
        return
      }
      // we could not get a device key so we don't broadcast anything and let user know
      if (!newDeviceKey) {
        safeLog('STOP BACKGROUND SERVICE')

        await BackgroundService.stop()
        return
      }
      if (newDeviceKey.key !== deviceKey) {
        deviceKey = newDeviceKey.key
        await startAdvertising(newDeviceKey.key)
      }
    }
    safeLog('manager')

    // console.log(' new BleManager({')
    refreshAdvertiseService()
    play1YearOfSummer()

    const manager = new BleManager()
    try {
      if (Platform.OS === 'ios') {
        manager.onStateChange((state) => {
          if (state === 'PoweredOn') {
            // console.log('manager.startDeviceScan', contactTracingServiceUUID)
            manager.startDeviceScan(
              // France you're beatifull but it'll work on iOS just try harder :)
              // Look who's wrong too: https://twitter.com/RichardLindhout/status/1249088258832826368
              [contactTracingServiceUUID], // uuids
              {},
              deviceScanned
            )
          }
        })
      } else {
        manager.startDeviceScan(
          null, // (for other iOS devices because they're only read by other iOS devices :) YEAH YEAH RIGHT RIGHT RIGHT)
          {},
          deviceScanned
        )
      }
    } catch (e) {
      safeLog('could not start device scan')
      await BackgroundService.stop()
      return
    }

    safeLog('isRunning', BackgroundService.isRunning())
    // this job will be repeated over-and-over
    BackgroundTimer.setInterval(async () => {
      safeLog('begin interval')
      const removed = await removeOldData()
      if (!removed) {
        // stop if we can not remove old data from device
        BackgroundService.stop()
      }

      // refresh advertising service
      // so new key's will be added if date changes
      refreshAdvertiseService()

      safeLog('sleep')
      await sleep(jobInterval)

      safeLog('syncMap')

      // sync RSSI values
      const synced = await syncMap()
      if (!synced) {
        BackgroundService.stop()
      }
      safeLog('giveAlerts')

      // Check notification alerts
      await giveAlerts()
    }, 900000) // 15 minutes
    // console.log('BackgroundService.isRunning') // Let's register a managers
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
