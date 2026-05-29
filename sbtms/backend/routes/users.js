const r = require('express').Router();
const c = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
r.get('/profile', authenticate, c.profile);
r.put('/profile', authenticate, c.updateProfile);
r.get('/', authenticate, authorize('admin'), c.list);
module.exports = r;
