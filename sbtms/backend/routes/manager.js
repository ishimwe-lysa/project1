const r = require('express').Router();
const c = require('../controllers/managerController');
const { authenticate, authorize } = require('../middleware/auth');
r.get('/dashboard', authenticate, authorize('admin', 'manager'), c.dashboard);
r.put('/schedules/:id/status', authenticate, authorize('admin', 'manager'), c.getScheduleStatus);
module.exports = r;