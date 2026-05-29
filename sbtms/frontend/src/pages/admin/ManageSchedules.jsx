import { useEffect, useState } from 'react';
import api from '../../services/api';
import CrudPage from './_crud';

export default function ManageSchedules() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  useEffect(() => {
    api.get('/buses').then(r=>setBuses(r.data));
    api.get('/routes').then(r=>setRoutes(r.data));
  }, []);
  return (
    <CrudPage
      title="Schedules" endpoint="/schedules"
      columns={[
        { key:'id', label:'ID' },
        { key:'bus_number', label:'Bus' },
        { key:'route', label:'Route', render: r => `${r.origin} → ${r.destination}` },
        { key:'departure_time', label:'Departure', render: r => new Date(r.departure_time).toLocaleString() },
        { key:'arrival_time', label:'Arrival', render: r => new Date(r.arrival_time).toLocaleString() },
        { key:'fare', label:'Fare (RWF )' },
      ]}
      fields={[
        { name:'bus_id', label:'Bus', type:'select', required:true,
          options: buses.map(b=>({value:b.id,label:`${b.bus_number} - ${b.bus_name}`})) },
        { name:'route_id', label:'Route', type:'select', required:true,
          options: routes.map(r=>({value:r.id,label:`${r.origin} → ${r.destination}`})) },
        { name:'departure_time', label:'Departure', type:'datetime-local', required:true },
        { name:'arrival_time', label:'Arrival', type:'datetime-local', required:true },
        { name:'fare', label:'Fare (RWF )', type:'number', required:true },
      ]}
    />
  );
}
