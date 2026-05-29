const r = require('express').Router();
const c = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/auth');
r.get('/summary', authenticate, authorize('admin'), c.summary);
module.exports = r;
