Demo: https://www.youtube.com/watch?v=te_PKOa8TsY

# Jij hebt de controle

Een app om contacten mee te traceren waarvan de broncode volledig beschikbaar is en jouw data veilig blijft. Al jouw Bluetooth contacten worden volledig versleuteld lokaal opgeslagen.

De methode is overeenkomstig zoals beschreven staat in het DP3T statement.

## Explain way of working

Bij deze oplossing is er gekozen een voor decentralisatie en een snelle backend die ook werkt bij miljoenen gebruikers.

## Voordeel aan deze oplossing

- Het werkt op iOS & Android;
- Het is niet mogelijk om iemands anders meldingen in te zien;
- Het is niet mogelijk om zonder authenticatie data in te zien;
- Er staat nergens opgeslagen of een Bluetooth nummer besmet is;
- Er gebeurt niets zonder jouw expliciete toestemming;
- Als je data niet verzend naar de server staat deze lokaal opgeslagen met AES-256+SHA2 encryptie en een 64-byte encryption key.
- De encryption key wordt opgeslagen in Android keystore of Apple Keychain zodat deze niet beschikbaar is voor aanvallers.
- Deze oplossing is schaalbaar en kan zonder problemen voor miljoenen gebruikers uitgerold worden.
- De data die op de server staat bevat geen persoonsgevens.
- De data die op de server wordt niet langer dan 4 weken opgeslagen.
- Je kunt ten allen tijde zelf je data verwijderen via de applicatie.
- Eventuele gegevens die naar de server verstuurd worden gebeuren via de modernste SSL beveiligingen.
- De database wordt geëncrypt opgeslagen met <a href="https://en.wikipedia.org/wiki/Linux_Unified_Key_Setup">LUKS</a>.
- De databaseverbinding tussen de API en server gebeurt met een SSL verbinding.
- De toegang tot de beheerconsole is direct en indirect beveiligd met 2-factor authenticatie codes en een digitale kluis.
- Lokale gezondheidsinstanties kunnen parameters voor een melding veranderen zonder een app-update.
- Backend open-source
- Bewezen technieken

_Voorgestelde werking van de app uitgelegd_
Alice installeert de tracing app via de App Store.
Bob installeert de tracing app via de Play Store.

**Stap 1: Applicatie start op**

De applicaties genereren ieder anderhalf uur een willekeurig nummer waarmee het tweede stukje indiceert dat het om een ContactTracingsNummer gaat. Zij synchroniseren dit met een server met een ingewikkeld wachtwoord wat alleen zij en de server weet en dus niet door een derde partij onderschept kan worden.

Bob komt Alice tegen waarmee hij een praatje maakt. Als deze personen langer met elkaar in contact staan gaat neemt de kans op besmetting toe en gaan de apparaten het volgende doen. Risicobepaling is achteraf te wijzigen zonder app-update.

\*_Stap 1: Beide apparaten slaan elkaars ContactTracingsNummer op en hashen deze zodat deze niet terug te herleiden is zonder dat het ContactTracingsNummer_

- Bob’s ContactTracingsNummer hash: 8a520effd30490e592d84c0983d9a95131e94af981e50f00984b950c9fac8ebb
- Alice’s ContactTracingsNummer hash: 51c09a1a8aa6462c8bf289f5e374285cef2428785339c7b9191887c600c85507

Bij een sterk signaal slaan beide applicaties deze 2 hashes **lokaal** op hun eigen telefoon op met datum en de sterkte van het signaal (RSSI) en het aantal keren wat dit signaal veranderd is.

**Stap 2: Een mogelijke besmetting**

- Alice is besmet met corona.
- Alice loopt checklist af in app. (testcapaciteit is waarschijnlijk niet voldoende, anders is de mogelijkheid voor de GGD om deze schermen te bouwen)
- Alice stuurt de hashes op met een RSSI signaal sterkte (er is niet bekend op de server wat Alice's hash is)

Bob vraagt om de zoveel tijd aan de centrale server of er op zijn ContactTracingsNummers van de afgelopen 2 weken mogelijke besmettingen zijn toegevoegd. Dit kan alleen hij doen omdat hij de geheime wachtwoorden weet van zijn ContactTracingsNummers.
Hij krijgt terug hoeveel keer contact hij heeft gehad met een bepaalde hash (gegroepeerd op een willekeurig 2 cijfers toen de besmetting is aangemaakt).

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

- Server verwijderd ContactTracingsNummer meldingen na 2/3 weken.
- De lokale data van hashes en datums worden lokaal opgeslagen met AES-256+SHA2 encryptie en een 64-byte encryption key.
- De encryption key wordt opgeslagen in Android keystore of Apple Keychain zodat deze niet beschikbaar is voor aanvallers.
- De eigen key waarmee een gebruik identificeerbaar is
- Server staat in veilig datacenter en op Nederlandse server en voldoet aan alle europese wetgeving
