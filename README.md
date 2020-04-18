<img src="https://user-images.githubusercontent.com/6492229/79509074-1ad7d680-803b-11ea-840f-3cc13a7e47e8.jpeg" width="280" />|
<img src="https://user-images.githubusercontent.com/6492229/79509077-1b706d00-803b-11ea-8a50-bbec74eb17de.jpeg" width="280" />|
<img src="https://user-images.githubusercontent.com/6492229/79509080-1c090380-803b-11ea-8f7d-daac75e02459.jpeg" width="280" />|
<img src="https://user-images.githubusercontent.com/6492229/79634325-0f36fd80-816a-11ea-9484-53ce98afbe1c.jpeg" width="280" />
|
<img src="https://user-images.githubusercontent.com/6492229/79634323-0e05d080-816a-11ea-8d88-97b870d25637.jpeg" width="280" />

## Help us

- Adding explain why Location permission is needed on Android to get access to Bluetooth.

## Explain way of working

Bij deze oplossing is er gekozen een juiste combinatie van decentralisatie en een snelle oplossing die ook werkt bij miljoenen gebruikers. 

## Voordeel aan deze oplossing

- Er staat niet opgeslagen wie besmet is;
- Er staat niet opgeslagen wie contact heeft gehad met wie (alleen lokaal op de telefoon AES-256+SHA2 encryptie en een 64-byte encryption key);
- Een besmet persoon mag zijn bluetooth hashes opsturen waarmee hij contact heeft gehad;
- Om de zoveel tijd controleerd een telefoon of zijn bluetooth hash op de 'besmette' lijst staat;
- Achteraf logica wijzigen van kans op besmetting;
- iOS kan wel besmetting alerts ontvangen. Bluetooth proximity werkt alleen niet goed in achtergrond op iOS.
- Meertaligheid

_Voorgestelde werking van de app uitgelegd_
Alice installeert de tracing app via de App Store.
Bob installeert de tracing app via de Play Store.

**Stap 1: Applicatie start op**

De applicaties genereren een willekuerig nummer waarmee het eerste stukje indiceert dat het om een ContactTracingsNummer gaat.

Bob komt Alice tegen waarmee hij een praatje maakt. Als deze personen langer met elkaar in contact staan gaat neemt de kans op besmetting toe en gaan de apparaten het volgende doen.

**Stap 1: Beide apparaten slaan elkaars ContactTracingsNummer op en hashen deze zodat deze niet terug te herleiden is zonder dat het ContactTracingsNummer*

- Bob’s ContactTracingsNummer hash: 8a520effd30490e592d84c0983d9a95131e94af981e50f00984b950c9fac8ebb
- Alice’s ContactTracingsNummer hash: 51c09a1a8aa6462c8bf289f5e374285cef2428785339c7b9191887c600c85507

Bij een sterk signaal slaan beide applicaties deze 2 hashes **lokaal** op hun eigen telefoon op met datum en de sterkte van het signaal (RSSI) en het aantal keren wat dit signaal veranderd is.

**Stap 2: Een mogelijke besmetting**

- Alice is besmet met corona.
- Alice loopt checklist af in app. (testcapaciteit is waarschijnlijk niet voldoende, anders is de mogelijkheid voor de GGD om deze schermen te bouwen)
- Alice stuurt de hashes op met een RSSI signaal sterkte (er is niet bekend op de server wat Alice's hash is)

Bob vraagt om de zoveel tijd aan de centrale server of zijn Bluetooth hash mogelijke infecties heeft.
Hij krijgt terug hoeveel keer contact hij heeft gehad met een bepaalde hash (gegroepeerd op eerste 5 cijfers van hash).

```
howManyEncounters: 2
risk: "highRisk"

howManyEncounters: 3
risk: "lowRisk"

howManyEncounters: 4
risk: "middleRisk"
```

## Bepalen wanneer besmetting is voorgekomen

We kijken naar de RSSI van het signaal en het aantal hits wat er met dit signaal is. Alles tussen de 0 en - 100 wordt lokaal opgeslagen met het minimale en maximale RSSI getal. Hoe dichter de RSSI bij de 0 is en hoe meer hits hoe meer de kans op besmetting is toegenomen.

Code voor risicobepaling: https://github.com/web-ridge/contact-tracing/blob/master/backend/risk.go

https://www.researchgate.net/figure/Bluetooth-signal-strength-RSSI-as-a-function-of-distance-A-Scans-between-two-phones_fig2_263708916

## Security / data

- Server verwijderd ContactTracingsNummer meldingen na 2 weken.
- De lokale data van hashes en datums worden lokaal opgeslagen met AES-256+SHA2 encryptie en een 64-byte encryption key.
- De encryption key wordt opgeslagen in Android keystore of Apple Keychain zodat deze niet beschikbaar is voor aanvallers.
- De eigen key waarmee een gebruik identificeerbaar is 
- Server staat in veilig datacenter en op Nederlandse server en voldoet aan alle europese wetgeving
- Stricte controle van SSL certificaat (HTS)


## Blokkades

- De iOS app moet open staan op het moment dat iemand naar buiten gaat. De API van Apple ondersteunt alleen het scannen van bekende apparaten in de achtergrond zoals hier te lezen is. De app zal dus op op de voorgrond moeten blijven als iemand weggaat. Dat is niet echt haalbaar.
  https://developer.apple.com/documentation/corebluetooth/cbcentralmanager/1518986-scanforperipheralswithservices

