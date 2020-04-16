import { BleManager } from 'react-native-ble-plx'

import BackgroundService from 'react-native-background-actions'
import { RSSIMap } from './types'
import { syncRSSIMap } from './DatabaseUtils'
import BackgroundTimer from 'react-native-background-timer'

function sleep(ms: number) {
  return new Promise((resolve) => BackgroundTimer.setTimeout(resolve, ms))
}

let rssiValues: RSSIMap = {}

export async function syncMap() {
  const done = await syncRSSIMap(rssiValues)
  if (done) {
    console.log('syncing rrsi values done')
    rssiValues = {}
  } else {
    console.log('syncing rrsi not done')
  }
}
export async function stopTracing() {
  await syncMap()
  await BackgroundService.stop()
}

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).
async function scanForBluetoothDevices() {
  console.log('scanForBluetoothDevices()')

  await new Promise(async (resolve) => {
    console.log('for (let i = 0; BackgroundService.isRunning(); i++) {')

    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log('endless background loop')
      const manager = new BleManager({
        // restoreStateIdentifier
        // restoreStateFunction
      })
      console.log('manager')

      manager.startDeviceScan(
        null, // uuids
        {}, // options
        (error, scannedDevice) => {
          if (error) {
            console.log('devicescan', { error })
            return
          }

          // not relevant
          if (
            !scannedDevice ||
            !scannedDevice.rssi ||
            -100 > scannedDevice.rssi
          ) {
            console.log('devices not good enough', { scannedDevice })
            return
          }

          // we map rssi values so we can see if device did come closer
          // Closer to zero is better!
          // -50 (min 50) fairly good,
          // -70 (min 70) good
          // -100 bleghh

          const previousValue = rssiValues[scannedDevice.id]
          const latestRSSI = scannedDevice.rssi
          const didComeCloser =
            !previousValue || latestRSSI > previousValue.rssi

          if (didComeCloser) {
            rssiValues[scannedDevice.id] = previousValue
              ? {
                  rssi:
                    latestRSSI > previousValue.rssi
                      ? latestRSSI
                      : previousValue.rssi,
                  hits: previousValue.hits + 1,
                }
              : {
                  rssi: latestRSSI,
                  hits: 1,
                }

            console.log(
              'changed',
              scannedDevice.id,
              rssiValues[scannedDevice.id]
            )
          }
        }
      )

      // every fifteen minutes we sync rssi values to a database
      const hourInMs = 1 * 1000 * 60 * 60
      await sleep(hourInMs / 4)
      syncMap()
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

export async function startTracing() {
  return await BackgroundService.start(scanForBluetoothDevices, options)
}
