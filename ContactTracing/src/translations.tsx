interface TranslationDatabase {
  [key: string]: {
    en: string
    nl: string
  }
}

export default {
  title: {
    en: 'Contact Tracing',
    nl: 'Contacten Traceren',
  },
  subtitle: {
    en: "Let's beat COVID-19 together",
    nl: 'Samen krijgen we Corona onder controle',
  },
  startTracking: {
    en: 'Start saving contacts',
    nl: 'Start het opslaan van contacten',
  },
  stopTracking: {
    en: 'Stop with saving',
    nl: 'Stop met opslaan',
  },
  symptomsButton: {
    en: 'I have symptoms',
    nl: 'Ik heb symptonen',
  },
  privacyTracking: {
    en:
      'All your Bluetooth contacts will be saved locally and fully encrypted.',
    nl:
      'Al jouw Bluetooth contacten worden lokaal opgeslagen en volledig versleuteld.',
  },
} as TranslationDatabase
