Demo of whole application: https://www.youtube.com/watch?v=te_PKOa8TsY.  
Demo of background scanning on iOS: https://www.youtube.com/watch?v=f5bY9dkNX2g.  

# You are in control

An app which respects your privacy while still tracking your contacts. All your Bluetooth contacts are stored locally fully encrypted. When you're infected you can scan the QR-code provided by your local health institute.

The method is similar as described in the DP3T statement with some deviation to give the user more control over his data and even more anonymity.

## Benefits of our application

- It works on iOS & Android (including background scanning on iOS)
- It is not possible to view someone else's alerts (only the user knows a secret password for every unique identiefier he sends via Bluetooth)
- It is not stored anywhere whether a Bluetooth number is infected
- Nothing happens without your explicit permission
- If you do not send an infection, all your contacts are stored locally with AES-256 + SHA2 encryption and a 64-byte encryption key
- The encryption key is stored in an Android keystore or Apple Keychain so that it is not available to attackers
- This solution is scalable and can be rolled out to millions of users without any problems
- The data on the server does not contain any personal data
- The data stored on the server is stored no longer than 4 weeks
- You can delete your data yourself at any time
- Local health authorities can change notification parameters without an app update
- Backend is fully open-source and written in Golang which compiles to byte code (very fast)
- Proven techniques like React Native, PostgresSQL, Golang

## What the backend server should be running
- The domain should be verified with DNSSEC
- Any data sent to the server should be done via SSL
- Any data between server and a proxy should be done via SSL
- The database connection between the API and server should be done with an SSL connection.
- The database is stored encrypted with <a href="https://en.wikipedia.org/wiki/Linux_Unified_Key_Setup">LUKS</a>.
- Access to the management console should at least be directly and indirectly secured with 2-factor authentication codes and a digital safe.


## How the app works
Alice installs the tracing app via the App Store.
Bob installs the tracing app via the Play Store.

**Step 1: Secure database is created locally**
The app will create a secure local database which is fully encrypted with AES-256 + SHA2 encryption and a 64-byte encryption key

**Step 2: Secure password is created**

The applications generate a random ContactTracingsNumber≈ every hour and a half. The hash of this BluetoothUUID will be 

Bob runs into Alice to chat with. If these persons are in contact with each other for longer, the risk of contamination increases and the devices will do the following. Risk assessment can be changed afterwards without app update.

**Step 3: Both devices store each other's ContactTracingsNumberHash* **

With a strong signal, both applications store these 2 hashes **locally** on their own phone with date and strength of the signal (RSSI) and the number of times this signal has changed and the duration of this contact.

**Step 4: A positive test**

Alice has been tested positive on COVID-19.
- Alice scans QR-code of their local health institute ;
- Alice sends their contact moments with the follwing data:
  - signal strength
  - date, 
  - period
  - hits (how many times signal did go stronger, the more reliable it is)
  
*It not saved anywhere WHO send in this data, so there can't be proved who has contact with whom.*

Every so often, Bob asks the central server if any infections have been added to his ContactTracingsHashes* with their with associated ContactTracingsPasswords*
 from the past 2 weeks. Only he can do this because he knows the secret passwords of his ContactTracingNumbers.
He gets back how many times he has had contact with a certain hash (grouped on any 2 digits when the contamination was created).

He get's back the following data
- how many risky encounters he had (the risk indication parameters can be changed)

## How the risk of contamination is calculated

We look at the RSSI of the signal and the number of hits with this signal.= The closer the RSSI is to 0 and the more hits, and the longer the duratoin, the greater the chance of contamination.

Risk assessment code: https://github.com/web-ridge/contact-tracing/blob/master/backend/risk.go
Paper about RSSI signals: https://www.researchgate.net/figure/Bluetooth-signal-strength-RSSI-as-a-function-of-distance-A-Scans-between-two-phones_fig2_263708916

# FAQ

## Bluetooth solutions are not reliable
Some people say that Bluetooth solutions are not reliable enough. That is true in some cases. However, you can make a fairly good estimate of how much contact there has been between 2 phones. Of course there can be an incorrect conclusion, but was this not the case with the classic contact investigation? And how bad is it when people receive a message that they have to pay attention to symptoms / or stay indoors for 5 days. We all need to do that now! We can build the risk assessment in such a way that as few false reports as possible occur, but then there will also be people who do not receive a report even though they are infected.


## *
*ContactTracingsNumber* - BluetoothUUID which will be publicly visible
*ContactTracingsHash* - Hash of the ContactTracingsNumber which will be stored on the server
*ContactTracingsPassword* - Only known between server and user and not publicly visible

