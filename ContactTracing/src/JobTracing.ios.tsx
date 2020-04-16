import { Platform } from 'react-native'

import TrackPlayer, { Track } from 'react-native-track-player'

// import ContactTracing from 'react-native-contact-tracing'
// async function scanForBluetoothDevices() {
//   contactTracing.start()
// }

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

async function scanForBluetoothDevices() {
  // TODO
  // Example of an infinite loop task
  if (Platform.OS === 'ios') {
    play1YearOfSummer()
  }
}
export async function startTracing() {
  return await scanForBluetoothDevices()
}
