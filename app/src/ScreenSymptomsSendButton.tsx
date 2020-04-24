// WebRidge Design

import React, { useState, useEffect } from 'react'
import { Button, Text } from 'react-native-paper'

import { Translate } from 'react-translated'
import { commitMutation, graphql } from 'react-relay'
import RelayEnvironment from './RelayEnvironment'
import { ScreenSymptomsSendButtonMutation } from './__generated__/ScreenSymptomsSendButtonMutation.graphql'
import { getRiskyEncountersOfLastTwoWeeks } from './DatabaseUtils'
import { EncounterSchema, getDatabase } from './Database'
import { syncDevicesInMemoryToLocalDatabase } from './BackgroundBluetoothDeviceScanned'

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
  createKey,
  password,
}: {
  disabled: boolean
  createKey: string
  password: string
}) {
  const [isSending, setIsSending] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [howManyContacts, setHowManyContacts] = useState<number>(0)

  useEffect(() => {
    const updateCountAsync = async () => {
      await syncDevicesInMemoryToLocalDatabase()
      const encountersFromLast2Weeks = await getRiskyEncountersOfLastTwoWeeks()
      setHowManyContacts(encountersFromLast2Weeks.length)
    }
    updateCountAsync()
  }, [error, isSending])

  const sendContacts = () => {
    const sendContactsAsync = async () => {
      setError(false)

      const encountersFromLast2Weeks = await getRiskyEncountersOfLastTwoWeeks()
      console.log({ createKey, password })
      commitMutation<ScreenSymptomsSendButtonMutation>(RelayEnvironment, {
        mutation,
        variables: {
          infectedEncounters: {
            infectionCreateKey: {
              key: createKey,
              password,
            },
            infectedEncounters: encountersFromLast2Weeks
              .filter((e) => !!e && !!e.hash && !!e.time)
              .map((e) => ({
                possibleInfectedHash: e.hash,
                rssi: e.rssi,
                hits: e.hits,
                time: e.time,
                duration: e.duration,
              })),
          },
        },
        onCompleted: async (response, errors) => {
          if (errors && errors.length > 0) {
            console.log({ errors })
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
