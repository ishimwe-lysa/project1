const r = require('express').Router();
const c = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');
r.post('/', authenticate, c.create);
r.get('/my', authenticate, c.my);
r.get('/:id', authenticate, c.get);
r.delete('/:id', authenticate, c.cancel);
r.get('/', authenticate, authorize('admin', 'manager'), c.list);
module.exports = r;
