const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const cron = require('node-cron');
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // frontend URL
    methods: ['GET', 'POST', 'PUT'], // allowed methods
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Función de middleware para verificar el token
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({message: 'Token missing'});

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({message: 'Token expired'});
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({message: 'Invalid token'});
            } else {
                return res.status(500).json({message: 'Token validation failed'});
            }
        }

        req.user = user;
        next();
    });
}

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const client = new Client({
        connectionString: dbUrl
    });

    try {
    await client.connect();

    // Primero busco en la tabla de owners
    let result = await client.query('SELECT * FROM owners WHERE email = $1', [email]);
    let user = result.rows[0];
    let role = 'owner';

    // Si no encuentro un owner, busco en la tabla de tenants
    if (!user) {
        result = await client.query('SELECT * FROM tenants WHERE email = $1', [email]);
        user = result.rows[0];
        role = 'tenant';
    }

    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, role, name: user.name, lastname: user.lastname, contract_end_date: user.contract_end_date }, jwtSecret, { expiresIn: '1h' });

    res.json({ message: 'Logged in successfully', token, user: { name: user.name, lastname: user.lastname, role } });


    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}); 

app.get('/available_rooms', async (req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const client = new Client({
        connectionString: dbUrl
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

        res.json(availableRooms);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        await client.end();
    }
});

const assignTasks = async () => {
    const client = new Client({
        connectionString: dbUrl
    });

    try {
        await client.connect();

        const tasks = ['Limpiar baño', 'Limpiar cocina y comedor', 'Tirar la basura', 'Aspirar y fregar el suelo'];
        const daysOfWeek = [1, 3, 5, 0]; // Días de la semana en los que se asignan las tareas (Lunes, Miércoles, Viernes, Domingo)

        const nextWeekMonday = new Date();
        nextWeekMonday.setDate(nextWeekMonday.getDate() + ((7 - nextWeekMonday.getDay() + daysOfWeek[0]) % 7));

        const resultCheck = await client.query('SELECT * FROM tasks WHERE day >= $1', [nextWeekMonday]);

        // Si ya se asignaron tareas para la próxima semana, sale de la función
        if (resultCheck.rows.length > 0) {
            console.log('Las tareas ya han sido asignadas para la próxima semana');
            return;
        }

        // Obtiene todos los inquilinos con contrato activo
        const result = await client.query('SELECT * FROM tenants WHERE contract_end_date >= CURRENT_DATE');
        let tenants = result.rows;

        // Mezcla los inquilinos
        tenants = tenants.sort(() => Math.random() - 0.5);

        // Recorre cada tarea
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const day = new Date(nextWeekMonday);
            day.setDate(day.getDate() + 2 * i);
            const tenant = tenants[i % tenants.length];

            // Asigna la tarea al inquilino
            await client.query('INSERT INTO tasks (task, tenant_id, day) VALUES ($1, $2, $3)', [task, tenant.id, day]);
        }

        console.log('Tareas asignadas con éxito');

    } catch (error) {
        console.error('Database error:', error);
    } finally {
        await client.end();
    }
};

app.post('/assign_tasks', async (req, res) => {
    await assignTasks();
    res.json({ message: 'Tareas asignadas con éxito' });
});

app.get('/tenant_tasks', verifyToken, async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const user = req.user;

    if (!token) return res.sendStatus(401);

    jwt.verify(token, jwtSecret, async (err, user) => {
        if (err) return res.sendStatus(403);

        const client = new Client({
            connectionString: dbUrl
        });

        try {
            await client.connect();
            const result = await client.query(`
            SELECT tasks.*, tenants.name, tenants.lastname FROM tasks
            INNER JOIN tenants ON tasks.tenant_id = tenants.id
            WHERE tenant_id = $1 AND day >= (
                SELECT contract_start_date
                FROM tenants
                WHERE id = $1
            ) AND day <= (
                SELECT MAX(day) 
                FROM tasks
            )
            ORDER BY day DESC
            `, [user.userId]);

            const tasks = result.rows;
            res.json(tasks);
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ message: 'Internal server error' });
        } finally {
            await client.end();
        }
    });
});

