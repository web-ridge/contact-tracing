import { Platform } from 'react-native'
import { BleManager } from 'react-native-ble-plx'
import TrackPlayer,{Track} from 'react-native-track-player';
import BackgroundService from 'react-native-background-actions'
import { RSSIMap } from './types'

const track:Track = {
  id: 'trackId',
  url: require('../assets/5-minutes-of-silence.mp3'),
  title: 'Corona Tracing',
  artist: 'Track Artist',
  artwork: require('track.png')
}

// 1 year of summer ;)
let arrayOfTracks:Track[] = []
var i;
for (i = 0; i < 105120; i++) {
  arrayOfTracks.push(track)
}


// this is used keep the bluetooth working in background
function play1YearOfSummer() {
  TrackPlayer.setupPlayer().then(async () => {

    // Adds a track to the queue
    await TrackPlayer.add(arrayOfTracks);

    // Starts playing it
    TrackPlayer.play();

});
}

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).
const scanForBluetoothDevices = async () => {

  const rssiPerHash: RSSIMap = {}

  // Example of an infinite loop task
  
  await new Promise((resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {


      // ;-)
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
          console.log({
            error,
            scannedDevice,
          })

          if (error) {
            return
          }

          // not relevant 
          if (!scannedDevice || !scannedDevice.rssi || scannedDevice.rssi > 70) {
            return
          }

          // we map rssi values so we can see if device did come closer
          // Als gemeten in negatieve getallen betekent een getal dat dichter bij 0 ligt meestal een beter signaal,
          // een getal dat -50 (min 50) is een redelijk goed signaal,
          // een getal van -70 (min 70) is redelijk terwijl een getal dat -100 (min 100) is helemaal geen signaal heeft.
          
          // https://iotandelectronics.wordpress.com/2016/10/07/how-to-calculate-distance-from-the-rssi-value-of-the-ble-beacon/
          const previousRSSI = rssiPerHash[scannedDevice.id]
          const latestRSSI = scannedDevice.rssi

          rssiPerHash[scannedDevice.id] = previousRSSI
            ? latestRSSI > previousRSSI
              ? latestRSSI
              : previousRSSI
            : latestRSSI
     
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

export default function startTracing() {
  return BackgroundService.start(scanForBluetoothDevices, {
    taskName: 'ContactTracing',
    taskTitle: 'Corona onder controle',
    taskDesc: 'Samen krijgen we Corona onder controle',
    color: 'blue',
    taskIconOptions: {
      name: '',
      type: '',
      package: '',
    },
  })
}
