const User = require('../models/User');
exports.profile = async (req, res, next) => {
  try { res.json(await User.findById(req.user.id)); } catch (e) { next(e); }
};
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    await User.update(req.user.id, { name, phone, address });
    res.json(await User.findById(req.user.id));
  } catch (e) { next(e); }
};
exports.list = async (req, res, next) => {
  try { res.json(await User.all()); } catch (e) { next(e); }
};
