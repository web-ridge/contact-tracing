import React, { useState } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { Text, TouchableRipple, RadioButton } from 'react-native-paper'
import { Checkbox } from 'react-native-paper'
import ScreenSymptomsSendButton from './ScreenSymptomsSendButton'
import { Translate } from 'react-translated'

export default function ScreenSymptons() {
  const [checkedSympton, setCheckedSympton] = useState<'symptons' | 'tested'>(
    'symptons'
  )

  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false)

  return (
    <ScrollView>
      <CheckItem
        onPress={() => setCheckedSympton('symptons')}
        checked={checkedSympton === 'symptons'}
      >
        <Text style={{ fontWeight: 'bold' }}>
          <Translate text="symptomIntroduction" />
        </Text>

        <Text>
          <Translate text="symptomText" />
        </Text>
      </CheckItem>

      <Text style={styles.orText}>
        <Translate text="orText" />
      </Text>
      <CheckItem
        onPress={() => setCheckedSympton('tested')}
        checked={checkedSympton === 'tested'}
      >
        <Text>
          <Translate text="testedText" />
        </Text>
      </CheckItem>

      <View style={[styles.symptonItemRoot, { margin: 0, elevation: 0 }]}>
        <TouchableRipple onPress={() => setAcceptedTerms(!acceptedTerms)}>
          <View
            style={[
              styles.symptonItemInner,
              { backgroundColor: 'transparent' },
            ]}
          >
            <View style={styles.symptonItemInnerContent}>
              <Text>
                <Translate text="permissionText" />

                <Text style={styles.permissionTrust}>
                  <Translate text="permissionTrust" />
                </Text>
              </Text>
            </View>
            <View style={styles.symptonItemInnerRight} pointerEvents="none">
              <Checkbox.Android
                status={acceptedTerms ? 'checked' : 'unchecked'}
                color="#242648"
                uncheckedColor="#242648"
              />
            </View>
          </View>
        </TouchableRipple>
      </View>

      <View style={styles.sendButtonContainer}>
        <ScreenSymptomsSendButton disabled={!acceptedTerms} />
      </View>
    </ScrollView>
  )
}
function CheckItem({
  children,
  onPress,
  checked,
}: {
  checked: boolean
  children: any
  onPress: () => any
}) {
  return (
    <View style={styles.symptonItemRoot}>
      <TouchableRipple onPress={onPress}>
        <View style={styles.symptonItemInner}>
          <View style={styles.symptonItemInnerContent}>{children}</View>
          <View style={styles.symptonItemInnerRight} pointerEvents="none">
            <RadioButton.Android
              status={checked ? 'checked' : 'unchecked'}
              color="#242648"
              uncheckedColor="#242648"
              value=""
            />
          </View>
        </View>
      </TouchableRipple>
    </View>
  )
}

const styles = StyleSheet.create({
  symptonItemRoot: {
    margin: 12,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 10,
  },
  symptonItemInner: {
    padding: 24,
    paddingRight: 12,
    overflow: 'hidden',
    // borderWidth: 1,
    // borderColor: '#242648',
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  symptonItemInnerContent: { flex: 1, justifyContent: 'center' },
  symptonItemInnerRight: { justifyContent: 'center' },
  orText: { fontWeight: 'bold', textAlign: 'center', fontSize: 19 },
  sendButtonContainer: { margin: 24, marginTop: 12 },
  permissionTrust: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
})
