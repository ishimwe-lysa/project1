const r = require('express').Router();
const c = require('../controllers/scheduleController');
const { authenticate, authorize } = require('../middleware/auth');
r.get('/', authenticate, authorize('admin', 'manager'), c.list);
r.get('/:id', authenticate, authorize('admin', 'manager'), c.get);
r.post('/',   authenticate, authorize('admin'), c.create);
r.put('/:id', authenticate, authorize('admin', 'manager'), c.update);
r.delete('/:id', authenticate, authorize('admin', 'manager'), c.remove);
module.exports = r;
