const r = require('express').Router();
const c = require('../controllers/routeController');
const { authenticate, authorize } = require('../middleware/auth');
r.get('/', c.list);
r.get('/:id', c.get);
r.post('/',   authenticate, authorize('admin'), c.create);
r.put('/:id', authenticate, authorize('admin'), c.update);
r.delete('/:id', authenticate, authorize('admin'), c.remove);
module.exports = r;
