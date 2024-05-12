const express = require('express');
const knex = require('knex');

const app = express();
const port = 3000;

// Knex configuration
const db = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: 'Osaid@0599886818',
        database: 'mydb'
    }
});

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
// GET all users
app.get('/users', async (req, res) => {
    try {
        const users = await db.select().from('users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new user
app.post('/users', async (req, res) => {
    const { name, age } = req.body;
    if (!name) {
        res.status(400).json({ error: "Name is required" });
        return;
    }

    try {
        await db('users').insert({ name, age });
        res.status(201).send('User added successfully');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update a user
app.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, age } = req.body;

    try {
        await db('users').where({ id: userId }).update({ name, age });
        res.send('User updated successfully');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a user
app.delete('/users/:id', async (req, res) => {
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
