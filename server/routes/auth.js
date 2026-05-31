const router = require('express').Router();
const {
    registerUser,
    loginUser,
    getCurrentUser,
} = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route (example)
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
