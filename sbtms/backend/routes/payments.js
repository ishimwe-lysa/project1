const r = require('express').Router();
const c = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/auth');
r.get('/', authenticate, authorize('admin', 'manager'), c.list);
r.post('/', authenticate, c.create);
module.exports = r;
