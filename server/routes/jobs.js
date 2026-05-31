const router = require('express').Router();
const { body, query } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const { createJob, listJobs, getMyJobs, updateJob, deleteJob } = require('../controllers/jobsController');

router.post('/', auth, body('title').notEmpty(), body('job_type').isIn(['full-time', 'part-time', 'internship', 'contract']), createJob);
router.get('/', query('location').optional().isString(), query('job_type').optional().isString(), query('min').optional().isInt(), query('max').optional().isInt(), listJobs);
router.get('/mine', auth, getMyJobs); // ✅ Moved logic to controller
router.put('/:id', auth, updateJob);
router.delete('/:id', auth, deleteJob);

module.exports = router;