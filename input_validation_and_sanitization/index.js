const express = require('express');
const {body, validationResult} = require('express-validator');
const { hashPassword } = require('./services/hashPassword');

const app = express();
app.use(express.json());

const userValidationRules = [
    body('username').isAlphanumeric().withMessage('Username must be alphanumeric').isLength({min: 5}).withMessage('Username must be at least 5 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
    body('age').optional().isInt({min: 0}).withMessage('Age must be a positive integer')
];

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the User Registration API. Use the /register endpoint to create a new user."
    })
});

app.post('/register', userValidationRules, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, age } = req.body;
    
    hashPassword(password).then(hashedPassword => {
        console.log('Storing user:', { username, email, hashedPassword, age });
    });

    res.status(200).json({ message: 'User registered successfully', data: { username, email, age } });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});