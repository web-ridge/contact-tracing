import React from 'react'
import { ScrollView, View, TouchableHighlight } from 'react-native'
import { Text, Button, TouchableRipple } from 'react-native-paper'
import { Checkbox } from 'react-native-paper'

const ScreenSymptons = () => {
  return (
    <ScrollView>
      <TouchableRipple
        onPress={() => {}}
        style={{ margin: 12, borderRadius: 10, overflow: 'hidden' }}
      >
        <View
          style={{
            padding: 12,
            overflow: 'hidden',

            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 10,
          }}
        >
          <Checkbox.Android status={'checked'}></Checkbox.Android>
          <Text>Ik heb alle onderstaande klachten </Text>

          <Text>Verkoudheid</Text>
          <Text>Niezen</Text>
          <Text>oesten</Text>
          <Text>Keelpijn</Text>
          <Text>Moeilijk ademen</Text>
          <Text>Koorts</Text>
        </View>
      </TouchableRipple>
      <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 19 }}>
        OF
      </Text>
      <View
        style={{
          padding: 12,
          margin: 12,
          borderWidth: 1,
          borderColor: '#000',
          borderRadius: 10,
        }}
      >
        <Checkbox.Android status={'checked'}></Checkbox.Android>
        <Text>Ik ben getest op COVID-19 </Text>
      </View>

      <View style={{ padding: 24 }}>
        <Checkbox.Android status={'checked'}></Checkbox.Android>
        <Text>
          Ik ga ermee akkoord dat mijn lokaal opgeslagen Bluetooth-contacten van
          de afgelopen 2 weken worden doorgestuurd zodat andere telefoons een
          melding krijgen als ze in contact geweest zijn met mij.{' '}
          <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>
            Deze zijn op geen enkele manier te herleiden naar jou.
          </Text>
        </Text>
        <View style={{ height: 24 }}></View>
        <Button mode="contained">Contacten versturen</Button>
      </View>
    </ScrollView>
  )
}
export default ScreenSymptons
