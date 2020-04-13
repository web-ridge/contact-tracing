export interface Encounter {
  hash: string
  rssi: number
}

export interface RSSIMap {
  [bluetoothID: string]: number
}
