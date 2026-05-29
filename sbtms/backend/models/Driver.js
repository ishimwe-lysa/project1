const db = require('../config/db');
module.exports = {
  all: async () => (await db.query('SELECT * FROM drivers ORDER BY id DESC'))[0],
  find: async (id) => (await db.query('SELECT * FROM drivers WHERE id=?', [id]))[0][0],
  create: async (d) => {
    const [r] = await db.query(
      'INSERT INTO drivers(name,license_no,phone,experience_years) VALUES(?,?,?,?)',
      [d.name, d.license_no, d.phone, d.experience_years || 0]);
    return r.insertId;
  },
  update: async (id, d) => db.query(
    'UPDATE drivers SET name=?,license_no=?,phone=?,experience_years=? WHERE id=?',
    [d.name, d.license_no, d.phone, d.experience_years || 0, id]),
  remove: async (id) => db.query('DELETE FROM drivers WHERE id=?', [id]),
};
