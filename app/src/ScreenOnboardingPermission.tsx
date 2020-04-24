// WebRidge Design

import React, { useState } from 'react'
import {
  View,
  Platform,
  Linking,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { Button, Text, TouchableRipple, Checkbox } from 'react-native-paper'
import { Translate } from 'react-translated'
import AsyncStorage from '@react-native-community/async-storage'
import SafeAreaView from 'react-native-safe-area-view'
import {
  requestBluetoothStatus,
  requestLocationAccess,
  safeLog,
  getTranslation,
} from './Utils'

import Header from './Header'
import ScreenOnboardingFooter from './ScreenOnboardingFooter'

const styles = StyleSheet.create({
  privacyButton: {
    margin: 12,
    marginTop: 24,
  },
  body: {
    padding: 12,
    flex: 1,
    paddingBottom: 24,
  },
  paragraph: {
    marginTop: 12,
    fontSize: 16,
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
      await requestBluetoothStatus()

      // On Android location permissions are needed
      if (Platform.OS === 'android') {
        await requestLocationAccess()
      }

      try {
        await AsyncStorage.setItem('contactTracingOnboardingOk', 'true')
      } catch (error) {
        Alert.alert(
          getTranslation('onboardingSaveErrorTitle'),
          getTranslation('onboardingSaveErrorMessage')
        )
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
        <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'never' }}>
          <View style={styles.body}>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../assets/bluetooth.png')}
                style={{ width: 150, height: 150 }}
              />
            </View>
            <Text style={styles.paragraph}>
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
            <View style={{ borderRadius: 10, overflow: 'hidden' }}>
              <TouchableRipple onPress={() => setAgreed((prev) => !prev)}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                  }}
                >
                  <View>
                    <Checkbox.Android
                      status={agreed ? 'checked' : 'unchecked'}
                      color="#242648"
                      uncheckedColor="#242648"
                    />
                  </View>
                  <View style={{ flex: 1, paddingLeft: 6 }}>
                    <Text style={[styles.paragraph, { marginTop: 0 }]}>
                      <Translate text="permissionBluetoothTrustPrivacyTermsText" />
                    </Text>
                  </View>
                </View>
              </TouchableRipple>
            </View>
            {Platform.OS === 'android' && (
              <>
                <View style={{ flex: 1 }}></View>
                <View style={{ padding: 12 }}>
                  <Text style={styles.paragraph}>
                    <Translate text="bluetoothAndroid" />
                  </Text>
                </View>
              </>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
      <ScreenOnboardingFooter
        onPressInfo={() => {}}
        onPressOkLabel={<Translate text="permissionOkLabel" />}
        onPressOk={() => {
          if (!agreed) {
            Alert.alert(
              getTranslation('acceptErrorTitle'),
              getTranslation('acceptErrorMessage')
            )
          } else {
            agreeWithAllThings()
          }
        }}
      />
    </>
  )
}
