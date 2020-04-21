// WebRidge Design

import React, { useState } from 'react'
import {
  View,
  Platform,
  Linking,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native'
import { Button, Text, TouchableRipple, Checkbox } from 'react-native-paper'
import { Translate } from 'react-translated'
import { requestBluetoothStatus, requestLocationAccess } from './Utils'
import AsyncStorage from '@react-native-community/async-storage'

import Header from './Header'
import { DefaultFooter } from './ScreenOnboardingFooter'
import { Navigation } from 'react-native-navigation'

const styles = StyleSheet.create({
  privacyButton: {
    margin: 12,
  },
  body: {
    padding: 12,
    flex: 1,
  },
})

export default function ScreenOnboardingPermission({
  componentId,
}: {
  componentId: string
}) {
  const [agreed, setAgreed] = useState<boolean>(false)

  const agreeWithAllThings = () => {
    const agreeWithAllThingsAsync = async () => {
      const bluetoothStatus = await requestBluetoothStatus()

      if (bluetoothStatus !== 'granted') {
        console.log('bluetooth not enabled', { bluetoothStatus })
        // TODO: translate
        Alert.alert('Bluetooth', 'Bluetooth moet aan staan')
        return
      }

      // On Android location permissions are needed
      if (Platform.OS === 'android') {
        const locationEnabled = await requestLocationAccess()
        if (!locationEnabled) {
          // TODO: translate
          Alert.alert('Locatie', 'Locatie moeten aan staan')
          return
        }
      }
      try {
        await AsyncStorage.setItem('contactTracingOnboardingOk', 'true')
      } catch (error) {
        // TODO: translate
        Alert.alert('Helaas', 'Kon je acceptatie niet opslaan')
        return
      }

      Navigation.popToRoot(componentId)
    }
    agreeWithAllThingsAsync()
  }

  return (
    <>
      <Header
        title={<Translate text={'bluetoothScreenTitle'} />}
        componentId={componentId}
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.body}>
          <Text>
            <Translate text="bluetoothPermissionText" />
          </Text>
          <Button
            mode="outlined"
            icon={'chevron-right'}
            onPress={() =>
              Linking.openURL(
                'https://www.contactentraceren.nl/Privacyverklaring.pdf'
              )
            }
            style={styles.privacyButton}
          >
            <Translate text="permissionTrustPrivacyTermsClickText" />
          </Button>
          <TouchableRipple onPress={() => setAgreed((prev) => !prev)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View>
                <Checkbox.Android
                  status={agreed ? 'checked' : 'unchecked'}
                  color="#242648"
                  uncheckedColor="#242648"
                />
              </View>
              <View style={{ flex: 1, paddingLeft: 6 }}>
                <Text>
                  <Translate text="permissionBluetoothTrustPrivacyTermsText" />
                </Text>
              </View>
            </View>
          </TouchableRipple>
          {Platform.OS === 'android' && (
            <>
              <View style={{ flex: 1 }}></View>
              <View style={{ padding: 12 }}>
                <Text>
                  <Translate text="bluetoothAndroid" />
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      <DefaultFooter
        onPressInfo={() => {}}
        onPressOkLabel={<Translate text="onboardingDone" />}
        onPressOk={() => {
          if (!agreed) {
            // TODO: translate
            Alert.alert(
              'Akkoord',
              'Je moet eerst akkoord gaan met de voorwaarden voordat je verder kan'
            )
          } else {
            agreeWithAllThings()
          }
        }}
      />
    </>
  )
}
