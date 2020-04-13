import database from './Database'

import { Encounter } from './types'

export async function SyncEncounter(encounter: Encounter) {
  try {
    database.write(() => {
      database.create('Encounter', encounter)
    })
  } catch (e) {
    console.log('Error on creation')
  }
}
