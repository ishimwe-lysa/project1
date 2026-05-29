const db = require('../config/db');
exports.summary = async (req, res, next) => {
  try {
    const [[u]] = await db.query('SELECT COUNT(*) AS c FROM users');
    const [[b]] = await db.query('SELECT COUNT(*) AS c FROM buses');
    const [[r]] = await db.query('SELECT COUNT(*) AS c FROM routes');
    const [[s]] = await db.query('SELECT COUNT(*) AS c FROM schedules');
    const [[bk]] = await db.query("SELECT COUNT(*) AS c FROM bookings WHERE status='booked'");
    const [[rev]] = await db.query("SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE status='paid'");
    const [topRoutes] = await db.query(`
      SELECT r.origin, r.destination, COUNT(bk.id) AS bookings
        FROM bookings bk
        JOIN schedules s ON s.id=bk.schedule_id
        JOIN routes r ON r.id=s.route_id
       WHERE bk.status='booked'
       GROUP BY r.id
       ORDER BY bookings DESC LIMIT 5`);
    res.json({
      counts: { users: u.c, buses: b.c, routes: r.c, schedules: s.c, bookings: bk.c },
      revenue: Number(rev.total),
      topRoutes,
    });
  } catch (e) { next(e); }
};
