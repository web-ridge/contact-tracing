export interface Encounter {
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
  [bluetoothID: string]: RSSIValue
}
