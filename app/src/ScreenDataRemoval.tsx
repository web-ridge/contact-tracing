// WebRidge Design

import React, { useState } from 'react'
import { commitMutation, graphql } from 'react-relay'

import { ScrollView, View, StyleSheet } from 'react-native'
import { Button, Text } from 'react-native-paper'

import { Translate } from 'react-translated'
import AsyncStorage from '@react-native-community/async-storage'
import RNSecureStorage from 'rn-secure-storage'

import RelayEnvironment from './RelayEnvironment'
import { getDeviceKeys, deviceKeysToParams } from './DatabaseUtils'
import { encryptionDatabaseKey } from './Utils'
import { stopTracing } from './BackgroundJob'
import Header from './Header'
import { ScreenDataRemovalRemoveDeviceKeysMutation } from './__generated__/ScreenDataRemovalRemoveDeviceKeysMutation.graphql'
import { ScreenDataRemovalRemoveEncountersMutation } from './__generated__/ScreenDataRemovalRemoveEncountersMutation.graphql'
import { getDatabase } from './Database'

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

export function ScreenDataRemoval({ componentId }: { componentId: string }) {
  const [encounterState, setEncounterState] = useState<
    '' | 'loading' | 'error'
  >('')
  const [deviceKeyState, setDeviceKeyState] = useState<
    '' | 'loading' | 'error'
  >('')

  const [localState, setLocalState] = useState<'' | 'loading' | 'error'>('')

  const deleteEncounterAlerts = () => {
    const deleteEncounterAlertsAsync = async () => {
      const deviceKeys = await getDeviceKeys()

      commitMutation<ScreenDataRemovalRemoveEncountersMutation>(
        RelayEnvironment,
        {
          mutation: deleteInfectedEncountersOnKeysMutation,
          variables: {
            deviceHashesOfMyOwn: deviceKeysToParams(deviceKeys),
          },
          onCompleted: async (response, errors) => {
            if (response.deleteInfectedEncountersOnKeys.ok) {
              setEncounterState('')
            } else {
              setEncounterState('error')
            }
          },
          onError: (err) => {
            setEncounterState('error')
          },
        }
      )
    }
    setEncounterState('loading')
    deleteEncounterAlertsAsync()
  }
  const deleteDeviceKeys = () => {
    const deleteDeviceKeysAsync = async () => {
      const deviceKeys = await getDeviceKeys()

      stopTracing()

      commitMutation<ScreenDataRemovalRemoveDeviceKeysMutation>(
        RelayEnvironment,
        {
          mutation: removeDeviceKeysMutation,
          variables: {
            deviceHashesOfMyOwn: deviceKeysToParams(deviceKeys),
          },
          onCompleted: async (response, errors) => {
            if (response.removeDeviceKeys.ok) {
              setDeviceKeyState('')
            } else {
              setDeviceKeyState('error')
            }
          },
          onError: (err) => {
            setDeviceKeyState('error')
          },
        }
      )
    }
    setDeviceKeyState('loading')
    deleteDeviceKeysAsync()
  }

  const deleteAllLocalData = () => {
    stopTracing()
    const clearAllAsync = async () => {
      try {
        await AsyncStorage.clear()
        const database = await getDatabase()
        database.write(() => {
          database.deleteAll()
        })
        await RNSecureStorage.remove(encryptionDatabaseKey)
        setLocalState('')
      } catch (e) {
        console.log('deleteAllLocalData', e)
        setLocalState('error')
      }

      console.log('Done.')
    }
    setLocalState('loading')
    clearAllAsync()
  }

  return (
    <>
      <Header
        componentId={componentId}
        title={<Translate text="myDataTitle" />}
      />
      <ScrollView>
        <View style={{ padding: 24 }}>
          <View style={styles.section}>
            <Text>
              <Translate text="myDataEncounterAlerts" />
            </Text>

            {encounterState === 'error' && (
              <Text>
                <Translate text="myDataRemovalFailed" />
              </Text>
            )}
            <Button
              style={styles.button}
              loading={encounterState === 'loading'}
              mode="contained"
              onPress={deleteEncounterAlerts}
              uppercase={false}
            >
              {encounterState === 'error' ? (
                <Translate text="myDataRemovalButtonRetry" />
              ) : (
                <Translate text="myDataRemovalButton" />
              )}
            </Button>
          </View>
          <View style={styles.section}>
            <Text>
              <Translate text="myDeviceKeys" />
            </Text>

            {deviceKeyState === 'error' && (
              <Text style={styles.error}>
                <Translate text="myDataRemovalFailed" />
              </Text>
            )}
            <Button
              style={styles.button}
              loading={deviceKeyState === 'loading'}
              mode="outlined"
              onPress={deleteDeviceKeys}
              uppercase={false}
            >
              {deviceKeyState === 'error' ? (
                <Translate text="myDataRemovalButtonRetry" />
              ) : (
                <Translate text="myDataRemovalButton" />
              )}
            </Button>
          </View>
          <View style={styles.section}>
            <Text>
              <Translate text="myLocalState" />
            </Text>

            {localState === 'error' && (
              <Text style={styles.error}>
                <Translate text="myDataRemovalFailed" />
              </Text>
            )}
            <Button
              style={styles.button}
              loading={localState === 'loading'}
              mode="outlined"
              onPress={deleteAllLocalData}
              uppercase={false}
            >
              {localState === 'error' ? (
                <Translate text="myDataRemovalButtonRetry" />
              ) : (
                <Translate text="myDataRemovalButton" />
              )}
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  button: {
    marginTop: 12,
  },
  error: {
    fontWeight: 'bold',
  },
})
