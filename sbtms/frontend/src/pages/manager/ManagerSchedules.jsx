import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, Heading, Text, Table, Tbody, Td, Th, Thead, Tr, Spinner, Button } from '../components/ui';

export default function ManagerSchedules() {
  const [schedules, setSchedules] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(new Set());

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await api.get('/schedules');
        setSchedules(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load schedules');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  const handleStatusChange = async (scheduleId, newStatus) => {
    if (updating.has(scheduleId)) return;
    setUpdating(prev => new Set([...prev, scheduleId]));
    try {
      await api.put(`/manager/schedules/${scheduleId}/status`, { status: newStatus });
      // Update local state
      setSchedules(prev => 
        prev?.map(s => 
          s.id === scheduleId ? { ...s, status: newStatus } : s
        ) || []
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(prev => new Set([...prev].filter(id => id !== scheduleId)));
    }
  };

  if (loading) return (
    <div className="flex min-h-[20vh] items-center justify-center">
      <Spinner className="mx-auto" />
    </div>
  );
  if (error) return <Text color="red" center>{error}</Text>;

  return (
    <div className="space-y-6">
      <Heading size="lg" className="mb-4">Schedules Management</Heading>
      
      <Card>
        {schedules.length === 0 ? (
          <Text color="slate-500" center>No schedules found.</Text>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th className="text-left px-4 py-2">ID</Th>
                <Th className="text-left px-4 py-2">Bus</Th>
                <Th className="text-left px-4 py-2">Route</Th>
                <Th className="text-left px-4 py-2">Departure</Th>
                <Th className="text-left px-4 py-2">Arrival</Th>
                <Th className="text-left px-4 py-2">Fare (RWF)</Th>
                <Th className="text-left px-4 py-2">Status</Th>
                <Th className="text-left px-4 py-2">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {schedules.map((s, idx) => (
                <Tr key={idx} className="border-t hover:bg-slate-50 transition">
                  <Td className="px-4 py-3">{s.id}</Td>
                  <Td className="px-4 py-3">{s.bus_number} ({s.bus_name})</Td>
                  <Td className="px-4 py-3">{s.origin} → {s.destination}</Td>
                  <Td className="px-4 py-3">{new Date(s.departure_time).toLocaleString()}</Td>
                  <Td className="px-4 py-3">{new Date(s.arrival_time).toLocaleString()}</Td>
                  <Td className="px-4 py-3 font-medium">{Number(s.fare).toLocaleString()}</Td>
                  <Td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${s.status === 'approved' ? 'bg-green-100 text-green-800' : s.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {s.status}
                    </span>
                  </Td>
                  <Td className="px-4 py-3 space-x-2">
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusChange(s.id, e.target.value)}
                      disabled={updating.has(s.id)}
                      className="input input-sm border rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    {updating.has(s.id) && (
                      <Spinner className="h-4 w-4" />
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}