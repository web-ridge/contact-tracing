import React from 'react'
import { View, Alert } from 'react-native'
import { StyleSheet, Text } from 'react-native'
import { Translate } from 'react-translated'
import { QRCodeConsumer } from './QRCodeContext'
import { useSafeArea } from 'react-native-safe-area-context'

import QRCodeScanner from 'react-native-qrcode-scanner'
import Header from './Header'
import { Navigation } from 'react-native-navigation'
import { safeLog, getTranslation } from './Utils'

function ScreenScanQRCode({
  componentId,
  onScanned,
}: {
  componentId: string
  onScanned: (key: string, password: string) => any
}) {
  const insets = useSafeArea()

  return (
    <View style={styles.root}>
      <Header title={''} componentId={componentId} light></Header>
      <QRCodeConsumer>
        {({ updateKey, updatePassword }) => (
          <QRCodeScanner
            onRead={(e) => {
              safeLog('ScreenScanQRCode scanned', e.data)

              const keyAndPass: string[] = e.data.split('(((SEP)))')
              if (keyAndPass.length === 2) {
                onScanned(keyAndPass[0], keyAndPass[1])
                Navigation.pop(componentId)
              } else {
                Alert.alert(
                  getTranslation('scanErrorTitle'),
                  getTranslation('scanErrorMessage')
                )
              }
            }}
            topContent={
              <View
                style={{
                  padding: 16,
                  paddingLeft: insets.left + 16,
                  paddingRight: insets.right + 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={styles.centerText}>
                  <Translate text="goToQRLetter" />
                </Text>
              </View>
            }
            showMarker
          />
        )}
      </QRCodeConsumer>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { backgroundColor: '#000', flex: 1 },
  centerText: {
    flex: 1,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
})

export default ScreenScanQRCode
