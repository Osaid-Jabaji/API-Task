const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../db/connection');

const secretKey = 'your_jwt_secret_key';

const signUp = async (req, res) => {
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
};

const login = async (req, res) => {
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
};

const getAllUsers = async (req, res) => {
    try {
        const users = await db.select().from('users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createUser = async (req, res) => {
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
};

const updateUser = async (req, res) => {
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
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        await db('users').where({ id: userId }).del();
        res.send('User deleted successfully');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    signUp,
    login,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};
