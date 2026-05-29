import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, Heading, Text, Table, Tbody, Td, Th, Thead, Tr, Spinner } from '../components/ui';

export default function ManagerPayments() {
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/payments');
        setPayments(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return (
    <div className="flex min-h-[20vh] items-center justify-center">
      <Spinner className="mx-auto" />
    </div>
  );
  if (error) return <Text color="red" center>{error}</Text>;

  return (
    <div className="space-y-6">
      <Heading size="lg" className="mb-4">Payments Management</Heading>
      
      <Card>
        {payments.length === 0 ? (
          <Text color="slate-500" center>No payments found.</Text>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th className="text-left px-4 py-2">ID</Th>
                <Th className="text-left px-4 py-2">Booking</Th>
                <Th className="text-left px-4 py-2">Amount (RWF)</Th>
                <Th className="text-left px-4 py-2">Method</Th>
                <Th className="text-left px-4 py-2">Status</Th>
                <Th className="text-left px-4 py-2">Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payments.map((p, idx) => (
                <Tr key={idx} className="border-t hover:bg-slate-50 transition">
                  <Td className="px-4 py-3">{p.id}</Td>
                  <Td className="px-4 py-3">#{p.booking_id}</Td>
                  <Td className="px-4 py-3 font-medium">{Number(p.amount).toLocaleString()}</Td>
                  <Td className="px-4 py-3">{p.method}</Td>
                  <Td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${p.status === 'paid' ? 'bg-green-100 text-green-800' : p.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {p.status}
                    </span>
                  </Td>
                  <Td className="px-4 py-3 text-sm">{new Date(p.created_at).toLocaleString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}