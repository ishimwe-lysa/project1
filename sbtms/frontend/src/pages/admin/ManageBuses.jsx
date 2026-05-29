import { useEffect, useState } from 'react';
import api from '../../services/api';
import CrudPage from './_crud';

export default function ManageBuses() {
  const [drivers, setDrivers] = useState([]);
  useEffect(() => { api.get('/drivers').then(r=>setDrivers(r.data)).catch(()=>{}); }, []);
  return (
    <CrudPage
      title="Buses" endpoint="/buses"
      columns={[
        { key:'bus_number', label:'Number' },
        { key:'bus_name', label:'Name' },
        { key:'bus_type', label:'Type' },
        { key:'total_seats', label:'Seats' },
        { key:'driver_name', label:'Driver' },
      ]}
      fields={[
        { name:'bus_number', label:'Bus Number', required:true },
        { name:'bus_name', label:'Bus Name', required:true },
        { name:'bus_type', label:'Type', type:'select', options:[
            {value:'AC',label:'AC'},{value:'Non-AC',label:'Non-AC'},
            {value:'Sleeper',label:'Sleeper'},{value:'Seater',label:'Seater'}] },
        { name:'total_seats', label:'Total Seats', type:'number', required:true, default:40 },
        { name:'driver_id', label:'Driver', type:'select',
          options: drivers.map(d=>({value:d.id,label:`${d.name} (${d.license_no})`})) },
      ]}
    />
  );
}
