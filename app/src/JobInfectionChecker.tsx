import { fetchQuery, graphql } from 'relay-runtime'
import RelayEnviroment from './RelayEnvironment'
import AsyncStorage from '@react-native-community/async-storage'
import { getInfectedEncountersQueryVariables } from './DatabaseUtils'
import {
  JobInfectionCheckerQuery,
  JobInfectionCheckerQueryResponse,
} from './__generated__/JobInfectionCheckerQuery.graphql'

// we use this to see if alerts changed since previous alert
const alertStorageKey = 'alertStorageKeyContactTracing'

const query = graphql`
  query JobInfectionCheckerQuery($bluetoothHash: String!) {
    infectedEncounters(deviceHashesOfMyOwn: $bluetoothHash) {
      howManyEncounters
      risk
    }
  }
`

function stringifyInfectedEncounters(
  infectedEncounters: JobInfectionCheckerQueryResponse['infectedEncounters']
) {
  return infectedEncounters
    .map(
      (infectedEncounter) =>
        `${infectedEncounter?.howManyEncounters}_${infectedEncounter?.risk}`
    )
    .join(',')
}

export async function giveAlerts() {
  const variables = await getInfectedEncountersQueryVariables()
  const data = await fetchQuery<JobInfectionCheckerQuery>(
    RelayEnviroment,
    query,
    variables
  )

  // TODO: stringify response in short hash on backend side to be more efficient in network

  // these hashes do not need to be secure they are only for notification purposes
  // to see if any alert is added
  const previousDataHash = await AsyncStorage.getItem(alertStorageKey)
  const newHash = stringifyInfectedEncounters(data.infectedEncounters)

  // no previous notifications or changed alerts
  if (previousDataHash !== newHash || !previousDataHash) {
    // TODO -> find library without all firebase shizzle to just do local notifications
    //@ts-ignore
    // let localNotification = Notifications.postLocalNotification({
    //   // TODO: translate
    //   body: 'Er zijn wijzigingen in besmettingsgevaar',
    //   title: 'Wijzigingen in besmettingsgevaar',
    //   //   sound: 'chime.aiff',
    //   //   silent: false
    //   silent: true,
    //   category: 'SOME_CATEGORY',
    //   userInfo: {},
    // })
  }
  // so we know the next time if we need to send new notification
  await AsyncStorage.setItem(alertStorageKey, newHash)

  // TODO: add last fetched date
}
