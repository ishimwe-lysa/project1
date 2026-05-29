const db = require('../config/db');
module.exports = {
  create: async ({ booking_id, amount, method, transaction_ref }) => {
    const [r] = await db.query(
      "INSERT INTO payments(booking_id,amount,method,status,transaction_ref) VALUES(?,?,?, 'paid', ?)",
      [booking_id, amount, method || 'card', transaction_ref || ('TXN' + Date.now())]);
    return r.insertId;
  },
  all: async () => {
    const [r] = await db.query(
      `SELECT p.*, bk.user_id, u.name AS user_name
         FROM payments p
         JOIN bookings bk ON bk.id=p.booking_id
         JOIN users u ON u.id=bk.user_id
        ORDER BY p.id DESC`);
    return r;
  },
};
