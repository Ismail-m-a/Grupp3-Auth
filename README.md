# TTFHW - I den här koden AUTH-SERVER.JS implementeras flera säkerhetsåtgärder för att skydda mot olika hot. 
Här är en sammanfattning av de säkerhetsåtgärder som används:

## Features:

1. **User Authentication:**
   - Implements JWT-based user authentication.
   - Ensures password security using bcrypt.

2. **Rate Limiting:**
   - Controls login requests with Express Rate Limit middleware.
   - Limits each IP to 3 login requests per minute.

3. **Security Headers:**
   - Enhances security using Helmet middleware.

4. **Account Lockout:**
   - Locks accounts for 15 minutes after too many failed login attempts.

5. **Environment Variables:**
   - Loads environment variables from a `.env` file.

6. **XSS Prevention:**
   - Escapes user input to prevent XSS attacks.

7. **Password Hashing Update:**
   - Updates existing passwords to their hashed versions.

8. **Login Logging:**
   - Logs login attempts and outcomes for monitoring.

## Getting Started:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   - Create a `.env` file with `JWT_SECRET`, `SECRET_USER_PASSWORD_1`, and `SECRET_ADMIN_PASSWORD_2`.

3. **Run the Application:**
   ```bash
   npm start
   ```

4. **API Endpoints:**
   - **POST /login:** Handles user authentication. Requires `email` and `password` in the request body.

## Notes:
- Set environment variables before running.
- Uses `users.json` for user data storage.


For issues, check the [https://github.com/Ismail-m-a/Grupp3-Auth).
