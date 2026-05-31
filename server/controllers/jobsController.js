const { validationResult } = require('express-validator');
const pool = require('../db');

function ensureRecruiter(req, res) {
    if (req.user.role !== 'recruiter') {
        res.status(403).json({ error: 'Only recruiters allowed' });
        return false;
    }
    return true;
}

const createJob = async (req, res) => {
    if (!ensureRecruiter(req, res)) return;

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, location, salary_min, salary_max, job_type } = req.body;

    try {
        const { rows } = await pool.query(
            `INSERT INTO jobs (recruiter_id, title, description, location, salary_min, salary_max, job_type)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [req.user.userId, title, description, location, salary_min || null, salary_max || null, job_type]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create job' });
    }
};

const listJobs = async (req, res) => {
    const { search, location, job_type } = req.query;
    const conditions = [];
    const values = [];

    // Prefix with jobs. because we are joining tables now
    if (search) {
        values.push(`%${search}%`);
        conditions.push(`(jobs.title ILIKE $${values.length} OR jobs.description ILIKE $${values.length})`);
    }
    if (location) {
        values.push(`%${location}%`);
        conditions.push(`jobs.location ILIKE $${values.length}`);
    }
    if (job_type) {
        values.push(job_type);
        conditions.push(`jobs.job_type = $${values.length}`);
    }

    const queryStr = `
        SELECT jobs.*, users.full_name as recruiter_name 
        FROM jobs
        JOIN users ON jobs.recruiter_id = users.id
        ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}
        ORDER BY jobs.created_at DESC
    `;

    try {
        const { rows } = await pool.query(queryStr, values);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to list jobs' });
    }
};

const getMyJobs = async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM jobs WHERE recruiter_id = $1 ORDER BY created_at DESC',
            [req.user.userId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch your jobs' });
    }
};

const updateJob = async (req, res) => {
    if (!ensureRecruiter(req, res)) return;
    const { id } = req.params;
    
    const { rows: jobRows } = await pool.query('SELECT recruiter_id FROM jobs WHERE id=$1', [id]);
    if (!jobRows.length) return res.status(404).json({ error: 'Job not found' });
    if (jobRows[0].recruiter_id !== req.user.userId) return res.status(403).json({ error: 'Not your job' });

    const { title, description, location, salary_min, salary_max, job_type } = req.body;

    try {
        const { rows } = await pool.query(
            `UPDATE jobs SET
             title = COALESCE($1,title), description = COALESCE($2,description), location = COALESCE($3,location),
             salary_min = COALESCE($4,salary_min), salary_max = COALESCE($5,salary_max), job_type = COALESCE($6,job_type)
             WHERE id=$7 RETURNING *`,
            [title, description, location, salary_min, salary_max, job_type, id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update job' });
    }
};

const deleteJob = async (req, res) => {
    if (!ensureRecruiter(req, res)) return;
    const { id } = req.params;

    const { rows: jobRows } = await pool.query('SELECT recruiter_id FROM jobs WHERE id=$1', [id]);
    if (!jobRows.length) return res.status(404).json({ error: 'Job not found' });
    if (jobRows[0].recruiter_id !== req.user.userId) return res.status(403).json({ error: 'Not your job' });

    try {
        await pool.query('DELETE FROM jobs WHERE id=$1', [id]);
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete job' });
    }
};

module.exports = { createJob, listJobs, getMyJobs, updateJob, deleteJob };