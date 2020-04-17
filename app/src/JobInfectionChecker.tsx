import { fetchQuery, graphql } from 'relay-runtime'
import RelayEnviroment from './RelayEnvironment'
import DeviceInfo from 'react-native-device-info'
import RNSimpleCrypto from 'react-native-simple-crypto'
import {
  JobInfectionCheckerQuery,
  JobInfectionCheckerQueryResponse,
} from './__generated__/JobInfectionCheckerQuery.graphql'
import AsyncStorage from '@react-native-community/async-storage'
import { Notifications } from 'react-native-notifications'

// we use this to see if alerts changed since previous alert
const alertStorageKey = 'alertStorageKeyContactTracing'

const query = graphql`
  query JobInfectionCheckerQuery($bluetoothHash: String!) {
    infectedEncounters(hash: $bluetoothHash) {
      howManyEncounters
      risk
    }
  }
`

let bluetoothHash: string

async function getBluetoothHash(): Promise<string> {
  if (bluetoothHash) {
    return bluetoothHash
  }
  const bluetoothID = await DeviceInfo.getMacAddress()
  const bHash = await RNSimpleCrypto.SHA.sha256(bluetoothID)
  bluetoothHash = bHash
  return bHash
}

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
  const bluetoothHash = await getBluetoothHash()
  const data = await fetchQuery<JobInfectionCheckerQuery>(
    RelayEnviroment,
    query,
    { bluetoothHash }
  )

  // TODO: stringify response in short hash on backend side to be more efficient in network

  // these hashes do not need to be secure they are only for notification purposes
  // to see if any alert is added
  const previousDataHash = await AsyncStorage.getItem(alertStorageKey)
  const newHash = stringifyInfectedEncounters(data.infectedEncounters)

  // no previous notifications or changed alerts
  if (previousDataHash !== newHash || !previousDataHash) {
    //@ts-ignore
    let localNotification = Notifications.postLocalNotification({
      // TODO: translate
      body: 'Er zijn wijzigingen in besmettingsgevaar',
      title: 'Wijzigingen in besmettingsgevaar',
      //   sound: 'chime.aiff',
      //   silent: false
      silent: true,
      category: 'SOME_CATEGORY',
      userInfo: {},
    })
  }
  // so we know the next time if we need to send new notification
  await AsyncStorage.setItem(alertStorageKey, newHash)
}
