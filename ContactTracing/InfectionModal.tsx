import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {Checkbox, Button, Portal, Title, Text} from 'react-native-paper';
import {check, request, PERMISSIONS} from 'react-native-permissions';

async function requestBluetoothStatus() {
  const permission = Platform.select({
    ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
    android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  });
  // can be done in parallel
  let bluetoothStatus = await check(permission);
  if (bluetoothStatus === 'denied') {
    bluetoothStatus = await request(permission);
  }
  return bluetoothStatus;
}

function App() {
  const [isTracking, setIsTracking] = useState(false);
  const [infectionModalOpen, setInfectionModalOpen] = useState(false);
  const manager = React.useRef();
  const startTracing = () => {
    //

    async function startProcess() {
      const bluetoothStatus = await requestBluetoothStatus();
      if (bluetoothStatus === 'denied') {
        alert('Geen toestemming tot Bluetooth');
        return;
      }
      if (!manager.current) {
        manager.current = new BleManager({
          // restoreStateIdentifier
          // restoreStateFunction
        });
      }
      setIsTracking(true);
      manager.current.startDeviceScan(
        null, // uuids
        {}, // options
        (error, scannedDevice) => {
          console.log({
            error,
          });
          if (error) {
          } else {
            console.log({
              id: scannedDevice.id,
              signalStrength: scannedDevice.rssi,
            });
          }
        },
      );
    }
    startProcess();
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={infectionModalOpen}
        statusBarTranslucent={true}
        onRequestClose={() => {
          setInfectionModalOpen(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Checklist</Text>
            <Checkbox.Android status={'unchecked'} />
            <Checkbox.Android status={'unchecked'} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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
});

export default App;
