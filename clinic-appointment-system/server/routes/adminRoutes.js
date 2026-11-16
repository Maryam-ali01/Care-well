const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/adminController');

router.use(protect, authorize('admin'));

router.get('/users', c.getUsers);
router.post('/doctors', c.createDoctor);
router.delete('/users/:id', c.deleteUser);
router.patch('/users/:id/status', c.toggleUserStatus);
router.get('/appointments', c.getAppointments);
router.get('/stats', c.getStats);

module.exports = router;
