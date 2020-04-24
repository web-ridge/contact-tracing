// WebRidge Design

import React, { useState } from 'react'
import { View, Image, ScrollView, StyleSheet, Alert } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'

import { Text } from 'react-native-paper'
import Header from './Header'
import ScreenOnboardingFooter from './ScreenOnboardingFooter'
import { getDatabase } from './Database'
import { Translate } from 'react-translated'
import { goToOnboardingPermissionScreen } from './Screens'
import { getTranslation } from './Utils'

const styles = StyleSheet.create({
  body: {
    padding: 12,
    paddingBottom: 24,
  },
  paragraph: {
    marginTop: 12,
    fontSize: 16,
  },
})

export default function ScreenOnboardingSecureLock({
  componentId,
}: {
  componentId: string
}) {
  const [creating, setCreating] = useState<boolean>(false)
  return (
    <>
      <Header
        title={<Translate text="lockerTitle" />}
        componentId={componentId}
      />

      <ScrollView>
        <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'never' }}>
          <View style={styles.body}>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../assets/password.png')}
                style={{ width: 150, height: 150 }}
              />
            </View>
            <Text style={styles.paragraph}>
              <Translate text="onboardingLockerFirst" />
            </Text>
            <Text style={styles.paragraph}>
              <Translate text="onboardingLockerThird" />
            </Text>
          </View>
        </SafeAreaView>
      </ScrollView>

      <ScreenOnboardingFooter
        loading={creating}
        onPressOk={() => {
          const createSecureLockerAsync = async () => {
            try {
              await getDatabase()
              goToOnboardingPermissionScreen(componentId)
              setCreating(false)
            } catch (error) {
              console.log({ error })
              setCreating(false)
              Alert.alert(
                getTranslation('lockerErrorTitle'),
                getTranslation('lockerErrorMessage')
              )
            }
          }
          setCreating(true)
          createSecureLockerAsync()
        }}
        onPressInfo={() => {
          Alert.alert(
            getTranslation('lockerInfoTitle'),
            getTranslation('lockerInfoMessage')
          )
        }}
      />
    </>
  )
}
