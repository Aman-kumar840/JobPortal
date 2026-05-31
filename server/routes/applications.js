const router = require('express').Router();
const authenticate = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { 
    applyToJob, 
    getMyApplications, 
    getJobApplicants, 
    updateApplicationStatus,
    withdrawApplication
} = require('../controllers/applicationController');

// Applicant Routes
router.post('/jobs/:jobId/apply', authenticate, upload.single('resume'), applyToJob);
router.get('/my', authenticate, getMyApplications);

router.delete('/:id', authenticate, withdrawApplication);

// Recruiter Routes
router.get('/job/:id', authenticate, getJobApplicants);
router.patch('/:id/status', authenticate, updateApplicationStatus);
// Add this under your Applicant Routes

module.exports = router;