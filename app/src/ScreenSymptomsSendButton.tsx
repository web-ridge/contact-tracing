import React, { useState } from 'react'
import { Button } from 'react-native-paper'

import { Translate } from 'react-translated'
import { commitMutation, graphql } from 'react-relay'
import RelayEnvironment from './RelayEnvironment'
import { ScreenSymptomsSendButtonMutation } from './__generated__/ScreenSymptomsSendButtonMutation.graphql'
import { getEncountersAfter } from './DatabaseUtils'
const mutation = graphql`
  mutation ScreenSymptomsSendButtonMutation(
    $infectedEncounters: InfectedEncountersCreateInput!
  ) {
    createInfectedEncounters(input: $infectedEncounters) {
      ok
    }
  }
`
export default function ScreenSymptomsSendButton({
  disabled,
}: {
  disabled: boolean
}) {
  const [isSending, setIsSending] = useState<boolean>(false)
  const sendContacts = () => {
    const sendContactsAsync = async () => {
      // TODO: fetch contact from encrypted database in the previous 2 weeks

      const twoWeeksAgo = Math.round(
        new Date(Date.now() - 12096e5).getTime() / 1000
      )
      console.log({ twoWeeksAgo })
      const encountersFromLast2Weeks = await getEncountersAfter(twoWeeksAgo)
      commitMutation<ScreenSymptomsSendButtonMutation>(RelayEnvironment, {
        mutation,
        variables: {
          infectedEncounters: {
            infectedEncounters: encountersFromLast2Weeks
              .filter((e) => !!e && !!e.hash && !!e.time)
              .map((e) => ({
                possibleInfectedHash: e.hash,
                rssi: e.rssi,
                hits: e.hits,
                time: e.time,
              })),
          },
        },
        onCompleted: (response, errors) => {
          console.log('Response received from server.')
        },
        onError: (err) => console.error(err),
      })
      // TODO remove all contacts before now
    }
    setIsSending(true)
    sendContactsAsync()
  }
  return (
    <Button
      mode="contained"
      loading={isSending}
      disabled={disabled}
      onPress={disabled || isSending ? () => null : sendContacts}
    >
      <Translate text="sendContactsButtonText" />
    </Button>
  )
}
