// WebRidge Design
import PushNotification from 'react-native-push-notification'
import { fetchQuery, graphql } from 'relay-runtime'
import AsyncStorage from '@react-native-community/async-storage'
import { getInfectedEncountersQueryVariables } from './DatabaseUtils'
import {
  BackgroundInfectionCheckerQuery,
  BackgroundInfectionCheckerQueryResponse,
} from './__generated__/BackgroundInfectionCheckerQuery.graphql'

import RelayEnviroment from './RelayEnvironment'
import { getTranslation, safeLog } from './Utils'
import { Platform } from 'react-native'

// we use this to see if alerts changed since previous aflert
const alertStorageKey = 'alertStorageKeyContactTracing'

const query = graphql`
  query BackgroundInfectionCheckerQuery(
    $deviceHashesOfMyOwn: [DeviceKeyParam!]!
  ) {
    infectedEncounters(deviceHashesOfMyOwn: $deviceHashesOfMyOwn) {
      howManyEncounters
      risk
    }
  }
`

function stringifyInfectedEncounters(
  infectedEncounters: BackgroundInfectionCheckerQueryResponse['infectedEncounters']
): string {
  let a = infectedEncounters.map(
    (infectedEncounter) =>
      `${infectedEncounter?.howManyEncounters}_${infectedEncounter?.risk}`
  )
  a.sort()
  return a.join(',')
}

export async function giveAlerts() {
  // variables contains the secure keys to get own infection status and iOS encounters to check their status
  const variables = await getInfectedEncountersQueryVariables()

  let data: BackgroundInfectionCheckerQueryResponse | undefined
  try {
    data = await fetchQuery<BackgroundInfectionCheckerQuery>(
      RelayEnviroment,
      query,
      variables
    )
  } catch (error) {
    console.log('giveAlerts', { error })
    return
  }

  // TODO: stringify response in short hash on backend side to be more efficient in network

  // these hashes do not need to be secure they are only for notification purposes
  // to see if any alert is added
  const previousDataHashNullable = await AsyncStorage.getItem(alertStorageKey)
  const previousDataHash = previousDataHashNullable || ''
  const newHash = stringifyInfectedEncounters(data.infectedEncounters)

  safeLog(Platform.OS, { previousDataHash })
  safeLog(Platform.OS, { newHash })

  // if alerts have been changed
  if (
    previousDataHash !== newHash ||
    (!previousDataHash &&
      data &&
      data.infectedEncounters &&
      data.infectedEncounters.length > 0)
  ) {
    PushNotification.localNotification({
      largeIcon: 'ic_stat_sentiment_satisfied_alt',
      smallIcon: 'ic_stat_sentiment_satisfied_alt',
      title: getTranslation('infectionStateChangeTitle'),
      message: getTranslation('infectionStateChangeDescription'),
      priority: 'high',
      visibility: 'private',
      importance: 'high',
      playSound: true,
    })
    await AsyncStorage.setItem(alertStorageKey, newHash)
  }
}
