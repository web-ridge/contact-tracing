import React, { useState, useEffect, useRef } from 'react'
import { Translate } from 'react-translated'
import {
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Platform,
  Image,
  Linking,
} from 'react-native'
import { Button, Text } from 'react-native-paper'
import {
  check,
  request,
  PERMISSIONS,
  Permission,
} from 'react-native-permissions'
import BackgroundService from 'react-native-background-actions'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler'

import InfectionAlerts from './InfectionAlerts'
import { startTracing, stopTracing } from './BluetoothScanning'
import { goToSymptonsScreen, goToDataRemovalScreen } from './Screens'

const bluetoothPermission: Permission = Platform.select({
  ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
})!

async function requestBluetoothStatus() {
  // can be done in parallel
  let bluetoothStatus = await check(bluetoothPermission)
  if (bluetoothStatus === 'denied') {
    bluetoothStatus = await request(bluetoothPermission)
  }
  return bluetoothStatus
}
async function requestLocationAccess(): Promise<boolean> {
  try {
    const data = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded(
      { interval: 10000, fastInterval: 5000 }
    )
    return data === 'already-enabled' || data === 'enabled'
  } catch (e) {
    console.log({ e })
    return false
  }
}

function ScreenHome({ componentId }: { componentId: string }) {
  const [isTracking, setIsTracking] = useState<boolean>()

  // sync background job with relation status of background job
  useInterval(() => {
    const isRunning = BackgroundService.isRunning()
    if (isRunning !== isTracking) {
      setIsTracking(isRunning)
    }
  }, 1000)

  const startTracingPressed = () => {
    const startTracingAsync = async () => {
      // TODO: add more information to comfort user in accepting these

      const bluetoothStatus = await requestBluetoothStatus()

      if (bluetoothStatus !== 'granted') {
        console.log('bluetooth not enabled', { bluetoothStatus })
        //@ts-ignore
        alert('Bluetooth en locatie moeten aan staan')
        return
      }

      // On Android location permissions are needed
      if (Platform.OS === 'android') {
        const locationEnabled = await requestLocationAccess()
        if (!locationEnabled) {
          console.log('location not enabled')
          return
        }
      }

      startTracing()
      setIsTracking(true)
    }
    // do this in background
    startTracingAsync()
  }
  const stopTracingPressed = () => {
    const stopTracingAsync = async () => {
      await stopTracing()
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
          {/* <Text style={styles.subtitle}>
            <Translate text="subtitle" />
          </Text>
          <Text style={styles.title}>
            <Translate text="title" />
          </Text> */}

          {isTracking ? (
            <>
              <InfectionAlerts />
              <Button
                mode="contained"
                onPress={stopTracingPressed}
                style={styles.button}
                uppercase={false}
              >
                <Translate text="stopTracking" />
              </Button>
              <View style={{ height: 12 }} />
              <Button
                uppercase={false}
                mode="outlined"
                onPress={() => goToSymptonsScreen(componentId)}
              >
                <Translate text="symptomsButton" />
              </Button>
            </>
          ) : (
            <>
              <Image
                source={require('../assets/privacy.png')}
                style={{
                  height: 300,
                  width: '90%',
                  maxWidth: 300,
                  marginTop: 12,
                  marginBottom: 12,
                }}
                resizeMode="contain"
              ></Image>
              <Button
                mode="contained"
                onPress={startTracingPressed}
                style={styles.button}
              >
                <Translate text="startTracking" />
              </Button>
              {privacyText}
            </>
          )}
        </View>
        <View
          style={{
            padding: 24,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Button
            uppercase={false}
            onPress={() => {
              Linking.openURL(
                'https://www.contactentraceren.nl/Privacyverklaring.pdf'
              )
            }}
          >
            <Translate text="privacyButton" />
          </Button>
          <Button
            uppercase={false}
            onPress={() => goToDataRemovalScreen(componentId)}
          >
            <Translate text="myDataButton" />
          </Button>
        </View>
      </ScrollView>
    </>
  )
}

function useInterval(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

const styles = StyleSheet.create({
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
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
})

export default ScreenHome
