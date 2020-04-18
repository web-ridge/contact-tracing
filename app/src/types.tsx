export interface Encounter {
  id: string
  hash: string
  rssi: number
  hits: number
  time: number
}
export interface DeviceKey {
  id: string
  key: string
  password: string
}

export interface RSSIValue {
  rssi: number
  hits: number
  start: number
  end: number
}

export interface RSSIMap {
  [contactTracingDeviceUUID: string]: RSSIValue
}
