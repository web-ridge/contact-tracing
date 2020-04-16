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
    en: 'Start',
    nl: 'Start',
  },
  stopTracking: {
    en: 'Stop',
    nl: 'Stop',
  },
  sendInfectionButton: {
    en: 'Report contamination',
    nl: 'Meld besmetting',
  },
} as TranslationDatabase
