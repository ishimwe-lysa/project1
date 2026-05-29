const Route = require('../models/Route');
exports.list   = async (q,s,n)=>{ try{ s.json(await Route.all()); }catch(e){n(e);} };
exports.get    = async (q,s,n)=>{ try{ s.json(await Route.find(q.params.id)); }catch(e){n(e);} };
exports.create = async (q,s,n)=>{ try{ s.status(201).json({id:await Route.create(q.body)}); }catch(e){n(e);} };
exports.update = async (q,s,n)=>{ try{ await Route.update(q.params.id,q.body); s.json({ok:true}); }catch(e){n(e);} };
exports.remove = async (q,s,n)=>{ try{ await Route.remove(q.params.id); s.json({ok:true}); }catch(e){n(e);} };
