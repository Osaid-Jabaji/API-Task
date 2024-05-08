const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// MySQL connection configuration
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'Osaid@0599886818',
    database: 'mydb'
});

// Connect to MySQL
connection.connect();

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
// GET all users
app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// POST a new user
// POST a new user
app.post('/users', (req, res) => {
    const { name, age } = req.body;
    if (!name) {
        res.status(400).json({ error: "Name is required" });
        return;
    }
    connection.query('INSERT INTO users (name, age) VALUES (?, ?)', [name, age], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).send('User added successfully');
    });
});


// PUT update a user
// PUT update a user
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name, age } = req.body;
    connection.query('UPDATE users SET name = ?, age = ? WHERE id = ?', [name, age, userId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.send('User updated successfully');
    });
});


// DELETE a user
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    connection.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.send('User deleted successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
