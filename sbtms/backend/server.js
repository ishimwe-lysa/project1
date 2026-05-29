// SBTMS backend entry
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const errorHandler = require('./middleware/errorHandler');
const seedAdmin = require('./utils/seedAdmin');
const seedManager = require('./utils/seedManager');

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_, res) => res.json({ ok: true, name: 'SBTMS' }));

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/buses',     require('./routes/buses'));
app.use('/api/drivers',   require('./routes/drivers'));
app.use('/api/routes',    require('./routes/routes'));
app.use('/api/schedules', require('./routes/schedules'));
app.use('/api/bookings',  require('./routes/bookings'));
app.use('/api/payments',  require('./routes/payments'));
app.use('/api/reports',   require('./routes/reports'));
app.use('/api/manager',   require('./routes/manager'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`SBTMS backend running on port ${PORT}`);
  await seedAdmin();
  await seedManager();
});
