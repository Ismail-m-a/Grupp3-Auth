# TTFHW -  AUTH-SERVER.JS 
Auth-server koden implementerar flera säkerhetsåtgärder för att skydda mot olika hot. 
Nedan är sammanfattningen av de säkerhetsåtgärder som används:


## Funktioner:

1. **Användarautentisering:**
   - Implementerar användarautentisering baserad på JWT.
   - Säkerställer lösenordssäkerhet med bcrypt.

2. **Rate Limiting:**
   - Kontrollerar inloggningsförfrågningar med Express Rate Limit-mellanprogrammet.
   - Begränsar varje IP till 3 inloggningsförfrågningar per minut.

3. **Säkerhetsrubriker:**
   - Förbättrar säkerheten med Helmet-mellanprogrammet.

4. **Kontokontroll:**
   - Låser konton i 15 minuter efter för många misslyckade inloggningsförsök.

5. **Miljövariabler:**
   - Laddar miljövariabler från en `.env`-fil och lägger till filen i .gitignore för att undvika att den spåras av Git.

6. **XSS-förebyggande:**
   - Undviker XSS-attacker genom att escapera användarinput.

7. **Uppdatering av lösenordshashtabell:**
   - Uppdaterar befintliga lösenord till deras hashtabeller.

8. **Inloggningsloggning:**
   - Loggar inloggningsförsök och resultat för övervakning.


  ## Komma igång:

1. **Installera beroenden:**
   ```bash
   npm install
   ```

2. **Konfigurera miljö:**
   - Skapa en `.env`-fil med `JWT_SECRET`, `SECRET_USER_PASSWORD_1` och `SECRET_ADMIN_PASSWORD_2`.

3. **Kör applikationen:**
   ```bash
   npm start
   ```

4. **API-slutpunkter:**
   - **POST /login:** Hanterar användarautentisering. Kräver `email` och `password` i förfrågningskroppen.

     

## Anteckningar:
- Ange miljövariabler innan du kör.
- Använder `users.json` för lagring av användardata.

För problem, kontrollera [https://github.com/Ismail-m-a/Grupp3-Auth).
