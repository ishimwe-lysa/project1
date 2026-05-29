const db = require('../config/db');

exports.dashboard = async (req, res, next) => {
  try {
    // Counts
    const [[users]] = await db.query('SELECT COUNT(*) AS c FROM users');
    const [[buses]] = await db.query('SELECT COUNT(*) AS c FROM buses');
    const [[routes]] = await db.query('SELECT COUNT(*) AS c FROM routes');
    const [[schedules]] = await db.query('SELECT COUNT(*) AS c FROM schedules');
    const [[bookings]] = await db.query("SELECT COUNT(*) AS c FROM bookings WHERE status='booked'");
    const [[revenue]] = await db.query("SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE status='paid'");
    const [[pendingSchedules]] = await db.query("SELECT COUNT(*) AS c FROM schedules WHERE status='pending'");
    const [[approvedSchedules]] = await db.query("SELECT COUNT(*) AS c FROM schedules WHERE status='approved'");
    const [[rejectedSchedules]] = await db.query("SELECT COUNT(*) AS c FROM schedules WHERE status='rejected'");

    // Today's bookings and revenue
    const [[todayBookings]] = await db.query(`
      SELECT COUNT(*) AS c FROM bookings 
      WHERE DATE(created_at) = CURDATE() AND status='booked'
    `);
    const [[todayRevenue]] = await db.query(`
      SELECT COALESCE(SUM(p.amount),0) AS total 
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      WHERE DATE(p.created_at) = CURDATE() AND p.status='paid' AND b.status='booked'
    `);

    // Top routes by bookings (last 30 days)
    const [topRoutes] = await db.query(`
      SELECT r.origin, r.destination, COUNT(bk.id) AS bookings
      FROM bookings bk
      JOIN schedules s ON s.id=bk.schedule_id
      JOIN routes r ON r.id=s.route_id
      WHERE bk.status='booked'
        AND bk.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY r.id
      ORDER BY bookings DESC LIMIT 5
    `);

    // Revenue trend (last 7 days)
    const [revenueTrend] = await db.query(`
      SELECT DATE(p.created_at) AS date, COALESCE(SUM(p.amount),0) AS daily_revenue
      FROM payments p
      WHERE p.status='paid'
        AND p.created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(p.created_at)
      ORDER BY date ASC
    `);

    // Bus utilization (average occupancy percentage)
    const [busUtilization] = await db.query(`
      SELECT b.id, b.bus_number, b.bus_name,
             COALESCE(AVG(
               (SELECT COUNT(*) FROM bookings bk 
                WHERE bk.schedule_id = s.id AND bk.status='booked')
             ) / b.total_seats * 100, 0) AS avg_occupancy_percent
      FROM buses b
      LEFT JOIN schedules s ON s.bus_id = b.id
      GROUP BY b.id
    `);

    res.json({
      counts: {
        users: users.c,
        buses: buses.c,
        routes: routes.c,
        schedules: schedules.c,
        bookings: bookings.c,
        revenue: Number(revenue.total),
        pendingSchedules: pendingSchedules.c,
        approvedSchedules: approvedSchedules.c,
        rejectedSchedules: rejectedSchedules.c
      },
      today: {
        bookings: todayBookings.c,
        revenue: Number(todayRevenue.total)
      },
      topRoutes,
      revenueTrend,
      busUtilization
    });
  } catch (e) { next(e); }
};

exports.getScheduleStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    await db.query('UPDATE schedules SET status=? WHERE id=?', [status, id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
};