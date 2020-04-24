// WebRidge Design

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
  Alert,
} from 'react-native'
import { Button, Text } from 'react-native-paper'
import BluetoothStateManager from 'react-native-bluetooth-state-manager'
import SafeAreaView from 'react-native-safe-area-view'
import InfectionAlerts from './InfectionAlerts'
import {
  startTracing,
  isRunningInBackground,
  stopTracing,
} from './BackgroundJob'
import {
  goToSymptomsScreen,
  goToDataRemovalScreen,
  goToOnboardingSecureLockScreen,
} from './Screens'
import {
  requestBluetoothStatus,
  requestLocationAccess,
  getTranslation,
} from './Utils'
import AsyncStorage from '@react-native-community/async-storage'
import { Navigation } from 'react-native-navigation'
import { useSafeArea } from 'react-native-safe-area-context'

function ScreenHome({ componentId }: { componentId: string }) {
  const insets = useSafeArea()

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
    const asynInterval = async () => {
      const isRunning = await isRunningInBackground()
      // console.log({ isRunning })
      if (isRunning !== isTracking) {
        setIsTracking(isRunning)
      }
    }
    asynInterval()
  }, 4000)

  const startTracingPressed = () => {
    const startTracingAsync = async () => {
      const ok = await hasEnableAllRequiredThings()
      if (ok) {
        startTracing()
        setIsTracking(true)
      }
    }
    // do this in background
    startTracingAsync()
  }
  const stopTracingPressed = () => {
    const stopTracingAsync = async () => {
      await stopTracing()
      const isRunning = await isRunningInBackground()
      setIsTracking(isRunning)
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
        <SafeAreaView
          style={{ flex: 1 }}
          forceInset={{ bottom: 'never', top: 'never' }}
        >
          <View style={styles.body}>
            {!onboardingDone && (
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
                  uppercase={false}
                  mode="contained"
                  onPress={() => goToOnboardingSecureLockScreen(componentId)}
                >
                  <Translate text="startOnboarding" />
                </Button>
              </>
            )}
            {onboardingDone && (
              <>
                <InfectionAlerts screenRenders={screenRenders} />
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
                  <Button
                    mode="contained"
                    onPress={startTracingPressed}
                    style={styles.button}
                    uppercase={false}
                  >
                    <Translate text="startTracking" />
                  </Button>
                )}

                <Button
                  uppercase={false}
                  mode="outlined"
                  onPress={() => goToSymptomsScreen(componentId)}
                  style={{ marginTop: 12 }}
                >
                  <Translate text="infectedButton" />
                </Button>
              </>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + 16,
            paddingLeft: insets.left + 16,
            paddingRight: insets.right + 16,
          },
        ]}
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
    </>
  )
}

async function hasEnableAllRequiredThings(): Promise<boolean> {
  const bluetoothStatus = await requestBluetoothStatus()

  if (bluetoothStatus !== 'granted') {
    console.log('bluetooth not enabled', { bluetoothStatus })
    Alert.alert(
      getTranslation('bluetoothErrorTitle'),
      getTranslation('bluetoothErrorMessage')
    )
    return false
  }

  // On Android location permissions are needed
  if (Platform.OS === 'android') {
    const locationEnabled = await requestLocationAccess()
    if (!locationEnabled) {
      Alert.alert(
        getTranslation('locationErrorTitle'),
        getTranslation('locationErrorMessage')
      )
      return false
    }
    await BluetoothStateManager.enable()
    await BluetoothStateManager.requestToEnable()
  }

  const state = await BluetoothStateManager.getState()

  // only on Android, on iOS there will be another popup which ask for permission
  const dontRun = state === 'PoweredOff' && Platform.OS === 'android'
  if (dontRun) {
    Alert.alert(
      getTranslation('bluetoothErrorTitle'),
      getTranslation('bluetoothErrorMessage')
    )
    return false
  }
  return true
}

function useInterval(callback: () => any, delay: number) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    //@ts-ignore
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      //@ts-ignore
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
    alignItems: 'center',
    padding: 16,
    paddingBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 20,
    padding: 16,
  },
})

export default ScreenHome
