const db = require('../config/db');
module.exports = {
  all: async () => {
    const [r] = await db.query(
      `SELECT b.*, d.name AS driver_name
         FROM buses b LEFT JOIN drivers d ON d.id=b.driver_id
        ORDER BY b.id DESC`);
    return r;
  },
  find: async (id) => {
    const [r] = await db.query('SELECT * FROM buses WHERE id=?', [id]);
    return r[0];
  },
  create: async (d) => {
    const [r] = await db.query(
      'INSERT INTO buses(bus_number,bus_name,bus_type,total_seats,driver_id) VALUES(?,?,?,?,?)',
      [d.bus_number, d.bus_name, d.bus_type, d.total_seats, d.driver_id || null]);
    return r.insertId;
  },
  update: async (id, d) => {
    await db.query(
      'UPDATE buses SET bus_number=?,bus_name=?,bus_type=?,total_seats=?,driver_id=? WHERE id=?',
      [d.bus_number, d.bus_name, d.bus_type, d.total_seats, d.driver_id || null, id]);
  },
  remove: async (id) => db.query('DELETE FROM buses WHERE id=?', [id]),
};
