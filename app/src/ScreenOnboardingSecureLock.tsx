// WebRidge Design

import React, { useState } from 'react'
import { View, ScrollView, StyleSheet, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import Header from './Header'
import { DefaultFooter } from './ScreenOnboardingFooter'
import { getDatabase } from './Database'
import { Translate } from 'react-translated'
import { goToOnboardingPermissionScreen } from './Screens'

const styles = StyleSheet.create({
  body: {
    padding: 12,
  },
  paragraph: {
    marginTop: 12,
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
        <View style={styles.body}>
          <Text style={styles.paragraph}>
            <Translate text="onboardingLockerFirst" />
          </Text>
          <Text style={styles.paragraph}>
            <Translate text="onboardingLockerSecond" />
          </Text>
          <Text style={styles.paragraph}>
            <Translate text="onboardingLockerThird" />
          </Text>
        </View>
      </ScrollView>
      <DefaultFooter
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
              Alert.alert('Kon geen veilige kluis maken op je apparaat')
            }
          }
          setCreating(true)
          createSecureLockerAsync()
        }}
        onPressInfo={() => {
          Alert.alert('AES-256+SHA2 encryptie and a 64-byte encryption key')
        }}
      />
    </>
  )
}
