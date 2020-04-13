import React, { useState } from 'react'
import { StyleSheet, ScrollView, View, StatusBar, Platform } from 'react-native'
import { BleManager } from 'react-native-ble-plx'
import { Button, Text } from 'react-native-paper'
import { useDebouncedCallback } from 'use-debounce'
import {
  check,
  request,
  PERMISSIONS,
  Permission,
} from 'react-native-permissions'
import { syncRSSI } from './DatabaseUtils'
import { RSSIMap } from './types'

async function requestBluetoothStatus() {
  const permission: Permission = Platform.select({
    ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
    android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  })!
  // can be done in parallel
  let bluetoothStatus = await check(permission)
  if (bluetoothStatus === 'denied') {
    bluetoothStatus = await request(permission)
  }
  return bluetoothStatus
}

function App() {
  const [isTracking, setIsTracking] = useState(false)
  const [infectionModalOpen, setInfectionModalOpen] = useState(false)

  const manager = React.useRef<BleManager>()
  const rssiPerHash = React.useRef<RSSIMap>({})

  // Debounce callback
  const [syncValues] = useDebouncedCallback(
    // function
    async () => {
      const hasSynced = await syncRSSI(rssiPerHash.current)
      if (hasSynced) {
        rssiPerHash.current = {}
      }
    },
    // delay in ms
    10000 // sync after 10 seconds
  )

  const startTracing = () => {
    async function startProcess() {
      const bluetoothStatus = await requestBluetoothStatus()
      if (bluetoothStatus === 'denied') {
        alert('Geen toestemming tot Bluetooth')
        return
      }
      if (!manager.current) {
        manager.current = new BleManager({
          // restoreStateIdentifier
          // restoreStateFunction
        })
      }
      setIsTracking(true)
      manager.current.startDeviceScan(
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
          if (!scannedDevice) {
            return
          }
          if (!scannedDevice.rssi) {
            return
          }

          // we map rssi values so we can see if device did come closer
          // Als gemeten in negatieve getallen betekent een getal dat dichter bij 0 ligt meestal een beter signaal,
          // een getal dat -50 (min 50) is een redelijk goed signaal,
          // een getal van -70 (min 70) is redelijk terwijl een getal dat -100 (min 100) is helemaal geen signaal heeft.
          if (scannedDevice.rssi > 70) {
            // not relevant enough
            return
          }
          // https://iotandelectronics.wordpress.com/2016/10/07/how-to-calculate-distance-from-the-rssi-value-of-the-ble-beacon/
          const previousRSSI = rssiPerHash.current[scannedDevice.id]
          const latestRSSI = scannedDevice.rssi

          rssiPerHash.current[scannedDevice.id] = previousRSSI
            ? latestRSSI > previousRSSI
              ? latestRSSI
              : previousRSSI
            : latestRSSI

          syncValues()
        }
      )
    }
    startProcess()
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <View style={styles.body}>
          <Text style={styles.title}>COVID-19 Tracing</Text>
          <Text style={styles.text}>
            Let's beat COVID-19{' '}
            <Text
              style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}
            >
              without giving up your privacy.
            </Text>
          </Text>
          {!isTracking && (
            <Button mode="contained" onPress={startTracing}>
              Start tracing
            </Button>
          )}
          <View style={{ height: 24 }} />
          <Button mode="outlined" onPress={() => setInfectionModalOpen(true)}>
            Scan infection QR-code
          </Button>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 56,
  },
  modalView: {
    // margin: 20,
    width: '100%',
    flex: 1,
    backgroundColor: 'white',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})

export default App
