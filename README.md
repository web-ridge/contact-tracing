

Als je de privacy wilt waarborgen zal je zoveel mogelijk data lokaal willen houden. Dit is mogelijk door middel van bluetooth tracing. Alleen je moet ook rekening houden met de batterij van het apparaat. Omdat de contact tracing API's van Google en Apple nog een poos duren zul je een tussenoplossing moeten maken.

Voorgestelde werking van de app uitgelegd
Alice installeert de tracing app via de App Store.
Bob installeert de tracing app via de Play Store.

Bob komt Alice tegen waarmee hij een praatje maakt. Als deze personen langer met elkaar in contact staan gaat neemt de kans op besmetting toe en gaan de apparaten het volgende doen.

Bob’s bluetooth ID: 00000000-0000-1000-8000-00805F9B34FB
Alice’s bluetooth ID:  00000000-0000-1000-8000-00203B2C20DA

**Stap 1: Beide applicaties hashen elkaars Bluetooth ID met SHA256**

Bob’s bluetooth hash: 8a520effd30490e592d84c0983d9a95131e94af981e50f00984b950c9fac8ebb
Alice’s bluetooth hash:  51c09a1a8aa6462c8bf289f5e374285cef2428785339c7b9191887c600c85507

**Stap 2: Beide applicaties doen het volgende ze encrypten elkaars bluetooth id**
Alice’s telefoon
Alice’s encrypt Bob’s hash met haar eigen hash. (deze wordt opgestuurd als zei besmet is)
Alice encrypt haar eigen hash met die van Bob. 

Bob’s telefoon
Bob encrypt zijn hash met Alice’s hash
Bob encrypt Alice’s hash met zijn eigen Hash


Beide applicaties slaan deze 2 encryptie hashes **lokaal** op hun eigen telefoon op met datum en tijdstip. 

## Een besmetting

Alice is besmet met corona zij druk op haar telefoon op de knop “Ik ben besmet”.

Zij stuurt de ge-encrypte hashes op waarmee ze contact heeft gehad zonder verdere informatie. Op de server wordt de opgestuurde hash nogmaals ge-encrypt opgeslagen.

Bob vraagt om de zoveel tijd aan de centrale server of er 1 van zijn ge-encrypte hashes besmet is geraakt. Als dit het geval blijkt te zijn is er een positieve trace. Deze trace wordt direct van de server verwijderd naarmaate deze 1x succesvol is opgehaald.  Bob krijgt een melding dat hij een besmetting kan hebben.

Omdat hij lokaal heeft opgeslagen op welk tijdstip en datum krijgt hij dat ook te zien.

## Overige punten
Server slaat van elke trace het weeknummer op, na twee weken wordt een trace verwijderd omdat men dan geen besmetting heeft op kunnen lopen.

## Blokkades

 - De iOS app moet open staan op het moment dat iemand naar buiten gaat. De API van Apple ondersteunt alleen het scannen van bekende apparaten zoals hier te lezen is. 
https://developer.apple.com/documentation/corebluetooth/cbcentralmanager/1518986-scanforperipheralswithservices
- RSSI naar centimeters: [https://iotandelectronics.wordpress.com/2016/10/07/how-to-calculate-distance-from-the-rssi-value-of-the-ble-beacon/](https://iotandelectronics.wordpress.com/2016/10/07/how-to-calculate-distance-from-the-rssi-value-of-the-ble-beacon/)