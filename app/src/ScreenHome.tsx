// WebRidge Design
// TODO: this needs component little cleanup

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
import BackgroundService from 'react-native-background-actions'

import InfectionAlerts from './InfectionAlerts'
import { startTracing, stopTracing } from './BluetoothScanning'
import {
  goToSymptonsScreen,
  goToDataRemovalScreen,
  goToOnboardingSecureLockScreen,
} from './Screens'
import { requestBluetoothStatus, requestLocationAccess } from './Utils'
import AsyncStorage from '@react-native-community/async-storage'
import { Navigation } from 'react-native-navigation'

function ScreenHome({ componentId }: { componentId: string }) {
  const [isTracking, setIsTracking] = useState<boolean>()
  const [onboardingDone, setOnboardingDone] = useState<boolean>(false)
  const [screenRenders, setScreenRenders] = useState<number>(0)

  useEffect(() => {
    const screenEventListener = Navigation.events().registerComponentDidAppearListener(
      ({ componentId, componentName, passProps }) => {
        setOnboardingDoneAsync()
        setScreenRenders((prev) => prev + 1)
      }
    )
    return () => {
      screenEventListener.remove()
    }
  })
  const setOnboardingDoneAsync = async () => {
    const value = await AsyncStorage.getItem('contactTracingOnboardingOk')
    setOnboardingDone(value === 'true')
  }
  useEffect(() => {
    setOnboardingDoneAsync()
  })

  // sync background job with relation status of background job
  useInterval(() => {
    const isRunning = BackgroundService.isRunning()
    // console.log({ isRunning })
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
          {onboardingDone && <InfectionAlerts screenRenders={screenRenders} />}
          {isTracking ? (
            <>
              <Button
                mode="contained"
                onPress={stopTracingPressed}
                style={styles.button}
                uppercase={false}
              >
                <Translate text="stopTracking" />
              </Button>
              {privacyText}
              <View style={{ height: 12 }} />
            </>
          ) : (
            <>
              {!onboardingDone && (
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
              )}
              {/* <Text></Text> */}
              {onboardingDone && (
                <Button
                  mode="contained"
                  onPress={startTracingPressed}
                  style={styles.button}
                  uppercase={false}
                >
                  <Translate text="startTracking" />
                </Button>
              )}
            </>
          )}
          {onboardingDone ? (
            <Button
              uppercase={false}
              mode="outlined"
              onPress={() => goToSymptonsScreen(componentId)}
              style={{ marginTop: 12 }}
            >
              <Translate text="infectedButton" />
            </Button>
          ) : (
            <Button
              uppercase={false}
              mode="contained"
              onPress={() => goToOnboardingSecureLockScreen(componentId)}
            >
              <Translate text="startOnboarding" />
            </Button>
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
