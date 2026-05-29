const Bus = require('../models/Bus');
exports.list   = async (q,s,n)=>{ try{ s.json(await Bus.all()); }catch(e){n(e);} };
exports.get    = async (q,s,n)=>{ try{ s.json(await Bus.find(q.params.id)); }catch(e){n(e);} };
exports.create = async (q,s,n)=>{ try{ s.status(201).json({id:await Bus.create(q.body)}); }catch(e){n(e);} };
exports.update = async (q,s,n)=>{ try{ await Bus.update(q.params.id,q.body); s.json({ok:true}); }catch(e){n(e);} };
exports.remove = async (q,s,n)=>{ try{ await Bus.remove(q.params.id); s.json({ok:true}); }catch(e){n(e);} };
