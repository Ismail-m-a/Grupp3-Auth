// Importera Express för att skapa en router
const express = require('express');
// JSON Web Token (JWT) för autentisering
const jwt = require('jsonwebtoken');
// Bcrypt för att hasha lösenord säkerhet
const bcrypt = require('bcrypt');
// Express Rate Limit för att hantera rate limiting
const rateLimit = require('express-rate-limit');
// Helmet för att ställa in säkra headers och skydda mot vissa attacker
const helmet = require('helmet');
// Ladda miljövariabler från en .env-fil
const dotenv = require('dotenv');
// Skapa en router-instans från Express
const router = express.Router();

const fs = require('fs'); //extra
const path = require('path'); //extra
const userDataFilePath = path.join(__dirname, 'users.json'); //extra
// Load user data from the JSON file
let users = [];
try {
  const userData = fs.readFileSync(userDataFilePath, 'utf8');
  users = JSON.parse(userData);
} catch (error) {
  console.error('Error loading user data:', error);
}

// Ladda miljövariabler
dotenv.config();

// Använd Helmet för att sätta säkra headers och skydda mot vissa attacker
router.use(helmet());

// Rate Limiting middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minut
  max: 3, // Begränsa varje IP till 3 förfrågningar per minut
});

// Definiera konstanter för spärrning av användarkonto
const MAX_LOGIN_ATTEMPTS = 3; // Maximalt antal inloggningsförsök innan spärrning
const LOCKOUT_DURATION = 15 * 60 * 1000; // Spärrningsvaraktighet på 15 minuter i millisekunder

// Asynkron funktion för att hasha lösenord med bcrypt
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};


// Uppdatera befintliga lösenord (ersätter med deras hashade versioner)
const updateExistingPasswords = async () => {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const isTestPassword = user.password === process.env.SECRET_USER_PASSWORD_1 || user.password === process.env.SECRET_ADMIN_PASSWORD_2;
    if (isTestPassword) {
      const hashedPassword = await hashPassword(user.password);
      users[i].password = hashedPassword;
    }
  }
};

// Spara user data till JSON fil
const saveUserData = () => {
  try {
    const dataToSave = JSON.stringify(users, null, 2);
    fs.writeFileSync(userDataFilePath, dataToSave, 'utf8');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Anropa funktionen för att uppdatera befintliga lösenord
updateExistingPasswords();

// Express route för inloggning med rate limiting middleware
router.post('/login', limiter, async (req, res) => {
  try {
    // Extrahera e-post och lösenord från förfrågan
    const { email, password } = req.body;

    // Escape användarinmatning för att förhindra XSS
    const escapedEmail = escapeHtml(email);
    const escapedPassword = escapeHtml(password);

    console.log('Received login request with:', { email: escapedEmail, password: escapedPassword });

    // Hitta användaren med matchande e-postadress
    const user = users.find((u) => u.email === escapedEmail);

    if (user) {
      console.log('Found user:', user);

      // Kontrollera om kontot är spärrat
      if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS && Date.now() - user.lastFailedLoginAt < LOCKOUT_DURATION) {
        const lockoutExpirationDate = new Date(user.lastFailedLoginAt + LOCKOUT_DURATION);
        console.log('Account is locked until:', lockoutExpirationDate);
        return res.status(401).json({ error: 'Account locked' });
      }

      // Jämför inkommande lösenord med hashat lösenord
      const passwordMatch = await bcrypt.compare(password, user.password);

      console.log('Password during login:', password);
      console.log('Stored hashed password:', user.password);
      console.log('Password match result:', passwordMatch);

      if (passwordMatch) {
        console.log('Login successful for user:', user);

        // Återställ antal misslyckade inloggningsförsök vid lyckad inloggning
        user.failedLoginAttempts = 0;
        user.lastFailedLoginAt = null;

        // Generera JWT-token för användaren
        const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('Generated JWT token:', token);

        // Skicka JWT-token som svar
        res.json({ token });
      } else {
        // Öka antal misslyckade inloggningsförsök
        user.failedLoginAttempts += 1;
        user.lastFailedLoginAt = Date.now();
        console.log('Last failed login timestamp:', new Date(user.lastFailedLoginAt));
        console.log('Login failed. Invalid password.');

        // Skicka felmeddelande
        res.status(401).json({ error: 'Invalid login' });
      }
    } else {
      console.log('Login failed. User not found.');

      // Skicka felmeddelande om användaren inte hittas
      res.status(401).json({ error: 'Invalid login' });
    }
  } catch (error) {
    console.error('Error during login:', error);

    // Skicka felmeddelande vid interna fel
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Funktion för att escape:a HTML
function escapeHtml(unsafe) {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Exportera router för användning i andra filer
module.exports = router;
