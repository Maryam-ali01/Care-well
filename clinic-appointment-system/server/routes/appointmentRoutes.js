const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/appointmentController');

router.use(protect);

router.post('/', authorize('patient'), c.createAppointment);
router.get('/my', authorize('patient'), c.getMyAppointments);
router.get('/doctor', authorize('doctor'), c.getDoctorAppointments);
router.get('/:id', c.getAppointmentById);
router.patch('/:id/status', authorize('doctor'), c.updateStatus);
router.patch('/:id/cancel', authorize('patient'), c.cancelAppointment);

module.exports = router;
