# Input Validation and Sanitization
Never trust user input. Always validate and sanitize all data that comes from outside your application.

```js
const express = require('express');
const {body, validationResult} = require('express-validator');

const app = express();
app.use(express.json());

const userValidationRules = [
    body('username').isAlphanumeric().withMessage('Username must be alphanumeric').isLength({min: 5}).withMessage('Username must be at least 5 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
    body('age').optional().isInt({min: 0}).withMessage('Age must be a positive integer')
];

app.post('/register', userValidationRules, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, age } = req.body;

    res.status(200).json({ message: 'User registered successfully', data: { username, email, age } });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
```

### Run express server 
```js
npm run dev
```

Server is running on [http://localhost:3000](http://localhost:3000)