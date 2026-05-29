const Payment = require('../models/Payment');
exports.list   = async (q,s,n)=>{ try{ s.json(await Payment.all()); }catch(e){n(e);} };
exports.create = async (q,s,n)=>{ try{ s.status(201).json({id:await Payment.create(q.body)}); }catch(e){n(e);} };