app.get('/admin_tasks', verifyToken, async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const user = req.user;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, jwtSecret, async (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const client = new Client({
            connectionString: dbUrl
        });

        try {
            await client.connect();
            const result = await client.query(`
            SELECT * FROM tasks
            ORDER BY day DESC
            `);

            const all_tasks = result.rows;
            res.json(all_tasks);
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ message: 'Internal server error' });
        } finally {
            await client.end();
        }
    });
});

app.get('/payments', verifyToken, async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const user = req.user;

    if (!token) return res.sendStatus(401);

    jwt.verify(token, jwtSecret, async (err, user) => {
        if (err) return res.sendStatus(403);

        const client = new Client({
            connectionString: dbUrl
        });

        try {
            await client.connect();
            const result = await client.query(`
            SELECT * FROM payments
            WHERE tenant_id = $1
            ORDER BY payment_date ASC
            `, [user.userId]);

            const payments = result.rows;
            res.json(payments);
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ message: 'Internal server error' });
        } finally {
            await client.end();
        }
    });
});

app.get('/admin_payments', verifyToken, async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const user = req.user;

    if (!token) return res.sendStatus(401);

    jwt.verify(token, jwtSecret, async (err, user) => {
        if (err) return res.sendStatus(403);

        const client = new Client({
            connectionString: dbUrl
        });

        try {
            await client.connect();
            const result = await client.query(`
            SELECT * FROM payments
            ORDER BY payment_date ASC
            `);

            const all_payments = result.rows;
            res.json(all_payments);
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ message: 'Internal server error' });
        } finally {
            await client.end();
        }
    });
});

app.put('/tenant_tasks/:taskId', verifyToken, async (req, res) => {
    const taskId = req.params.taskId;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const user = req.user;

    if (!token) return res.sendStatus(401);

    jwt.verify(token, jwtSecret, async (err, user) => {
        if (err) return res.sendStatus(403);

        const client = new Client({
            connectionString: dbUrl
        });

        try {
            await client.connect();
            
            const result = await client.query(`
            SELECT * FROM tasks
            WHERE id = $1
            `, [taskId]);

            const task = result.rows[0];

            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            if (task.tenant_id !== user.userId) {
                return res.status(403).json({ message: 'Forbidden: You can only update your own tasks' });
            }

            const currentDate = new Date();
            const taskDate = new Date(task.day);

            if (taskDate.getTime() > currentDate.getTime()) {
                return res.status(400).json({ message: 'Cannot complete a future task' });
            }

            await client.query(`
            UPDATE tasks 
            SET completed = $1 
            WHERE id = $2
            `, [req.body.completed, taskId]);

            res.json({ message: 'Task updated successfully' });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ message: 'Internal server error' });
        } finally {
            await client.end();
        }
    });
});

app.get('/monthly_expenses', verifyToken, async (req, res) => {
    const client = new Client({ connectionString: dbUrl });

    try {
        await client.connect();

        const result = await client.query(`
            SELECT 
                EXTRACT(MONTH FROM expense_date) as month,
                EXTRACT(YEAR FROM expense_date) as year,
                expense_type,
                SUM(amount) as total_amount
            FROM expenses
            WHERE expense_date >= CURRENT_DATE - INTERVAL '12 months'
            GROUP BY 1, 2, expense_type
            ORDER BY year, month, expense_type
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        await client.end();
    }
});

app.get('/expenses', verifyToken, async (req, res) => {
    const client = new Client({ connectionString: dbUrl });

    try {
        await client.connect();

        const result = await client.query('SELECT * FROM expenses ORDER BY expense_date DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        await client.end();
    }
});

cron.schedule('0 0 * * 1', async function() {
    await assignTasks();
    console.log("Tareas asignadas");
});

app.listen(3001, () => {
    console.log('Server started on port 3001');
});