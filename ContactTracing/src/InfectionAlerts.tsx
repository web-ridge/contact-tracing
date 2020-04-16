import React, { useState, useEffect } from 'react'
import { Image, View, StyleSheet } from 'react-native'
import { Text, Button, Title } from 'react-native-paper'
import DeviceInfo from 'react-native-device-info'
import RNSimpleCrypto from 'react-native-simple-crypto'
import { Translate } from 'react-translated'

import { QueryRenderer, graphql } from 'react-relay'
import RelayEnviroment from './RelayEnvironment'
import {
  InfectionAlertsQuery,
  InfectionAlertsQueryResponse,
  Risk,
} from './__generated__/InfectionAlertsQuery.graphql'

const styles = StyleSheet.create({
  root: { paddingTop: 10, paddingBottom: 10 },
  title: { fontWeight: 'bold', margin: 12, textAlign: 'center' },
  alertRoot: {
    backgroundColor: '#fff',
    margin: 12,

    elevation: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTag: {
    backgroundColor: 'red',
    alignSelf: 'flex-start',
    padding: 5,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 10,
    margin: 12,
  },
  alertTagText: {
    color: '#fff',
  },
  alertTextContainer: { flex: 1, padding: 12 },
  alertText: { fontWeight: 'bold' },
})

export default function InfectionAlerts() {
  const [bluetoothHash, setBluetoothHash] = useState<string | undefined>(
    undefined
  )

  // first get the local bluetooth hash of this user so we can query the alerts database
  useEffect(() => {
    DeviceInfo.getMacAddress().then(async (mac) => {
      const bluetoothHash = await RNSimpleCrypto.SHA.sha256(mac)
      setBluetoothHash(bluetoothHash)
    })
  }, [])

  return (
    <View style={styles.root}>
      {bluetoothHash && <AlertRoots bluetoothHash={bluetoothHash} />}
    </View>
  )
}

// AlertRoots fetches the query in a type-safe manner for this bluetooth hash
function AlertRoots({ bluetoothHash }: { bluetoothHash: string }) {
  return (
    <QueryRenderer<InfectionAlertsQuery>
      environment={RelayEnviroment}
      query={graphql`
        query InfectionAlertsQuery($bluetoothHash: String!) {
          infectedEncounters(hash: $bluetoothHash) {
            howManyEncounters
            risk
          }
        }
      `}
      variables={{
        bluetoothHash,
      }}
      render={renderAlerts}
    />
  )
}

// renderAlerts renders the query response or error
const renderAlerts = ({
  error,
  props,
  retry,
}: {
  error: Error | null
  props: InfectionAlertsQueryResponse | null
  retry: (() => void) | null
}) => {
  if (error || !props) {
    return (
      <>
        <Title style={styles.title}>
          <Translate text="errorWhileFetchingAlerts" />
        </Title>
        <Button onPress={() => retry && retry()}>
          <Translate text="refetchAlerts" />
        </Button>
      </>
    )
  }

  if (props.infectedEncounters.length === 0) {
    return <NoAlerts />
  }
  // const infectedEncounters = [
  //   {
  //     howManyEncounters: 2,
  //     risk: 'HIGH_RISK',
  //   },
  // ] as InfectionAlertsQueryResponse['infectedEncounters']

  return (
    <>
      <Title style={styles.title}>
        <Translate text="alerts" />
      </Title>
      {props.infectedEncounters.map((infectedEncounter, index) => (
        <Alert key={index} infectedEncounter={infectedEncounter!} />
      ))}
    </>
  )
}

function Alert({
  infectedEncounter,
}: {
  infectedEncounter: InfectionAlertsQueryResponse['infectedEncounters'][0]
}) {
  const howMany = infectedEncounter!.howManyEncounters
  return (
    <View style={styles.alertRoot}>
      <View
        style={[
          styles.alertTag,
          { backgroundColor: getTagColor(infectedEncounter!.risk) },
        ]}
      >
        <Text style={styles.alertTagText}>
          <Translate text={infectedEncounter!.risk} />
        </Text>
      </View>
      <View style={styles.alertTextContainer}>
        <Text style={styles.alertText}>
          {howMany}{' '}
          {howMany > 1 ? (
            <Translate text={'labelForEncounters'} />
          ) : (
            <Translate text={'labelForEncounter'} />
          )}
        </Text>
      </View>
    </View>
  )
}

function NoAlerts() {
  return (
    <View style={{ alignItems: 'center' }}>
      <Title style={styles.title}>
        <Translate text="noAlerts" />
      </Title>
      <Image
        source={require('../assets/background.png')}
        style={{ height: 200, width: 300 }}
        resizeMode="contain"
      ></Image>
    </View>
  )
}

function getTagColor(risk: Risk) {
  if (risk === 'HIGH_RISK') {
    return 'red'
  }
  if (risk === 'MIDDLE_RISK') {
    return 'orange'
  }
  if (risk === 'LOW_RISK') {
    return 'green'
  }
}