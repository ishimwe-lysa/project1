const Schedule = require('../models/Schedule');
exports.list = async (req, res, next) => {
  try {
    const { origin, destination, date } = req.query;
    res.json(await Schedule.search({ origin, destination, date }));
  } catch (e) { next(e); }
};
exports.get = async (req, res, next) => {
  try {
    const schedule = await Schedule.find(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Not found' });
    const booked = await Schedule.bookedSeats(schedule.id);
    res.json({ ...schedule, booked_seats: booked });
  } catch (e) { next(e); }
};
exports.create = async (q,s,n)=>{ try{ s.status(201).json({id:await Schedule.create(q.body)}); }catch(e){n(e);} };
exports.update = async (q,s,n)=>{ try{ await Schedule.update(q.params.id,q.body); s.json({ok:true}); }catch(e){n(e);} };
exports.remove = async (q,s,n)=>{ try{ await Schedule.remove(q.params.id); s.json({ok:true}); }catch(e){n(e);} };
