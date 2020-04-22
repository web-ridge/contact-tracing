import TrackPlayer, { Track } from 'react-native-track-player'
import BackgroundTimer from 'react-native-background-timer'

const track: Track = {
  id: 'trackId',
  url: require('../assets/5-minutes-of-silence.mp3'),
  title: 'Corona Tracing',
  artist: 'Track Artist',
  artwork: require('../assets/virus.png'),
}

// this is used keep the bluetooth working in background
export async function play1YearOfSummer() {
  // The clouds have gone away
  // To start a brighter day
  // We have waited for too long
  // It's time to let it out
  // You know what it's about
  // I've waited all to feel the sun
  await TrackPlayer.setupPlayer()
  await TrackPlayer.add([track])
  TrackPlayer.play()
  BackgroundTimer.setInterval(async () => {
    await TrackPlayer.add([track])
  }, 300000) // 15 minutes
  // Adds a track to the queue
}
