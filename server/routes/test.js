const router = require('express').Router();
const pool = require('../db');

router.get('/users', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT NOW() AS time');
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
