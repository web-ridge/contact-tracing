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

  console.log({ previousDataHash })
  console.log({ newHash })
  // if alerts have been changed
  if (
    previousDataHash !== newHash ||
    (!previousDataHash &&
      data &&
      data.infectedEncounters &&
      data.infectedEncounters.length > 0)
  ) {
    PushNotification.localNotification({
      largeIcon: 'ic_stat_sentiment_satisfied_alt', // (optional) default: "ic_launcher"
      smallIcon: 'ic_stat_sentiment_satisfied_alt', // (optional) default: "ic_notification" with fallback for "ic_launcher"
      title: 'Infectiestatus', // (optional)
      message: 'Uw infectiestatus is gewijzigd', // (required)
      // subText: 'This is a subText', // (optional) default: none
      priority: 'high',
      visibility: 'private', // (optional) set notification visibility, default: private
      importance: 'high',
      playSound: true,
      // repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
      // actions: '["Yes", "No"]',
    })

    // so we know the next time if we need to send new notification
    await AsyncStorage.setItem(alertStorageKey, newHash)
  }

  // TODO: add last fetched date
}