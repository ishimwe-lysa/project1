const db = require('../config/db');
module.exports = {
  create: async ({ name, email, password, phone, address }) => {
    const [r] = await db.query(
      'INSERT INTO users(name,email,password,phone,address) VALUES(?,?,?,?,?)',
      [name, email, password, phone || null, address || null]
    );
    return r.insertId;
  },
  findByEmail: async (email) => {
    const [r] = await db.query('SELECT * FROM users WHERE email=?', [email]);
    return r[0];
  },
  findById: async (id) => {
    const [r] = await db.query('SELECT id,name,email,phone,address,created_at FROM users WHERE id=?', [id]);
    return r[0];
  },
  all: async () => {
    const [r] = await db.query('SELECT id,name,email,phone,address,created_at FROM users ORDER BY id DESC');
    return r;
  },
  update: async (id, { name, phone, address }) => {
    await db.query('UPDATE users SET name=?,phone=?,address=? WHERE id=?', [name, phone, address, id]);
  },
};
