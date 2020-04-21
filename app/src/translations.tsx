// WebRidge Design
// PR for spelling mistakes is very welcome!

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
  startOnboarding: {
    en: `I participate`,
    nl: 'Ik doe mee',
  },
  lockerTitle: {
    en: `Your digital locker`,
    nl: 'Jouw digitale kluis',
  },
  onboardingLockerFirst: {
    en: `The privacy of you and your contacts is very important to us. That is why we make a digital safe for you that remains locally and is fully encrypted.`,
    nl:
      'Wij vinden de privacy van jou en je contacten uiterst belangrijk. Daarom maken wij een digitale kluis voor jou die lokaal blijft staan en volledig versleuteld is.',
  },
  onboardingLockerSecond: {
    en: `No one can access this data on your phone even if it would be stolen.`,
    nl:
      'Niemand kan deze gegevens die op je telefoon staan, zelfs niet als deze gestolen wordt.',
  },
  onboardingLockerThird: {
    en: `We do not share this information without your explicit permission in case of contamination.`,
    nl:
      'Wij delen deze gegevens niet zonder jouw explicitie toestemming bij een eventuele besmetting.',
  },
  onboardingDone: {
    en: "Let's go!", // Clear is kees :-P
    nl: 'Ja, gaan!', //
  },
  onboardingMoreInfo: {
    en: 'More info',
    nl: 'Meer info',
  },
  onboardingNext: {
    en: 'Ok, continue',
    nl: 'Ok, ga door',
  },
  bluetoothScreenTitle: {
    en: 'How it works',
    nl: 'Hoe het werkt',
  },
  bluetoothPermissionText: {
    en:
      "Our app uses Bluetooth. Your phone sends out a unique signal which changes at least every hour and a half. If this does not work, we will notify you. If another telephone receives this signal, both telephones store each other's number.",
    nl:
      'Onze app maakt gebruik van Bluetooth. Jouw telefoon zend een uniek signaal uit wat minimaal ieder anderhalf uur wijzigt. Als dit niet lukt geven we een melding. Als een andere telefoon dit signaal opvangt slaan beide telefoons elkaars nummer op.',
  },
  bluetoothAndroid: {
    en:
      'We do not store location data anywhere. Still, Android (the program your phone runs on) has made it mandatory for apps to request access to your location. We hereby pledge that we will not do anything with your location and will not do it!',
    nl:
      'Wij slaan nergens locatiegevens op. Toch heeft Android (het programma waar jouw telefoon op draait) het verplicht gesteld voor apps om toegang tot je locatie te vragen. Wij beloven hierbij plechtig dat wij helemaal niets met jouw locatie doen en ook niet gaan doen!',
  },
  startTracking: {
    en: 'Start scanning',
    nl: 'Begin met scannen',
  },
  stopTracking: {
    en: 'Stop scanning',
    nl: 'Stop scannen',
  },
  infectedButton: {
    en: 'I have been tested positive',
    nl: 'Ik ben positief getest',
  },
  privacyTracking: {
    en:
      'Other users in the your neightbordhood will save your Bluetooth number in their safe digital locker. You will save them too',
    nl:
      'Andere gebruikers in de buurt slaan jouw Bluetooth nummer op in hun beveiligde digitale kluis. Jij slaat hun nummers ook op.',
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
  permissionBluetoothTrustPrivacyTermsText: {
    en: `I have read the data privacy agreement and agree that my device will sent an unique signal which other entities can use to send infection alerts to my phone after they have been tested positive on COVID-19.`,
    nl: `Ik heb de privacyverklaring gelezen en ga akkoord dat mijn apparaat een uniek signaal verzend die andere apparaten kunnen opslaan en kunnen gebruiken om mij een melding te kunnen sturen als ze positief getest zijn op COVID-19.`,
  },
  permissionTrustPrivacyTermsClickText: {
    en: `Read privacy agreement.`,
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
    en: 'Delete data',
    nl: 'Verwijder gegevens',
  },
  myLocalState: {
    en: 'Delete all my local data such as contact times and my security keys.',
    nl:
      'Verwijder al mijn lokale gegevens zoals contactmomenten en mijn beveiligingskeys.',
  },
  infectedTitle: {
    en: 'Tested positive',
    nl: 'Positief getest',
  },
  pickQRLetter: {
    en: 'Find the letteryou received and click the button below',
    nl: 'Zoek de brief van de gezondheidsinstantie erbij en druk op de knop',
  },
  goToQRLetter: {
    en: 'Scan the QR code in the letter you received from the health institute',
    nl:
      'Scan de QR-code die je in de mail of brief hebt gekregen van de gezondheidsinstantie',
  },
  scanQRButtonText: {
    en: 'Scan QR-Code',
    nl: 'Scan QR-Code',
  },
  fakeText: {
    en:
      'Because you local health institue does not work together with use you can generate a fake code to test the app',
    nl:
      'Omdat je lokale gezondheidsinstantie nog niet met ons samenwerken kun je een neppe code genereren om de app te testen',
  },
  scanFakeButtonText: {
    en: 'Geneer een nep-code',
    nl: 'Maak een nep-code',
  },
  fakeFailed: {
    en: 'Something went wrong',
    nl: 'Er ging iets fout',
  },
} as TranslationDatabase
