const db = require('../config/db');

module.exports = {
  create: async ({ name, email, password }) => {
    const [r] = await db.query(
      'INSERT INTO managers(name,email,password) VALUES(?,?,?)',
      [name, email, password]
    );
    return r.insertId;
  },
  findByEmail: async (email) => {
    const [r] = await db.query('SELECT * FROM managers WHERE email=?', [email]);
    return r[0];
  },
  findById: async (id) => {
    const [r] = await db.query('SELECT id,name,email,role,created_at,updated_at FROM managers WHERE id=?', [id]);
    return r[0];
  },
  all: async () => {
    const [r] = await db.query('SELECT id,name,email,role,created_at,updated_at FROM managers ORDER BY id DESC');
    return r;
  },
  update: async (id, { name, email }) => {
    await db.query('UPDATE managers SET name=?,email=? WHERE id=?', [name, email, id]);
  },
  remove: async (id) => {
    await db.query('DELETE FROM managers WHERE id=?', [id]);
  },
};