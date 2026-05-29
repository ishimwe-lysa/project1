// Ensures the default admin and sample user passwords are valid bcrypt hashes.
const bcrypt = require('bcrypt');
const db = require('../config/db');

async function ensureHash(table, email, plain) {
  const [rows] = await db.query(`SELECT id,password FROM ${table} WHERE email=?`, [email]);
  if (!rows.length) return;
  const ok = await bcrypt.compare(plain, rows[0].password).catch(() => false);
  if (!ok) {
    const hash = await bcrypt.hash(plain, 10);
    await db.query(`UPDATE ${table} SET password=? WHERE id=?`, [hash, rows[0].id]);
    console.log(`[seed] Reset password for ${table}:${email}`);
  }
}

module.exports = async function seed() {
  try {
    await ensureHash('admins', 'admin@sbtms.com', 'admin123');
    await ensureHash('users', 'john@example.com', 'password123');
    await ensureHash('users', 'jane@example.com', 'password123');
  } catch (e) {
    console.error('[seed] failed:', e.message);
  }
};
