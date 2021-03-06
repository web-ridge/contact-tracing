// WebRidge Design

import React, { useState, useEffect } from 'react'
import { Image, View, StyleSheet } from 'react-native'
import { Text, Button, IconButton, ProgressBar } from 'react-native-paper'
import { Translate } from 'react-translated'
import { getInfectedEncountersQueryVariables } from './DatabaseUtils'
import { QueryRenderer, graphql } from 'react-relay'
import RelayEnviroment from './RelayEnvironment'
import {
  InfectionAlertsQuery,
  InfectionAlertsQueryResponse,
  Risk,
  InfectionAlertsQueryVariables,
} from './__generated__/InfectionAlertsQuery.graphql'

const styles = StyleSheet.create({
  root: {
    paddingTop: 10,
    paddingBottom: 10,
    minHeight: 300,
    width: '100%',
  },
  titleRoot: {
    margin: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
    textAlign: 'center',
  },
  alertRoot: {
    backgroundColor: '#fff',
    margin: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.14,
    shadowRadius: 6.27,

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

function InfectionTitle({
  lastFetched,
  retry,
}: {
  lastFetched: string
  retry?: () => any
}) {
  return (
    <View style={styles.titleRoot}>
      <Text style={styles.title}>
        <Translate text="noAlerts" />
      </Text>
      <Text>{lastFetched}</Text>
      {retry && (
        <IconButton
          onPress={() => {
            retry()
          }}
          icon="refresh"
        ></IconButton>
      )}
    </View>
  )
}

export default function InfectionAlerts({
  screenRenders,
}: {
  screenRenders: number
}) {
  const [
    variables,
    setVariables,
  ] = useState<InfectionAlertsQueryVariables | null>(null)

  // first get the local bluetooth hash of this user so we can query the alerts database
  useEffect(() => {
    const setVariablesAsync = async () => {
      const vars = await getInfectedEncountersQueryVariables()
      setVariables(vars)
    }

    setVariablesAsync()
  }, [screenRenders])

  return (
    <View style={styles.root}>
      {variables && (
        <AlertRoots variables={variables} screenRenders={screenRenders} />
      )}
    </View>
  )
}

// AlertRoots fetches the query in a type-safe manner for this bluetooth hash
function AlertRoots({
  variables,
  screenRenders,
}: {
  screenRenders: number
  variables: InfectionAlertsQueryVariables
}) {
  return (
    <QueryRenderer<InfectionAlertsQuery>
      environment={RelayEnviroment}
      query={graphql`
        query InfectionAlertsQuery($deviceHashesOfMyOwn: [DeviceKeyParam!]!) {
          infectedEncounters(deviceHashesOfMyOwn: $deviceHashesOfMyOwn) {
            howManyEncounters
            risk
          }
        }
      `}
      variables={{ ...variables, screenRenders }}
      render={renderAlerts}
      fetchPolicy="store-and-network"
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
        <Text style={styles.title}>
          <Translate text="errorWhileFetchingAlerts" />
        </Text>
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

  return (
    <>
      <InfectionTitle lastFetched={lastFetched} retry={retry!} />
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
      <InfectionTitle lastFetched={lastFetched} retry={retry!} />

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
