const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());
app.use(cors());

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

app.get('/available_rooms', async (req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    console.log(startDate);
    console.log(endDate);

    const client = new Client({
        connectionString: 'postgresql://gera@localhost:5432/roomyshare'
    });

    try {
        await client.connect();

        const result = await client.query(`
        SELECT r.id as room_id, r.room_number,
            CASE 
            WHEN t.id IS NULL OR (t.contract_end_date < $1 OR t.contract_start_date > $2) THEN true 
            ELSE false 
            END as is_available
        FROM rooms r
        LEFT JOIN tenants t ON r.id = t.room_id     
        `, [startDate, endDate]);

        const availableRooms = result.rows;
        console.log(availableRooms);

        res.json(availableRooms);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        await client.end();
    }
});


  

app.post('/booking', async (req, res) => {
    const { startDate, endDate, roomNumber } = req.body;
    const client = new Client({
        connectionString: 'postgresql://gera@localhost:5432/roomyshare'
    });

    try {
        await client.connect();

        const result = await client.query('SELECT * FROM rooms WHERE room_number = $1', [roomNumber]);
        const room = result.rows[0];

        if (!room || room.status !== 'vacant') {
            return res.status(400).json({ message: 'Room is not available' });
        }

        await client.query('INSERT INTO tenants (contract_start_date, contract_end_date, room_id) VALUES ($1, $2, $3)', [startDate, endDate, room.id]);
        await client.query('UPDATE rooms SET status = $1 WHERE id = $2', ['occupied', room.id]);
        
        await client.end();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-password'
            }
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: 'tenant-email@gmail.com',
            subject: 'Booking Confirmation',
            text: 'Your room has been booked!'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.json({ message: 'Room booked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(3001, () => {
    console.log('Server started on port 3001');
});