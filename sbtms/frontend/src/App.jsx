import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ManagerLayout from './layouts/ManagerLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Buses from './pages/Buses';
import Booking from './pages/Booking';
import Ticket from './pages/Ticket';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBuses from './pages/admin/ManageBuses';
import ManageDrivers from './pages/admin/ManageDrivers';
import ManageRoutes from './pages/admin/ManageRoutes';
import ManageSchedules from './pages/admin/ManageSchedules';
import ManageBookings from './pages/admin/ManageBookings';
import Reports from './pages/admin/Reports';

import ManagerLogin from './pages/manager/ManagerLogin';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerRoutes from './pages/manager/ManagerRoutes';
import ManagerPayments from './pages/manager/ManagerPayments';
import ManagerSchedules from './pages/manager/ManagerSchedules';
import ManagerBookings from './pages/manager/ManagerBookings';
import ManagerReports from './pages/manager/ManagerReports';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/buses" element={<Buses />} />
        <Route path="/dashboard" element={<ProtectedRoute role="passenger"><Dashboard /></ProtectedRoute>} />
        <Route path="/book/:scheduleId" element={<ProtectedRoute role="passenger"><Booking /></ProtectedRoute>} />
        <Route path="/ticket/:bookingId" element={<ProtectedRoute role="passenger"><Ticket /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute role="passenger"><MyBookings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute role="passenger"><Profile /></ProtectedRoute>} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="buses" element={<ManageBuses />} />
        <Route path="drivers" element={<ManageDrivers />} />
        <Route path="routes" element={<ManageRoutes />} />
        <Route path="schedules" element={<ManageSchedules />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route path="/manager/login" element={<ManagerLogin />} />
      <Route path="/manager" element={<ProtectedRoute role="admin, manager"><ManagerLayout /></ProtectedRoute>}>
        <Route index element={<ManagerDashboard />} />
        <Route path="routes" element={<ManagerRoutes />} />
        <Route path="payments" element={<ManagerPayments />} />
        <Route path="schedules" element={<ManagerSchedules />} />
        <Route path="bookings" element={<ManagerBookings />} />
        <Route path="reports" element={<ManagerReports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
