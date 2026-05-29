import CrudPage from './_crud';
export default function ManageRoutes() {
  return (
    <CrudPage
      title="Routes" endpoint="/routes"
      columns={[
        { key:'origin', label:'Origin' },
        { key:'destination', label:'Destination' },
        { key:'distance_km', label:'Distance (km)' },
        { key:'duration_hours', label:'Duration (hrs)' },
      ]}
      fields={[
        { name:'origin', label:'Origin', required:true },
        { name:'destination', label:'Destination', required:true },
        { name:'distance_km', label:'Distance (km)', type:'number' },
        { name:'duration_hours', label:'Duration (hours)', type:'number' },
      ]}
    />
  );
}
