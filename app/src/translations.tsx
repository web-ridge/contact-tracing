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
    en: 'Start scanning',
    nl: 'Begin met scannen',
  },
  stopTracking: {
    en: 'Stop scanning',
    nl: 'Stop scannen',
  },
  symptomsButton: {
    en: 'I have symptoms',
    nl: 'Ik heb symptomen',
  },
  privacyTracking: {
    en:
      'All your Bluetooth contactmoments will be saved locally and fully encrypted.',
    nl:
      'Al jouw Bluetooth contactmomenten worden lokaal opgeslagen en volledig versleuteld.',
  },
  refetchAlerts: {
    en: 'Retry',
    nl: 'Opnieuw ophalen',
  },
  errorWhileFetchingAlerts: {
    en: 'Something went wrong while fetching the alerts',
    nl: 'Fout bij ophalen meldingen',
  },
  noAlerts: {
    en: 'No alerts yet',
    nl: 'Nog geen meldingen',
  },
  alerts: {
    en: 'Alerts',
    nl: 'Meldingen',
  },
  labelForEncounter: {
    en: 'encounter with someone who is probably infected',
    nl: 'contactmoment met persoon die waarschijnlijk besmet is',
  },
  labelForEncounters: {
    en: 'encounters with someone who is probably infected',
    nl: 'contactmomenten met persoon die waarschijnlijk besmet is',
  },
  myDataButton: {
    en: 'My data',
    nl: 'Mijn gegevens',
  },
  privacyButton: {
    en: 'Privacy statement',
    nl: 'Privacy verklaring',
  },
  symptomTitle: {
    en: 'Symptons',
    nl: 'Symptonen',
  },
  symptomIntroduction: {
    en: 'I have all of the following symptoms',
    nl: 'Ik heb alle onderstaande symptomen',
  },
  symptomText: {
    en: 'Colds, sneezing, coughing, sore throat, difficulty breathing, fever',
    nl: 'Verkoudheid, niezen, hoesten, keelpijn, moeilijk ademen, koorts',
  },
  testedText: {
    en: 'I have been tested positive on COVID-19',
    nl: 'Ik ben positief getest op COVID-19',
  },
  orText: {
    en: 'or',
    nl: 'of',
  },
  permissionText: {
    en: `I agree that my locally saved contactmomenten of the past 2 weeks with will be shared so that other phones will be notified when they have been in contact with me.`,
    nl: `Ik ga ermee akkoord dat mijn contactmomenten van de afgelopen 2 weken contactmomenten worden gedeeld zodat andere telefoons een melding krijgen als ze in contact zijn geweest met mij.`,
  },
  permissionTrust: {
    en: `Nowhere will be saved wo sent the contactmoments.`,
    nl: `Nergens wordt opgeslagen wie deze contactmomenten heeft opgestuurd.`,
  },
  // permissionTrustPrivacyTermsText: {
  //   en: `I have read the data privacy agreement and agree to my personal data being processed and used.`,
  //   nl: `Ik heb de privacyverklar gelezen en ga akkoord met de verwerking en het gebruik van mijn gegevens.`,
  // },
  permissionTrustPrivacyTermsClickText: {
    en: `Read privacy verklaring.`,
    nl: `Lees privacy verklaring.`,
  },
  [`sendContactsButtonText {howManyContacts}`]: {
    en: `Send {howManyContacts} contactmoments`,
    nl: `Verzend {howManyContacts} contactmomenten`,
  },
  [`resendContactsButtonText {howManyContacts}`]: {
    en: `Try sending again`,
    nl: `Probeer opnieuw`,
  },
  sendingContactsErrorText: {
    en: `Could not send contacts. Try again later.`,
    nl: `Kon contacten niet verzenden. Probeer later opnieuw.`,
  },
  HIGH_RISK: {
    en: 'High risk',
    nl: 'Hoog risico',
  },
  MIDDLE_RISK: {
    en: 'Medium risk',
    nl: 'Gemiddeld risico',
  },
  LOW_RISK: {
    en: 'Low risk',
    nl: 'Laag risico',
  },
  myDataTitle: {
    en: 'My data',
    nl: 'Mijn gegevens',
  },
  myDataEncounterAlerts: {
    en:
      'Remove eventuele infections alerts which are registered on my Bluetooth numbers',
    nl:
      'Verwijder eventuele besmettingsmeldingen die geregistreerd staan op mijn Bluetooth nummers',
  },
  myDeviceKeys: {
    en: 'Delete my own Bluetooth numbers by which identify my to other devices',
    nl:
      'Verwijder mijn eigen Bluetooth nummers waarmee ik mij identificeer aan andere apparaten',
  },
  myDataRemovalFailed: {
    en: 'Deleting failed',
    nl: 'Verwijderen niet gelukt',
  },
  myDataRemovalButton: {
    en: 'Delete data',
    nl: 'Verwijder gegevens',
  },
  myDataRemovalButtonRetry: {
    en: 'Delete ata',
    nl: 'Verwijder gegevens',
  },
} as TranslationDatabase
