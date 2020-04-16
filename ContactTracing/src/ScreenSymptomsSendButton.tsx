import React from 'react'
import { Button } from 'react-native-paper'

import { Translate } from 'react-translated'

export default function ScreenSymptomsSendButton({
  disabled,
}: {
  disabled: boolean
}) {
  return (
    <Button mode="contained" disabled={disabled}>
      <Translate text="sendContactsButtonText" />
    </Button>
  )
}
