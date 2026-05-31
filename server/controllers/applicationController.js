const pool = require('../db');

const applyToJob = async (req, res) => {
    const { jobId } = req.params;
    const applicantId = req.user.userId;

    try {
        const existing = await pool.query(
            'SELECT * FROM applications WHERE applicant_id = $1 AND job_id = $2',
            [applicantId, jobId]
        );

        if (existing.rows.length > 0) {
            if (existing.rows[0].status === 'withdrawn') {
                await pool.query(
                    "UPDATE applications SET status = 'pending', resume_url = $1 WHERE id = $2",
                    [req.file?.filename || null, existing.rows[0].id]
                );
                return res.status(201).json({ message: 'Application resubmitted' });
            }
            return res.status(400).json({ error: 'Already applied' });
        }

        await pool.query(
            'INSERT INTO applications (applicant_id, job_id, resume_url) VALUES ($1, $2, $3)',
            [applicantId, jobId, req.file?.filename || null]
        );

        res.status(201).json({ message: 'Application submitted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT a.id, a.job_id, a.status, a.resume_url, j.title as job_title, u.full_name as recruiter_name
            FROM applications a 
            JOIN jobs j ON a.job_id = j.id 
            JOIN users u ON j.recruiter_id = u.id
            WHERE a.applicant_id = $1
            ORDER BY a.applied_at DESC
        `, [req.user.userId]);
        
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch your applications' });
    }
};

const getJobApplicants = async (req, res) => {
    const { id: jobId } = req.params;
    try {
        const jobCheck = await pool.query('SELECT title, recruiter_id FROM jobs WHERE id = $1', [jobId]);
        if (jobCheck.rows.length === 0) return res.status(404).json({ error: 'Job not found' });
        if (jobCheck.rows[0].recruiter_id !== req.user.userId) return res.status(403).json({ error: 'Unauthorized' });

        const { rows } = await pool.query(`
            SELECT a.id, a.status, a.resume_url, u.full_name as applicant_name, u.email as applicant_email 
            FROM applications a 
            JOIN users u ON a.applicant_id = u.id 
            WHERE a.job_id = $1
            ORDER BY a.applied_at DESC
        `, [jobId]);

        res.json({ jobTitle: jobCheck.rows[0].title, applicants: rows });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch applicants' });
    }
};

const updateApplicationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE applications SET status = $1 WHERE id = $2', [status, id]);
        res.json({ message: 'Status updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update status' });
    }
};

const withdrawApplication = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "UPDATE applications SET status = 'withdrawn' WHERE id = $1 AND applicant_id = $2 RETURNING *",
            [id, req.user.userId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Application not found' });
        res.json({ message: 'Application withdrawn' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to withdraw' });
    }
};

module.exports = { applyToJob, getMyApplications, getJobApplicants, updateApplicationStatus, withdrawApplication };