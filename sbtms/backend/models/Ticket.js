const db = require('../config/db');
module.exports = {
  create: async (booking_id) => {
    const code = 'TKT-' + Date.now().toString().slice(-7);
    await db.query('INSERT INTO tickets(booking_id,ticket_code) VALUES(?,?)', [booking_id, code]);
    return code;
  },
};
