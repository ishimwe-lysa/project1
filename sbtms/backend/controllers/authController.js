const bcrypt = require('bcrypt');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Manager = require('../models/Manager');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    if (password.length < 6) return res.status(400).json({ message: 'Password too short' });
    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const id = await User.create({ name, email, password: hash, phone, address });
    const token = generateToken({ id, role: 'passenger', email });
    res.status(201).json({ token, user: { id, name, email, role: 'passenger' } });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken({ id: user.id, role: 'passenger', email: user.email });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: 'passenger' } });
  } catch (e) { next(e); }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findByEmail(email);
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken({ id: admin.id, role: 'admin', email: admin.email });
    res.json({ token, user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' } });
  } catch (e) { next(e); }
};

exports.managerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const manager = await Manager.findByEmail(email);
    if (!manager) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, manager.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken({ id: manager.id, role: 'manager', email: manager.email });
    res.json({ token, user: { id: manager.id, name: manager.name, email: manager.email, role: 'manager' } });
  } catch (e) { next(e); }
};

exports.me = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      const admin = await Admin.findByEmail(req.user.email);
      return res.json({ id: admin.id, name: admin.name, email: admin.email, role: 'admin' });
    }
    if (req.user.role === 'manager') {
      const manager = await Manager.findByEmail(req.user.email);
      return res.json({ id: manager.id, name: manager.name, email: manager.email, role: 'manager' });
    }
    const u = await User.findById(req.user.id);
    res.json({ ...u, role: 'passenger' });
  } catch (e) { next(e); }
};
