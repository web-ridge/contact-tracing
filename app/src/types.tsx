export interface Encounter {
  id: string
  hash: string
  rssi: number
  hits: number
  time: number
  duration: number
  isIos: boolean
}
export interface DeviceKey {
  id: string
  key: string
  password: string
}

export interface RSSIValue {
  rssi: number
  hits: number
  start: number // used to generate duration before syncing to database
  end: number // used to generate duration before syncing to database
  isIos: boolean // used to fetch infected ios targets if enabled
}

export interface RSSIMap {
  [contactTracingDeviceUUID: string]: RSSIValue
}
