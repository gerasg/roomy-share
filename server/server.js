const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const client = new Client({
        connectionString: 'postgresql://gera@localhost:5432/roomyshare'
    });

    try {
    await client.connect();

    const result = await client.query('SELECT * FROM owners WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, 'your_secret_key');

    res.json({ message: 'Logged in successfully', token });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(3001, () => {
    console.log('Server started on port 3001');
});