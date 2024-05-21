const express = require('express');
const knex = require('knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3000;
const secretKey = 'your_jwt_secret_key';

// Knex configuration
const db = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: 'Osaid@0599886818',
        database: 'my_db'
    }
});

// Middleware to parse JSON bodies
app.use(express.json());

// Authentication middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// Sign-up route with validation
app.post('/signup', [
    body('name').isString().isLength({ min: 1 }).trim().escape(),
    body('password').isLength({ min: 6 }).trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db('users').insert({ name, password: hashedPassword });
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login route with validation
app.post('/login', [
    body('name').isString().isLength({ min: 1 }).trim().escape(),
    body('password').isLength({ min: 6 }).trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;

    try {
        const user = await db('users').where({ name }).first();
        if (!user) {
            return res.status(400).json({ error: 'Invalid name or password.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid name or password.' });
        }

        const token = jwt.sign({ _id: user.id }, secretKey);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET all users (protected route)
app.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await db.select().from('users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new user (protected route) with validation
app.post('/users', authMiddleware, [
    body('name').isString().isLength({ min: 1 }).trim().escape(),
    body('password').isLength({ min: 6 }).trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db('users').insert({ name, password: hashedPassword });
        res.status(201).send('User added successfully');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update a user (protected route) with validation
app.put('/users/:id', authMiddleware, [
    body('name').isString().isLength({ min: 1 }).trim().escape(),
    body('password').isLength({ min: 6 }).trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.id;
    const { name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db('users').where({ id: userId }).update({ name, password: hashedPassword });
        res.send('User updated successfully');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a user (protected route)
app.delete('/users/:id', authMiddleware, async (req, res) => {
    const userId = req.params.id;

    try {
        await db('users').where({ id: userId }).del();
        res.send('User deleted successfully');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
