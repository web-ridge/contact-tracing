import React, { useState } from 'react'
import { Translate } from 'react-translated'
import {
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Platform,
  Image,
} from 'react-native'
import { Button, Text } from 'react-native-paper'
import {
  check,
  request,
  PERMISSIONS,
  Permission,
} from 'react-native-permissions'
import BackgroundService from 'react-native-background-actions'

import { startTracing } from './JobTracing'
import { goToSymptonsScreen } from './Screens'

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

const ScreenHome = ({ componentId }: { componentId: string }) => {
  const [isTracking, setIsTracking] = useState<boolean>(
    BackgroundService.isRunning()
  )

  const startTracingPressed = () => {
    const startTracingAsync = async () => {
      console.log('doSynced')
      const bluetoothStatus = await requestBluetoothStatus()
      console.log({ bluetoothStatus })
      // TODO: start background status
      // TODO: add modals
      if (bluetoothStatus === 'granted') {
        startTracing()
        setIsTracking(true)
      } else {
        console.log({ bluetoothStatus })
      }
    }
    startTracingAsync()
  }
  const stopTracingPressed = () => {
    const stopTracingAsync = async () => {
      await BackgroundService.stop()
      setIsTracking(BackgroundService.isRunning())
    }
    stopTracingAsync()
  }

  const privacyText = (
    <Text style={{ maxWidth: 300, padding: 8 }}>
      <Translate text="privacyTracking" />
    </Text>
  )
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <View style={styles.body}>
          <Text style={styles.title}>
            <Translate text="title" />
          </Text>
          <Text style={styles.text}>
            <Translate text="subtitle" />
          </Text>
          {isTracking ? (
            <>
              <Button
                mode="contained"
                onPress={stopTracingPressed}
                style={styles.button}
              >
                <Translate text="stop" />
              </Button>
              {privacyText}
              <View style={{ height: 24 }} />
              <Button
                mode="outlined"
                onPress={() => goToSymptonsScreen(componentId)}
              >
                <Translate text="symptomsButton" />
              </Button>
            </>
          ) : (
            <>
              <Button
                mode="contained"
                onPress={startTracingPressed}
                style={styles.button}
              >
                <Translate text="start" />
              </Button>
              {privacyText}
            </>
          )}
        </View>
        <Image
          source={require('../assets/background.png')}
          style={{ height: 400, width: 400 }}
          resizeMode="contain"
        ></Image>
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
  },
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    maxWidth: 550,
  },
  title: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,

    opacity: 0.8,
  },
})

export default ScreenHome
