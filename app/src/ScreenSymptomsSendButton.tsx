import React, { useState } from 'react'
import { Button, Text } from 'react-native-paper'

import { Translate } from 'react-translated'
import { commitMutation, graphql } from 'react-relay'
import RelayEnvironment from './RelayEnvironment'
import { ScreenSymptomsSendButtonMutation } from './__generated__/ScreenSymptomsSendButtonMutation.graphql'
import { getEncountersAfter } from './DatabaseUtils'
import { getStartOfRiskUnix } from './Utils'
import { EncounterSchema, getDatabase } from './Database'

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
  const [error, setError] = useState<boolean>(false)
  const [howManyContacts, setHowManyContacts] = useState<number>(0)

  const sendContacts = () => {
    const sendContactsAsync = async () => {
      // TODO: fetch contact from encrypted database in the previous 2 weeks
      setError(false)

      const encountersFromLast2Weeks = await getEncountersAfter(
        getStartOfRiskUnix()
      )

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
        onCompleted: async (response, errors) => {
          if (errors && errors.length > 0) {
            setError(true)
            return
          }
          const database = await getDatabase()
          database.write(() => {
            database.delete(database.objects(EncounterSchema.name))
            setIsSending(false)
          })
        },
        onError: (err) => {
          console.log({ err })
          setIsSending(false)
          setError(true)
        },
      })

      // TODO remove all contacts before now
    }
    setIsSending(true)
    sendContactsAsync()
  }
  return (
    <>
      {error && (
        <Text style={{ fontWeight: 'bold', paddingBottom: 12 }}>
          <Translate text="sendingContactsErrorText" />
        </Text>
      )}
      <Button
        uppercase={false}
        mode="contained"
        loading={isSending}
        disabled={disabled}
        onPress={disabled || isSending ? () => null : sendContacts}
      >
        {error ? (
          <Translate
            text="resendContactsButtonText {howManyContacts}"
            data={{ howManyContacts: `${howManyContacts}` }}
          />
        ) : (
          <Translate
            text="sendContactsButtonText {howManyContacts}"
            data={{ howManyContacts: `${howManyContacts}` }}
          />
        )}
      </Button>
    </>
  )
}
