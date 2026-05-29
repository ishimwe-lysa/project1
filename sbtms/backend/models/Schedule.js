const db = require('../config/db');
module.exports = {
  search: async ({ origin, destination, date }) => {
    let sql = `
      SELECT s.*, b.bus_number,b.bus_name,b.bus_type,b.total_seats,
             r.origin,r.destination,r.distance_km,r.duration_hours
        FROM schedules s
        JOIN buses b ON b.id=s.bus_id
        JOIN routes r ON r.id=s.route_id
       WHERE 1=1`;
    const args = [];
    if (origin)      { sql += ' AND r.origin LIKE ?';      args.push(`%${origin}%`); }
    if (destination) { sql += ' AND r.destination LIKE ?'; args.push(`%${destination}%`); }
    if (date)        { sql += ' AND DATE(s.departure_time)=?'; args.push(date); }
    sql += ' ORDER BY s.departure_time ASC';
    const [r] = await db.query(sql, args);
    return r;
  },
  find: async (id) => {
    const [r] = await db.query(
      `SELECT s.*, b.bus_number,b.bus_name,b.bus_type,b.total_seats,
              r.origin,r.destination
         FROM schedules s
         JOIN buses b ON b.id=s.bus_id
         JOIN routes r ON r.id=s.route_id
        WHERE s.id=?`, [id]);
    return r[0];
  },
  bookedSeats: async (scheduleId) => {
    const [r] = await db.query(
      "SELECT seat_number FROM bookings WHERE schedule_id=? AND status='booked'",
      [scheduleId]);
    return r.map(x => x.seat_number);
  },
  create: async (d) => {
    const [r] = await db.query(
      'INSERT INTO schedules(bus_id,route_id,departure_time,arrival_time,fare) VALUES(?,?,?,?,?)',
      [d.bus_id, d.route_id, d.departure_time, d.arrival_time, d.fare]);
    return r.insertId;
  },
  update: async (id, d) => db.query(
    'UPDATE schedules SET bus_id=?,route_id=?,departure_time=?,arrival_time=?,fare=? WHERE id=?',
    [d.bus_id, d.route_id, d.departure_time, d.arrival_time, d.fare, id]),
  remove: async (id) => db.query('DELETE FROM schedules WHERE id=?', [id]),
};
