import { useEffect, useState } from 'react';
import { Card, Grid, Heading, Text, Button, Badge, Spinner } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

export default function ManagerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/manager/dashboard');
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner className="mx-auto" />;
  if (error) return <Text color="red" center>{error}</Text>;

  const { counts, today, topRoutes, revenueTrend, busUtilization } = stats;

  return (
    <div className="space-y-6">
      <Heading size="lg" className="mb-4">
        Manager Dashboard
      </Heading>

      {/* Stats Cards */}
      <Grid columns={4} gap={4}>
        <Card>
          <Heading size="sm" className="mb-2">Total Users</Heading>
          <Heading size="3xl">{counts.users}</Heading>
          <Text size="xs" color="slate-500">Passengers registered</Text>
        </Card>
        <Card>
          <Heading size="sm" className="mb-2">Total Buses</Heading>
          <Heading size="3xl">{counts.buses}</Heading>
          <Text size="xs" color="slate-500">Active fleet</Text>
        </Card>
        <Card>
          <Heading size="sm" className="mb-2">Total Routes</Heading>
          <Heading size="3xl">{counts.routes}</Heading>
          <Text size="xs" color="slate-500">Available routes</Text>
        </Card>
        <Card>
          <Heading size="sm" className="mb-2">Active Schedules</Heading>
          <Heading size="3xl">{counts.schedules}</Heading>
          <Text size="xs" color="slate-500">Trips planned</Text>
        </Card>
      </Grid>

      {/* Today's Stats */}
      <Grid columns={2} gap={4}>
        <Card>
          <Heading size="sm" className="mb-2">Today's Bookings</Heading>
          <Heading size="2xl">{today.bookings}</Heading>
          <Text size="xs" color="slate-500">Bookings made today</Text>
        </Card>
        <Card>
          <Heading size="sm" className="mb-2">Today's Revenue</Heading>
          <Heading size="2xl">RWF {today.revenue.toLocaleString()}</Heading>
          <Text size="xs" color="slate-500">Revenue collected today</Text>
        </Card>
      </Grid>

      {/* Schedule Status */}
      <Card>
        <Heading size="sm" className="mb-2">Schedule Status</Heading>
        <Grid columns={3} gap={4}>
          <Card textAlign="center">
            <Text size="sm" color="slate-500">Pending</Text>
            <Heading size="xl">{counts.pendingSchedules}</Heading>
          </Card>
          <Card textAlign="center">
            <Text size="sm" color="slate-500">Approved</Text>
            <Heading size="xl">{counts.approvedSchedules}</Heading>
          </Card>
          <Card textAlign="center">
            <Text size="sm" color="slate-500">Rejected</Text>
            <Heading size="xl">{counts.rejectedSchedules}</Heading>
          </Card>
        </Grid>
      </Card>

      {/* Revenue Trend Chart */}
      <Card>
        <Heading size="sm" className="mb-2">Revenue Trend (Last 7 Days)</Heading>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={revenueTrend}>
            <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={30} />
            <Bar dataKey="daily_revenue" fill="#4f46e5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Routes */}
      <Card>
        <Heading size="sm" className="mb-2">Top Routes (Last 30 Days)</Heading>
        {topRoutes.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 text-xs font-medium text-slate-500 uppercase">Route</th>
                <th className="px-4 py-2 text-xs font-medium text-slate-500">Bookings</th>
              </tr>
            </thead>
            <tbody>
              {topRoutes.map((route, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-3">{route.origin} → {route.destination}</td>
                  <td className="px-4 py-3">{route.bookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Text color="slate-500" center>No data available</Text>
        )}
      </Card>

      {/* Bus Utilization */}
      <Card>
        <Heading size="sm" className="mb-2">Bus Utilization (Avg Occupancy)</Heading>
        {busUtilization.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 text-xs font-medium text-slate-500 uppercase">Bus</th>
                <th className="px-4 py-2 text-xs font-medium text-slate-500">Occupancy %</th>
              </tr>
            </thead>
            <tbody>
              {busUtilization.map((bus, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-3">{bus.bus_number} - {bus.bus_name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-16 bg-slate-200 rounded-full h-2.5">
                        <div className={`bg-brand-600 h-2.5 rounded-full` style={{ width: `${Math.min(bus.avg_occupancy_percent, 100)}%` }}></div>
                      </div>
                      <Text size="xs" className="ml-2">{bus.avg_occupancy_percent.toFixed(1)}%</Text>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Text color="slate-500" center>No data available</Text>
        )}
      </Card>
    </div>
  );
}