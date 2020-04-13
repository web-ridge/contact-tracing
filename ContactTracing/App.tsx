import React, { useState } from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Platform,
  Modal,
} from 'react-native'
import { BleManager, Device } from 'react-native-ble-plx'
import { Checkbox, Button, Text } from 'react-native-paper'
import {
  check,
  request,
  PERMISSIONS,
  Permission,
} from 'react-native-permissions'
import { sha256 } from 'js-sha256'

interface RSSValue {
  min: number
  max: number
  hits: number
}

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
  const rssiValues = React.useRef({})

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

          console.log(scannedDevice)
          var hash = sha256.create()
          hash.update(scannedDevice.id)
          hash.toString()
          console.log({
            id: scannedDevice.id,
            rssi: scannedDevice.rssi,
            centimeters: rssiToCentimetres(scannedDevice.rssi),
            uuid: scannedDevice.id,
            hash,
          })

          //@ts-ignore
          const previous: RSSValue = rssiValues.current[scannedDevice.id]

          // we map rssi values so we can see if device did come closer
          // Als gemeten in negatieve getallen betekent een getal dat dichter bij 0 ligt meestal een beter signaal,
          // een getal dat -50 (min 50) is een redelijk goed signaal,
          // een getal van -70 (min 70) is redelijk terwijl een getal dat -100 (min 100) is helemaal geen signaal heeft.
          // https://iotandelectronics.wordpress.com/2016/10/07/how-to-calculate-distance-from-the-rssi-value-of-the-ble-beacon/
          //@ts-ignore
          rssiValues.current[scannedDevice.id] = previous
            ? {
                hits: previous.hits + 1,
                min:
                  previous.min > scannedDevice.rssi
                    ? scannedDevice.rssi
                    : previous.min,
                max:
                  scannedDevice.rssi > previous.max
                    ? scannedDevice.rssi
                    : previous.max,
              }
            : {
                min: scannedDevice.rssi,
                max: scannedDevice.rssi,
              }

          console.log({ rssiValues: rssiValues.current })
        }
      )
    }
    startProcess()
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={infectionModalOpen}
        statusBarTranslucent={true}
        onRequestClose={() => {
          setInfectionModalOpen(false)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Checklist</Text>
            <Checkbox.Android status={'unchecked'} />
            <Checkbox.Android status={'unchecked'} />
          </View>
        </View>
      </Modal>

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
