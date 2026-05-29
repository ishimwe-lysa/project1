const db = require('../config/db');
module.exports = {
  findByEmail: async (email) => {
    const [r] = await db.query('SELECT * FROM admins WHERE email=?', [email]);
    return r[0];
  },
};
