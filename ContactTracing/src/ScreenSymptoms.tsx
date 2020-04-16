import React, { useState } from 'react'
import { ScrollView, View, TouchableHighlight, StyleSheet } from 'react-native'
import { Text, Button, TouchableRipple, RadioButton } from 'react-native-paper'
import { Checkbox } from 'react-native-paper'

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
})

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

const ScreenSymptons = () => {
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
          Ik heb alle onderstaande klachten{' '}
        </Text>

        <Text>Verkoudheid</Text>
        <Text>Niezen</Text>
        <Text>Hoesten</Text>
        <Text>Keelpijn</Text>
        <Text>Moeilijk ademen</Text>
        <Text>Koorts</Text>
      </CheckItem>

      <Text style={styles.orText}>of</Text>
      <CheckItem
        onPress={() => setCheckedSympton('tested')}
        checked={checkedSympton === 'tested'}
      >
        <Text>Ik ben getest op COVID-19 </Text>
      </CheckItem>

      <View style={[styles.symptonItemRoot, { margin: 0, elevation: 0 }]}>
        <TouchableRipple onPress={() => {}}>
          <View
            style={[
              styles.symptonItemInner,
              { backgroundColor: 'transparent' },
            ]}
          >
            <View style={styles.symptonItemInnerContent}>
              <Text>
                Ik ga ermee akkoord dat mijn lokaal opgeslagen
                Bluetooth-contacten van de afgelopen 2 weken worden doorgestuurd
                zodat andere telefoons een melding krijgen als ze in contact
                geweest zijn met jou.
                <Text
                  style={{
                    fontWeight: 'bold',
                    textDecorationLine: 'underline',
                  }}
                >
                  Deze zijn op geen enkele manier te herleiden naar jou.
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

      <View style={{ margin: 24, marginTop: 12 }}>
        <Button mode="contained" disabled={!acceptedTerms}>
          Contacten versturen
        </Button>
      </View>
    </ScrollView>
  )
}
export default ScreenSymptons
