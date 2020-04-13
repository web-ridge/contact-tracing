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

async function requestBluetoothStatus() {
  const permission: Permission = Platform.select({
    ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
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

  const startTracing = () => {
    async function startProcess() {
      const bluetoothStatus = await requestBluetoothStatus()
      // TODO: start background status
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
