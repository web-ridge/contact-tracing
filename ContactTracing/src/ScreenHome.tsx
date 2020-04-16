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
import InfectionAlerts from './InfectionAlerts'
import { startTracing, stopTracing } from './JobTracing'
import { goToSymptonsScreen } from './Screens'

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

function ScreenHome({ componentId }: { componentId: string }) {
  const [isTracking, setIsTracking] = useState<boolean>(
    BackgroundService.isRunning()
  )

  const startTracingPressed = () => {
    const startTracingAsync = async () => {
      // console.log('doSynced')
      const bluetoothStatus = await requestBluetoothStatus()
      // console.log({ bluetoothStatus })
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
              >
                <Translate text="stopTracking" />
              </Button>
              <View style={{ height: 12 }} />
              <Button
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
                  width: 300,
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
      </ScrollView>
    </>
  )
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
    padding: 24,
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
