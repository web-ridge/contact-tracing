# react-native-ito-lib

## What it does/should do

This library is the native backend for the ito app. It does several things
- generate TCNs (Temporary Contact Numbers) as per the STRICT protocol
- handle bluetooth communication
- store the data received over bluetooth
- store the data used to generate the TCNs
- regularly poll the server for TCN reports and compare with the local database
- upload TCN generation data from specified timeframes
- provide some feedback for better UX

## Getting started

`$ npm install react-native-ito-bluetooth --save`

### Mostly automatic installation

`$ react-native link react-native-ito-bluetooth`

## Usage
```javascript
import {NativeModules, NativeEventEmitter} from 'react-native';

const eventEmitter = new NativeEventEmitter(NativeModules.ItoBluetooth);
this.eventListener = eventEmitter.addListener('onDistancesChanged', (distances) => {
  //get notified about the distances to nearby devices
});


```
