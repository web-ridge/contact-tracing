import { Platform } from 'react-native'
import { BleManager } from 'react-native-ble-plx'
import TrackPlayer, { Track } from 'react-native-track-player'
import BackgroundService from 'react-native-background-actions'
import { RSSIMap } from './types'
import { syncRSSIMap } from './DatabaseUtils'

const track: Track = {
  id: 'trackId',
  url: require('../assets/5-minutes-of-silence.mp3'),
  title: 'Corona Tracing',
  artist: 'Track Artist',
  artwork: require('../assets/virus.png'),
}

// 1 year of summer ;)
let arrayOfTracks: Track[] = []
var i
for (i = 0; i < 105120; i++) {
  arrayOfTracks.push(track)
}

// this is used keep the bluetooth working in background
function play1YearOfSummer() {
  // The clouds have gone away
  // To start a brighter day
  // We have waited for too long
  // It's time to let it out
  // You know what it's about
  // I've waited all to feel the sun
  TrackPlayer.setupPlayer().then(async () => {
    // Adds a track to the queue
    await TrackPlayer.add(arrayOfTracks)

    // Starts playing it
    TrackPlayer.play()
  })
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).
async function scanForBluetoothDevices() {
  let rssiPerHash: RSSIMap = {}

  // Example of an infinite loop task

  await new Promise(async (resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log('run task')
      // ;-)
      //
      if (Platform.OS === 'ios') {
        play1YearOfSummer()
      }

      const manager = new BleManager({
        // restoreStateIdentifier
        // restoreStateFunction
      })

      manager.startDeviceScan(
        null, // uuids
        {}, // options
        (error, scannedDevice) => {
          if (error) {
            return
          }

          // not relevant
          if (
            !scannedDevice ||
            !scannedDevice.rssi ||
            scannedDevice.rssi > 70
          ) {
            return
          }

          // we map rssi values so we can see if device did come closer
          // Closer to zero is better!
          // -50 (min 50) fairly good,
          // -70 (min 70) good
          // -100 bleghh

          const previousRSSI = rssiPerHash[scannedDevice.id]
          const latestRSSI = scannedDevice.rssi

          rssiPerHash[scannedDevice.id] = previousRSSI
            ? latestRSSI > previousRSSI
              ? latestRSSI
              : previousRSSI
            : latestRSSI
        }
      )

      const hourInMs = 1 * 1000 * 60 * 60

      // every half an hour we sync rssi values to a database
      await sleep(hourInMs / 2)
      const done = await syncRSSIMap(rssiPerHash)
      if (done) {
        console.log('syncing rrsi values done')
        rssiPerHash = {}
      } else {
        console.log('syncing rrsi not done')
      }
    }
  })
}

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask desc',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  parameters: {
    delay: 1000,
  },
}

export async function startTracing() {
  return await BackgroundService.start(scanForBluetoothDevices, options)
}
