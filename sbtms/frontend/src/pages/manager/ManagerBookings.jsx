import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, Heading, Text, Table, Tbody, Td, Th, Thead, Tr, Spinner } from '../components/ui';

export default function ManagerBookings() {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        setBookings(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return (
    <div className="flex min-h-[20vh] items-center justify-center">
      <Spinner className="mx-auto" />
    </div>
  );
  if (error) return <Text color="red" center>{error}</Text>;

  return (
    <div className="space-y-6">
      <Heading size="lg" className="mb-4">Bookings Monitoring</Heading>
      
      <Card>
        {bookings.length === 0 ? (
          <Text color="slate-500" center>No bookings found.</Text>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th className="text-left px-4 py-2">ID</Th>
                <Th className="text-left px-4 py-2">User</Th>
                <Th className="text-left px-4 py-2">Schedule</Th>
                <Th className="text-left px-4 py-2">Seat</Th>
                <Th className="text-left px-4 py-2">Status</Th>
                <Th className="text-left px-4 py-2">Amount (RWF)</Th>
                <Th className="text-left px-4 py-2">Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bookings.map((b, idx) => (
                <Tr key={idx} className="border-t hover:bg-slate-50 transition">
                  <Td className="px-4 py-3">{b.id}</Td>
                  <Td className="px-4 py-3">#{b.user_id}</Td>
                  <Td className="px-4 py-3">#{b.schedule_id}</Td>
                  <Td className="px-4 py-3">{b.seat_number}</Td>
                  <Td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${b.status === 'booked' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {b.status}
                    </span>
                  </Td>
                  <Td className="px-4 py-3 font-medium">{Number(b.total_amount).toLocaleString()}</Td>
                  <Td className="px-4 py-3 text-sm">{new Date(b.created_at).toLocaleString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}