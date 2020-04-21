import React, { useContext, createContext, useState } from 'react'
import { View, Alert } from 'react-native'
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native'
import { Translate } from 'react-translated'
import { QRCodeConsumer } from './QRCodeContext'

import QRCodeScanner from 'react-native-qrcode-scanner'
import Header from './Header'
import { Navigation } from 'react-native-navigation'

function ScreenScanQRCode({ componentId, onScanned }: { componentId: string }) {
  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      <Header title={''} componentId={componentId}></Header>
      <QRCodeConsumer>
        {({ updateKey, updatePassword }) => (
          <QRCodeScanner
            onRead={(e) => {
              console.log('ON REAd!!!')
              console.log(e.data)
              const keyAndPass: string[] = e.data.split('(((SEP)))')
              if (keyAndPass.length === 2) {
                onScanned(keyAndPass[0], keyAndPass[1])
                Navigation.pop(componentId)
              } else {
                // TODO; translate
                Alert.alert('Fout', 'Kon QR-code niet scannen')
              }
            }}
            topContent={
              <Text style={styles.centerText}>
                <Translate text="goToQRLetter" />
              </Text>
            }
            showMarker
          />
        )}
      </QRCodeConsumer>
    </View>
  )
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
})

export default ScreenScanQRCode
