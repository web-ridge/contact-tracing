import React, { useState } from 'react'

import { StyleSheet, ScrollView, View, StatusBar, Platform } from 'react-native'
import { Button, Text } from 'react-native-paper'
import {
  check,
  request,
  PERMISSIONS,
  Permission,
} from 'react-native-permissions'

import { startTracing } from './JobTracing.android'
import { goToInfectedScreen } from './Screens'

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

async function requestPermissionAndStartTracing() {
  const bluetoothStatus = await requestBluetoothStatus()
  // TODO: start background status
  // TODO: add modals
  if (bluetoothStatus === 'granted') {
    startTracing()
  }
}

const ScreenHome = ({ componentId }: { componentId: string }) => {
  const [isTracking, setIsTracking] = useState(false)

  const startTracing = () => {
    requestPermissionAndStartTracing()
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <View style={styles.body}>
          <Text style={styles.title}>Contact Tracing COVID-19</Text>
          <Text style={styles.text}>Let's beat COVID-19 together.</Text>
          {!isTracking && (
            <Button mode="contained" onPress={startTracing}>
              Ik doe mee
            </Button>
          )}
          <View style={{ height: 24 }} />
          <Button
            mode="outlined"
            onPress={() => goToInfectedScreen(componentId)}
          >
            Besmetting melden
          </Button>
        </View>
      </ScrollView>
    </>
  )
}
ScreenHome.options = {
  topBar: {
    title: {
      text: 'Home',
      color: 'white',
    },
    background: {
      color: '#4d089a',
    },
  },
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
    backgroundColor: '#4d089a',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 56,
  },
  title: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#fff',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#fff',
    opacity: 0.8,
  },
})

export default ScreenHome
