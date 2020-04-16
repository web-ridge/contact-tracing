import React, { useState } from 'react'
import { ScrollView, View, TouchableHighlight, StyleSheet } from 'react-native'
import { Text, Button, TouchableRipple, RadioButton } from 'react-native-paper'
import { Checkbox } from 'react-native-paper'

export default function ScreenSymptomsSendButton({
  disabled,
}: {
  disabled: boolean
}) {
  return (
    <Button mode="contained" disabled={disabled}>
      Contacten versturen
    </Button>
  )
}
