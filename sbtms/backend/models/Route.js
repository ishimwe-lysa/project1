const db = require('../config/db');
module.exports = {
  all: async () => (await db.query('SELECT * FROM routes ORDER BY id DESC'))[0],
  find: async (id) => (await db.query('SELECT * FROM routes WHERE id=?', [id]))[0][0],
  create: async (d) => {
    const [r] = await db.query(
      'INSERT INTO routes(origin,destination,distance_km,duration_hours) VALUES(?,?,?,?)',
      [d.origin, d.destination, d.distance_km || 0, d.duration_hours || 0]);
    return r.insertId;
  },
  update: async (id, d) => db.query(
    'UPDATE routes SET origin=?,destination=?,distance_km=?,duration_hours=? WHERE id=?',
    [d.origin, d.destination, d.distance_km || 0, d.duration_hours || 0, id]),
  remove: async (id) => db.query('DELETE FROM routes WHERE id=?', [id]),
};
