// WebRidge Design
import { Platform } from 'react-native'
import { BleManager } from 'react-native-ble-plx'
import { forceBackground, stopForcingBackground } from './BackgroundJobHelpers'
import BackgroundTimer from 'react-native-background-timer'
import BackgroundService from 'react-native-background-actions'
import {
  syncDevicesInMemoryToLocalDatabase,
  deviceScanned,
} from './BackgroundBluetoothDeviceScanned'
import { removeOldData, getCurrentDeviceKeyOrRenew } from './DatabaseUtils'
import {
  startOrRefreshAdvertising,
  stopAdvertising,
} from './BackgroundBluetoothAdvertising'
import { giveAlerts } from './BackgroundInfectionChecker'
import { contactTracingServiceUUID, safeLog } from './Utils'
import { DeviceKey } from './types'

// 15 minutes
const jobInterval = 1000 * 60 * 15

let manager = new BleManager()

// advertiseAndScan will register a unique bluetooth UUID for the device
async function advertiseAndScan() {
  // start promise which never resolves
  await new Promise(async (resolve) => {
    let latestDeviceKey: string | undefined
    try {
      // refresh advertise service if something needs to change
      let latestDeviceKey = await refreshAdvertiseService(undefined)
      if (!latestDeviceKey) {
        stopTracing()
      }
      // do something special for each platform to keep the app running in background
      // on iOS we play a song without any music to force the app to keep running
      // this could be done maybe every 5 minutes for 1 second
      await forceBackground()

      manager = new BleManager({
        restoreStateIdentifier: 'BleInTheBackground',
        restoreStateFunction: (restoredState) => {
          if (restoredState == null) {
            // BleManager was constructed for the first time.
          } else {
            // BleManager was restored. Check `restoredState.connectedPeripherals` property.
            console.log(restoredState)
          }
        },
      })

      if (Platform.OS === 'ios') {
        safeLog('manager.onStateChange')
        manager.onStateChange((state) => {
          safeLog('manager.onStateChange', { state })
          if (state === 'PoweredOn') {
            // iOS devices can only advertise 32 bit and the rest in in a overflow buffer only visible by iOS devices (also in background)
            // We register iOS devices this way
            //  await Peripheral.startAdvertising({
            //   name: '',
            //   serviceUuids: [deviceKey, contactTracingServiceUUID],
            // })
            // The contactTracingServiceUUID is a 16 bit Bluetooth UUID which we use as number to detect other contact tracing devices
            // iOS devices can use that since they can read the overflow
            // We also CAN advertise more bytes in Android so they can see both Android AND iOS devices in background

            safeLog(' manager.startDeviceScan', [contactTracingServiceUUID])

            manager.startDeviceScan(
              [contactTracingServiceUUID], // uuids
              {},
              deviceScanned
            )
          }
        })
      } else {
        // Android devices can't read the hidden overflow the 16 bit UUID is hidden on iPhones
        // That's why we listen to all devices in background (which works in Android)
        manager.startDeviceScan(null, {}, deviceScanned)
      }
    } catch (error) {
      safeLog('could not start device scan or advertising', { error })
      await stopTracing()
      return
    }

    // This job is to check if we lost control over our background job
    // BackgroundTimer.setInterval(async () => {
    //   // https://github.com/Rapsssito/react-native-background-actions/issues/11
    //   const isStillTracing = await isTracing()

    //   // resolve this background job
    //   if (!isStillTracing) {
    //     stopTracing()
    //     resolve()
    //     return
    //   }
    // }, 1000 * 60 * 1)

    BackgroundTimer.setInterval(async () => {
      try {
        safeLog('begin interval')
        const removed = await removeOldData()
        if (!removed) {
          // stop if we can not remove old data from device
          stopTracing()
        }

        // refresh advertising service
        // so new key's will be added if date changes
        latestDeviceKey = await refreshAdvertiseService(latestDeviceKey)
        if (!latestDeviceKey) {
          stopTracing()
        }

        // sync RSSI values
        safeLog('syncDevicesInMemoryToLocalDatabase')
        const synced = await syncDevicesInMemoryToLocalDatabase()
        if (!synced) {
          safeLog('WARNING database is not synced inside background job')
        }
        safeLog('giveAlerts')

        // Check notification alerts
        await giveAlerts()
      } catch (error) {
        console.log('something went wrong in jobInterval', { error })
        stopTracing()
      }
    }, jobInterval)
  })
}

// make a re-usable function for refreshing
async function refreshAdvertiseService(
  previousDeviceKey: string | undefined
): Promise<string | undefined> {
  // start advertising as a bluetooth service for other devices
  // so other devices will know this is an advertisable
  let newDeviceKey: DeviceKey | undefined
  try {
    newDeviceKey = await getCurrentDeviceKeyOrRenew()
  } catch (error) {
    // Device key is too old we stop sending it since the chances the key is not unique
    // enough anymore
    console.log('refreshAdvertiseService', { error })
    return undefined
  }

  if (!newDeviceKey) {
    return undefined
  }

  if (newDeviceKey.key !== previousDeviceKey) {
    // key has changed so we need to register
    await startOrRefreshAdvertising(newDeviceKey.key)
    return newDeviceKey.key
  }

  // key does not need to change
  return previousDeviceKey
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

// const isTracingKey = 'contactTracingAppIsTracing'

// export async function isTracing(): Promise<boolean> {
//   const isTracing = await AsyncStorage.getItem(isTracingKey)
//   return isTracing === 'true'
// }

// export async function setTracing(value: boolean) {
//   await AsyncStorage.setItem(isTracingKey, value ? 'true' : 'false')
// }

export async function stopTracing() {
  try {
    if (manager) {
      manager.stopDeviceScan()
      manager.destroy()
    }
    await stopAdvertising()
    await syncDevicesInMemoryToLocalDatabase()
    await stopForcingBackground()
    await BackgroundService.stop()
    // await setTracing(false)
  } catch (error) {
    console.log('Could not stop tracing', error)
  }
}

export async function startTracing() {
  // await setTracing(true)
  return await BackgroundService.start(advertiseAndScan, options)
}
