const router = require('express').Router();
const { protect } = require('../middleware/auth');
const c = require('../controllers/doctorController');

router.get('/featured', c.getFeatured);
router.get('/specializations', protect, c.getSpecializations);
router.get('/', protect, c.getDoctors);
router.get('/:id', protect, c.getDoctorById);

module.exports = router;
