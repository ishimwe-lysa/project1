import CrudPage from './_crud';
export default function ManageDrivers() {
  return (
    <CrudPage
      title="Drivers" endpoint="/drivers"
      columns={[
        { key:'name', label:'Name' },
        { key:'license_no', label:'License' },
        { key:'phone', label:'Phone' },
        { key:'experience_years', label:'Experience (yrs)' },
      ]}
      fields={[
        { name:'name', label:'Full Name', required:true },
        { name:'license_no', label:'License No.', required:true },
        { name:'phone', label:'Phone' },
        { name:'experience_years', label:'Experience (years)', type:'number', default:0 },
      ]}
    />
  );
}
