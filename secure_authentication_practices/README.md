# Secure Authentication Practices

Implement authentication securely with proper password hashing, account lockouts, and multi-factor authentication.

## Usage

```js
const crypto = require('crypto');

// Generate a random salt
function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

// Hash password with PBKDF2
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

// Register a new user with secure password storage
function registerUser(username, password) {
  // Generate unique salt for this user
  const salt = generateSalt();
  
  // Hash the password with the salt
  const hashedPassword = hashPassword(password, salt);
  
  // Store username, hashedPassword, and salt in database
  // NEVER store plaintext passwords
  return { username, hashedPassword, salt };
}

// Verify a login attempt
function verifyUser(username, password, storedHash, storedSalt) {
  // Hash the provided password with the stored salt
  const hashedAttempt = hashPassword(password, storedSalt);
  
  // Time-constant comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(hashedAttempt, 'hex'),
    Buffer.from(storedHash, 'hex')
  );
}

// Example usage
const user = registerUser('eranga', 'securepassword123');
console.log('User registered:', user);
const isValidLogin = verifyUser('eranga', 'securepassword123', user.hashedPassword, user.salt);
console.log('Login valid:', isValidLogin);
```

