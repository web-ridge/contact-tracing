import TrackPlayer, { Track } from 'react-native-track-player'

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
export function play1YearOfSummer() {
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
