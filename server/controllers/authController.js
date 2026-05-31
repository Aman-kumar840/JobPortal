const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 📥 POST /api/auth/register
const registerUser = async (req, res) => {
    const { email, password, full_name, role, skills } = req.body;

    if (!email || !password || !full_name || !role) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const normalizedEmail = email.toLowerCase(); // Prevent case-sensitivity issues

        const result = await pool.query(
            'INSERT INTO users (email, password_hash, full_name, role, skills) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name, role',
            [normalizedEmail, hashedPassword, full_name, role, skills || []]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
};

// 📥 POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const normalizedEmail = email.toLowerCase();
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [normalizedEmail]
        );

        const user = result.rows[0];
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token, role: user.role, userId: user.id });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// 🧪 GET /api/auth/me
const getCurrentUser = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, full_name, role, skills FROM users WHERE id = $1',
            [req.user.userId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

module.exports = { registerUser, loginUser, getCurrentUser };