import TrackPlayer, { Track } from 'react-native-track-player'
import { BleManager } from 'react-native-ble-plx'
import { syncMap, deviceScanned } from './JobTracingUtils'
import { giveAlerts } from './JobInfectionChecker'

const track: Track = {
  id: 'trackId',
  url: require('../assets/5-minutes-of-silence.mp3'),
  title: 'Contact Tracing',
  artist: 'Keeps app in background',
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

export let isWorkingInBackground = false

async function scanForBluetoothDevices() {
  // play music in background so app will be kept open
  play1YearOfSummer()

  const manager = new BleManager({
    // restoreStateIdentifier
    // restoreStateFunction
  })
  manager.startDeviceScan(
    null, // uuids
    {}, // options
    deviceScanned
  )

  // sync to local database every quarter
  while (isWorkingInBackground) {
    const hourInMs = 1 * 1000 * 60 * 60
    await sleep(hourInMs / 4)
    await syncMap()
    await giveAlerts()
  }
}

export async function stopTracing() {
  isWorkingInBackground = false
  await syncMap()
}
export async function startTracing() {
  isWorkingInBackground = true
  return await scanForBluetoothDevices()
}
