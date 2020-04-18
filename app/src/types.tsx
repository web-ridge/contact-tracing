export interface Encounter {
  id: string
  hash: string
  rssi: number
  hits: number
  time: number
}

export interface RSSIValue {
  rssi: number
  hits: number
}

export interface RSSIMap {
  [contactTracingDeviceUUID: string]: RSSIValue
}
