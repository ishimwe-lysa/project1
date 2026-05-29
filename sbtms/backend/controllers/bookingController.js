const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');
const Ticket = require('../models/Ticket');
const Payment = require('../models/Payment');

exports.create = async (req, res, next) => {
  try {
    const { schedule_id, seat_number, payment_method } = req.body;
    if (!schedule_id || !seat_number) return res.status(400).json({ message: 'Missing fields' });

    const schedule = await Schedule.find(schedule_id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    if (seat_number < 1 || seat_number > schedule.total_seats)
      return res.status(400).json({ message: 'Invalid seat number' });

    const booked = await Schedule.bookedSeats(schedule_id);
    if (booked.includes(Number(seat_number)))
      return res.status(409).json({ message: 'Seat already booked' });

    const bookingId = await Booking.create({
      user_id: req.user.id,
      schedule_id,
      seat_number,
      total_amount: schedule.fare,
    });
    const ticket_code = await Ticket.create(bookingId);
    await Payment.create({
      booking_id: bookingId,
      amount: schedule.fare,
      method: payment_method || 'card',
    });
    const booking = await Booking.find(bookingId);
    res.status(201).json({ booking, ticket_code });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'Seat already booked' });
    next(e);
  }
};

exports.my     = async (q,s,n)=>{ try{ s.json(await Booking.byUser(q.user.id)); }catch(e){n(e);} };
exports.list   = async (q,s,n)=>{ try{ s.json(await Booking.all()); }catch(e){n(e);} };
exports.get    = async (q,s,n)=>{ try{ s.json(await Booking.find(q.params.id)); }catch(e){n(e);} };
exports.cancel = async (q,s,n)=>{ try{ await Booking.cancel(q.params.id); s.json({ok:true}); }catch(e){n(e);} };
