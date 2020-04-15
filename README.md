Bij deze oplossing is er gekozen een juiste combinatie van decentralisatie en toch een snelle oplossing die ook werkt bij miljoenen gebruikers. ls je de privacy zoveel mogelijk wilt waarborgen zal je zoveel mogelijk data lokaal willen houden. Dit is mogelijk door middel van bluetooth tracing. Alleen je moet ook rekening houden met de batterij van het apparaat. Omdat de contact tracing API's van Google en Apple nog een tijdje duren zul je een tussenoplossing moeten maken. Maar mijn advies is wachten totdat de Contact Tracing API's beschikbaar komen.

## Voordeel aan deze oplossing

- Er staat niet opgeslagen wie besmet is;
- Er staat niet opgeslagen wie contact heeft gehad met wie (alleen lokaal op de telefoon AES-256+SHA2 encryptie en een 64-byte encryption key);
- Een besmet persoon mag zijn  bluetooth hashes opsturen waarmee hij contact heeft gehad
- Om de zoveel tijd controleerd een telefoon of zijn bluetooth hash op de 'besmette' lijst staat.
- Achteraf logica wijzigen van kans op besmetting

_Voorgestelde werking van de app uitgelegd_
Alice installeert de tracing app via de App Store.
Bob installeert de tracing app via de Play Store.

Bob komt Alice tegen waarmee hij een praatje maakt. Als deze personen langer met elkaar in contact staan gaat neemt de kans op besmetting toe en gaan de apparaten het volgende doen.

Bob’s bluetooth ID: 00000000-0000-1000-8000-00805F9B34FB  
Alice’s bluetooth ID: 00000000-0000-1000-8000-00203B2C20DA

**Stap 1: Beide applicaties hashen elkaars Bluetooth ID met SHA256**

- Bob’s bluetooth hash: 8a520effd30490e592d84c0983d9a95131e94af981e50f00984b950c9fac8ebb
- Alice’s bluetooth hash: 51c09a1a8aa6462c8bf289f5e374285cef2428785339c7b9191887c600c85507

Bij een sterk signaal slaan beide applicaties deze 2 hashes **lokaal** op hun eigen telefoon op met datum en de sterkte van het signaal (RSSI).

**Stap 2: Een mogelijke besmetting**

- Alice is besmet met corona.
- Alice loopt checklist af in app. (testcapaciteit is waarschijnlijk niet voldoende)
- Alice stuurt de hashes op met een RSSI signaal sterkte (er is niet bekend op de server wat Alice's hash is)

Bob vraagt om de zoveel tijd aan de centrale server of zijn Bluetooth hash meldingen heeft. Hij ziet overzichtelijk welke meldingen er zijn voor zijn Bluetooth adres.

## Bepalen wanneer besmetting is voorgekomen

We kijken naar de RSSI van het signaal en het aantal hits wat er met dit signaal is. Alles tussen de 0 en - 70 wordt lokaal opgeslagen met het minimale en maximale RSSI getal. Hoe dichter de RSSI bij de 0 is en hoe meer hits hoe meer de kans op besmetting is toegenomen.

Als gemeten in negatieve getallen betekent een getal dat dichter bij 0 ligt meestal een beter signaal,
een getal dat -50 (min 50) is een redelijk goed signaal,
een getal van -70 (min 70) is redelijk terwijl een getal dat -100 (min 100) is helemaal geen signaal heeft.
https://iotandelectronics.wordpress.com/2016/10/07/how-to-calculate-distance-from-the-rssi-value-of-the-ble-beacon/

## Security

- Server slaat een mogelijke besmetting hash een tijdstip op, na 2 weken wordt deze verwijderd omdat deze persoon dan niet meer besmet kan zijn.
- De lokale data van hashes en tijdstippen worden lokaal opgeslagen met AES-256+SHA2 encryptie en een 64-byte encryption key
- De encryption key wordt opgeslagen in Android keystore of Apple Keychain zodat deze niet beschikbaar is voor aanvallers
- Aan server kant staan de keys in een Redis store dit is puur Ram en wordt dus niet naar een schijf weggeschreven
- De backup van deze database wordt encrypted opgeslagen

## Concerns

- Als je een Bluetooth MAC adres koppelt aan een persoonsgegeven is het via de API mogelijk om erachter te komen of die gehashte besmet is. Dit dient duidelijk te worden vermeld als de gebruiker toestemming geeft als hij zijn infectie invoert.

## Blokkades

- De iOS app moet open staan op het moment dat iemand naar buiten gaat. De API van Apple ondersteunt alleen het scannen van bekende apparaten in de achtergrond zoals hier te lezen is. De app zal dus op op de voorgrond moeten blijven als iemand weggaat. Dat is niet echt haalbaar.
  https://developer.apple.com/documentation/corebluetooth/cbcentralmanager/1518986-scanforperipheralswithservices
- Het is moeilijk om op basis van het signaal te bepalen hoever de gebruikers van elkaar hebben gestaan
