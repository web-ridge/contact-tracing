import React, { useState, useEffect, useRef } from 'react'
import { commitMutation, graphql } from 'react-relay'

import { ScrollView } from 'react-native'
import { Button, Text } from 'react-native-paper'

// deleteInfectedEncountersOnKeys
// removeDeviceKeys

const deleteInfectedEncountersOnKeysMutation = graphql`
  mutation ScreenDataRemovalRemoveEncountersMutation(
    $deviceHashesOfMyOwn: [DeviceKeyParam!]!
  ) {
    deleteInfectedEncountersOnKeys(keys: $deviceHashesOfMyOwn) {
      ok
    }
  }
`

const removeDeviceKeysMutation = graphql`
  mutation ScreenDataRemovalRemoveDeviceKeysMutation(
    $deviceHashesOfMyOwn: [DeviceKeyParam!]!
  ) {
    removeDeviceKeys(keys: $deviceHashesOfMyOwn) {
      ok
    }
  }
`

export function ScreenDataRemoval() {
  const deleteEncounters = () => {}
  const deleteDeviceKeys = () => {
    commitMutation<DatabaseUtilsCreateDeviceKeyMutation>(RelayEnvironment, {
      mutation: createDeviceKeyMutation,
      variables: {
        deviceKey: {
          hash: newDeviceHash,
          password,
          time,
        },
      },
      onCompleted: async (response, errors) => {
        if (
          response &&
          response.createDeviceKey &&
          response.createDeviceKey.ok
        ) {
          console.log('wrote device key and pass to database')
          database.write(() => {
            database.create(KeysSchema.name, deviceKey)
          })
          return deviceKey
        } else {
          console.log('response is not ok')
        }
      },
      onError: (err) => {
        // keep the old key till there is internet connection
        console.log('Could not renew device key', { err })
      },
    })
  }

  return (
    <ScrollView>
      <Text>
        Verwijder potentiele besmettingsmeldingen die geregistreerd staat op
        mijn nummers
      </Text>
      <Button onPress={() => {}}>Verwijder</Button>
    </ScrollView>
  )
}
