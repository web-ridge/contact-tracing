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
  lockerErrorTitle: {
    en: `Error`,
    nl: 'Foutmelding',
  },
  lockerErrorMessage: {
    en: `Your digital locker could not be created. Try again or re-install this app.`,
    nl:
      'Jouw digitale kluis kon niet aangemaakt worden. Probeer nog een keer of installeer de app opnieuw.',
  },
  lockerInfoTitle: {
    en: `Locker info`,
    nl: 'Kluisinfo',
  },
  lockerInfoMessage: {
    en: `Your digital locker will be encrypted with AES-256+SHA2 encrypton and a 64-byte encryption key.`,
    nl:
      'Jouw digitale kluis zal versleuteld worden met AES-256+SHA2 encryptie en een 64-byte encryptie sleutel.',
  },
  onboardingLockerFirst: {
    en: `Your privacy is our highest priority! That is why we make a secured digital safe for you that does not leave your phone.`,
    nl:
      'Jouw privacy is onze hoogste prioriteit! Daarom maken wij een beveiligde digitale kluis voor jou die je telefoon niet verlaat.',
  },
  onboardingLockerThird: {
    en: `We do not share anything without your explicit permission in case of contamination.`,
    nl:
      'Wij delen niets zonder jouw expliciete toestemming bij een eventuele besmetting.',
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
    en: 'Our app will detect other phones using this app through Bluetooth.',
    nl:
      'Onze app zal andere telefoons detecteren die deze app gebruiken door Bluetooth te gebruiken.',
  },
  bluetoothAndroid: {
    en:
      'Permission to your location is needed to use Bluetooth. We will not save your location.',
    nl:
      'Toestemming tot locatie is nodig om Bluetooth te kunnen gebruiken. Wij slaan je locatie niet op.',
  },

  acceptErrorTitle: {
    en: 'Approve',
    nl: 'Akkoord',
  },
  acceptErrorMessage: {
    en: 'You must first agree to the terms before you can continue',
    nl: 'Je moet eerst akkoord gaan met de voorwaarden voordat je verder kan',
  },
  onboardingSaveErrorTitle: {
    en: 'Oops',
    nl: 'Helaas',
  },
  onboardingSaveErrorMessage: {
    en: 'Could not save your acceptance',
    nl: 'Could not save your acceptance',
  },
  startTracking: {
    en: 'Start scanning',
    nl: 'Begin met scannen',
  },
  stopTracking: {
    en: 'Stop scanning',
    nl: 'Stop scannen',
  },
  bluetoothErrorTitle: {
    en: 'Bluetooth',
    nl: 'Bluetooth',
  },
  bluetoothErrorMessage: {
    en:
      'Bluetooth needs to be enabled in order to start scanning other devices',
    nl: 'Bluetooth moet aan staan om andere apparaten te scannen',
  },
  locationErrorTitle: {
    en: 'Location',
    nl: 'Locatie',
  },
  locationErrorMessage: {
    en: 'Location is needed to use Bluetooth. We will not save your location.',
    nl: 'Locatie is nodig voor Bluetooth. We zullen je lokatie niet opslaan.',
  },
  infectedButton: {
    en: 'I have been tested positive',
    nl: 'Ik ben positief getest',
  },
  privacyTracking: {
    en:
      'Other phones in your neighborhood will save your Bluetooth number in their safe digital locker. You will save them too.',
    nl:
      'Andere telefoons in de buurt slaan jouw Bluetooth nummer op in hun beveiligde digitale kluis. Jij slaat hun nummers ook op.',
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
    en: 'Symptoms',
    nl: 'Symptomen',
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
    en: `I agree that my locally saved contactmoments of the past 2 weeks with will be shared so that your contacts will be notified.`,
    nl: `Ik ga ermee akkoord dat mijn contactmomenten van de afgelopen 2 weken worden gedeeld zodat je contacten een melding krijgen.`,
  },
  permissionTrust: {
    en: `Nowhere will be saved wo sent these contactmoments.`,
    nl: `Nergens wordt opgeslagen wie deze contactmomenten heeft opgestuurd.`,
  },
  permissionBluetoothTrustPrivacyTermsText: {
    en: `I have read the privacy agreement and agree that my device will send Bluetooth signals which other phones can save to send infection alerts.`,
    nl: `Ik heb de privacyverklaring gelezen en ga akkoord dat mijn apparaat Bluetooth uitzend die andere telefoons kunnen opslaan om infectie meldingen te versturen.`,
  },
  permissionOkLabel: {
    en: `I accept, done!`,
    nl: `Accepteren en klaar!`,
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
      'Remove all infection alerts which are registered on my Bluetooth numbers',
    nl:
      'Verwijder alle besmettingsmeldingen die geregistreerd staan op mijn Bluetooth nummers',
  },
  myDeviceKeys: {
    en: 'Delete my own Bluetooth numbers by which I identify to other devices',
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
    en:
      'Delete all my local data from server and also the authorization to view my own local database.',
    nl:
      'Verwijder al mijn lokale gegevens en ook mijn toegang tot de lokale database.',
  },
  infectedTitle: {
    en: 'Tested positive',
    nl: 'Positief getest',
  },
  pickQRLetter: {
    en:
      'Find the letter you received from your health organization and click the button below',
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
  scanErrorTitle: {
    en: 'QR-code',
    nl: 'QR-code',
  },
  scanErrorMessage: {
    en: 'Could not scan QR code',
    nl: 'Kon QR-code niet scannen',
  },
  fakeText: {
    en:
      'Because you local health institue does not work together with this app you can generate a fake code to test the app',
    nl:
      'Omdat je lokale gezondheidsinstantie nog niet met deze app samenwerken kun je een neppe code genereren om de app te testen',
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
