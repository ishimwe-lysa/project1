const r = require('express').Router();
const c = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
r.post('/register', c.register);
r.post('/login', c.login);
r.post('/admin/login', c.adminLogin);
r.get('/me', authenticate, c.me);
module.exports = r;
