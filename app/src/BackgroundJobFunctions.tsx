// WebRidge Design

import { syncDevicesInMemoryToLocalDatabase } from './BackgroundBluetoothDeviceScanned'
import { removeOldData, getCurrentDeviceKeyOrRenew } from './DatabaseUtils'
import { startOrRefreshAdvertising } from './BackgroundBluetoothAdvertising'
import { giveAlerts } from './BackgroundInfectionChecker'
import { safeLog, getTranslation } from './Utils'
import { DeviceKey } from './types'

// every hour
export const jobInterval = 1000 * 60 * 60

export async function refreshJob(): Promise<boolean> {
  try {
    safeLog('begin interval')
    const removed = await removeOldData()
    if (!removed) {
      // stop if we can not remove old data from device
      return false
    }

    // refresh advertising service
    // so new key's will be added if date changes
    const latestDeviceKey = await refreshAdvertiseService()
    if (!latestDeviceKey) {
      return false
    }

    // sync RSSI values
    safeLog('syncDevicesInMemoryToLocalDatabase')
    const synced = await syncDevicesInMemoryToLocalDatabase()
    if (!synced) {
      safeLog('WARNING database is not synced inside background job')
    }
    safeLog('giveAlerts')

    // Check notification alerts
    await giveAlerts()
    return true
  } catch (error) {
    console.log('something went wrong in jobInterval', { error })
    return false
  }
}

// make a re-usable function for refreshing
let previousDeviceKey: string | undefined
export async function refreshAdvertiseService(): Promise<string | undefined> {
  // start advertising as a bluetooth service for other devices
  // so other devices will know this is an advertisable
  let newDeviceKey: DeviceKey | undefined
  try {
    newDeviceKey = await getCurrentDeviceKeyOrRenew()
  } catch (error) {
    // Device key is too old we stop sending it since the chances the key is not unique
    // enough anymore
    console.log('refreshAdvertiseService', { error })
    return undefined
  }

  if (!newDeviceKey) {
    return undefined
  }

  if (newDeviceKey.key !== previousDeviceKey) {
    // key has changed so we need to register
    await startOrRefreshAdvertising(newDeviceKey.key)
    previousDeviceKey = newDeviceKey.key
    return newDeviceKey.key
  }

  // key does not need to change
  return previousDeviceKey
}

export const taskOptions = {
  taskName: getTranslation('taskName'),
  taskTitle: getTranslation('taskTitle'),
  taskDesc: getTranslation('taskDesc'),
  taskIcon: {
    name: 'ic_stat_sentiment_satisfied_alt',
    type: 'mipmap',
  },
  color: '#F27188',
  parameters: {
    delay: 1000,
  },
}
