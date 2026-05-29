const db = require('../config/db');
module.exports = {
  create: async ({ user_id, schedule_id, seat_number, total_amount }) => {
    const [r] = await db.query(
      "INSERT INTO bookings(user_id,schedule_id,seat_number,total_amount) VALUES(?,?,?,?)",
      [user_id, schedule_id, seat_number, total_amount]);
    return r.insertId;
  },
  byUser: async (userId) => {
    const [r] = await db.query(
      `SELECT bk.*, t.ticket_code,
              s.departure_time,s.arrival_time,s.fare,
              b.bus_number,b.bus_name,
              r.origin,r.destination
         FROM bookings bk
         JOIN schedules s ON s.id=bk.schedule_id
         JOIN buses b ON b.id=s.bus_id
         JOIN routes r ON r.id=s.route_id
         LEFT JOIN tickets t ON t.booking_id=bk.id
        WHERE bk.user_id=?
        ORDER BY bk.id DESC`, [userId]);
    return r;
  },
  all: async () => {
    const [r] = await db.query(
      `SELECT bk.*, u.name AS user_name,u.email,
              s.departure_time, b.bus_number, r.origin,r.destination,
              t.ticket_code
         FROM bookings bk
         JOIN users u ON u.id=bk.user_id
         JOIN schedules s ON s.id=bk.schedule_id
         JOIN buses b ON b.id=s.bus_id
         JOIN routes r ON r.id=s.route_id
         LEFT JOIN tickets t ON t.booking_id=bk.id
        ORDER BY bk.id DESC`);
    return r;
  },
  find: async (id) => {
    const [r] = await db.query(
      `SELECT bk.*, t.ticket_code,
              s.departure_time,s.arrival_time,s.fare,
              b.bus_number,b.bus_name,
              r.origin,r.destination,
              u.name AS user_name,u.email
         FROM bookings bk
         JOIN schedules s ON s.id=bk.schedule_id
         JOIN buses b ON b.id=s.bus_id
         JOIN routes r ON r.id=s.route_id
         JOIN users u ON u.id=bk.user_id
         LEFT JOIN tickets t ON t.booking_id=bk.id
        WHERE bk.id=?`, [id]);
    return r[0];
  },
  cancel: async (id) => db.query("UPDATE bookings SET status='cancelled' WHERE id=?", [id]),
};
