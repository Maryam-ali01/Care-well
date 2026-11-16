const router = require('express').Router();
const { protect } = require('../middleware/auth');
const c = require('../controllers/authController');

router.post('/register', c.register);
router.post('/login', c.login);
router.get('/me', protect, c.getMe);
router.put('/profile', protect, c.updateProfile);

module.exports = router;
