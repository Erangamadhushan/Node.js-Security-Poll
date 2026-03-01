# Protection Against Injection Attacks

Prevent SQL, NoSQL, command injection, and similar attacks by using parameterized queries and avoiding direct concatenation of user input.

## Usage

```js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user.model');
const { hashPassword, comparePassword } = require('./services/hashPassword');
const authenticateJWT = require('./middleware/authenticateJWT.middleware')
const { generateToken } = require('./services/jwt');
require('dotenv').config();


const app = express();

app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to the Secure User Management API. Use /register to create an account and /login to authenticate."
    });
});

// User registration endpoint
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email }).select('+password');
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
        email,
        password: hashedPassword
    });

    await newUser.save();


    res.status(201).json({ message: 'User registered successfully' });
});

// User login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = await generateToken(user);

    res.status(200).json({
        message: 'Login successful',
        token
    });
});

// User Profile endpoint (protected)
app.get('/profile', authenticateJWT, async (req, res) => {
    
    const user = await User.findOne({ email: req.user.email }).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
        message: 'User profile fetched successfully',
        user
    });
    
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
```