import React, { useState, useEffect } from 'react'
import { Image, View, StyleSheet } from 'react-native'
import {
  Text,
  Button,
  Title,
  IconButton,
  ProgressBar,
} from 'react-native-paper'

import { Translate } from 'react-translated'
import { getDeviceHash } from './Utils'
import { QueryRenderer, graphql } from 'react-relay'
import RelayEnviroment from './RelayEnvironment'
import {
  InfectionAlertsQuery,
  InfectionAlertsQueryResponse,
  Risk,
} from './__generated__/InfectionAlertsQuery.graphql'

const styles = StyleSheet.create({
  root: {
    paddingTop: 10,
    paddingBottom: 10,
    minHeight: 300,
    width: '100%',
  },
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
  const [uniqueDeviceId, setUniqueDeviceId] = useState<string | undefined>(
    undefined
  )

  // first get the local bluetooth hash of this user so we can query the alerts database
  useEffect(() => {
    const setBluetoothHashAsync = async () => {
      const key = await getDeviceHash()
      setUniqueDeviceId(key)
    }

    setBluetoothHashAsync()
  }, [])

  return (
    <View style={styles.root}>
      {uniqueDeviceId && <AlertRoots uniqueDeviceId={uniqueDeviceId} />}
    </View>
  )
}

// AlertRoots fetches the query in a type-safe manner for this bluetooth hash
function AlertRoots({ uniqueDeviceId }: { uniqueDeviceId: string }) {
  return (
    <QueryRenderer<InfectionAlertsQuery>
      environment={RelayEnviroment}
      query={graphql`
        query InfectionAlertsQuery($uniqueDeviceId: String!) {
          infectedEncounters(hash: $uniqueDeviceId) {
            howManyEncounters
            risk
          }
        }
      `}
      variables={{
        uniqueDeviceId,
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
  const dateString = new Date().toLocaleTimeString()
  const lastFetched: string = dateString.substr(0, dateString.length - 3)

  if (error) {
    return (
      <>
        <Title style={styles.title}>
          <Translate text="errorWhileFetchingAlerts" />
        </Title>
        <Button uppercase={false} onPress={() => retry && retry()}>
          <Translate text="refetchAlerts" />
        </Button>
      </>
    )
  }
  if (!props) {
    return (
      <>
        <ProgressBar />
      </>
    )
  }

  if (props.infectedEncounters.length === 0) {
    return <NoAlerts retry={retry} lastFetched={lastFetched} />
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

function NoAlerts({
  retry,
  lastFetched,
}: {
  lastFetched: string
  retry: (() => void) | null
}) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Title style={styles.title}>
          <Translate text="noAlerts" />
        </Title>
        <Text>{lastFetched}</Text>
        <IconButton
          onPress={() => {
            retry && retry()
          }}
          icon="refresh"
        ></IconButton>
      </View>

      <Image
        source={require('../assets/background.png')}
        style={{ height: 200, width: '90%', maxWidth: 300 }}
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
