import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage from './pages/landing/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

import UserDashboard from './pages/user/UserDashboard'
import BrowsePage from './pages/user/BrowsePage'
import StaffProfilePage from './pages/user/StaffProfilePage'
import BookingPage from './pages/user/BookingPage'
import MyBookingsPage from './pages/user/MyBookingsPage'
import UserProfilePage from './pages/user/UserProfilePage'

import StaffDashboard from './pages/staff/StaffDashboard'
import StaffBookings from './pages/staff/StaffBookings'
import StaffSchedule from './pages/staff/StaffSchedule'
import StaffServices from './pages/staff/StaffServices'
import StaffProfile from './pages/staff/StaffProfile'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBookings from './pages/admin/AdminBookings'
import AdminStaff from './pages/admin/AdminStaff'
import AdminUsers from './pages/admin/AdminUsers'
import AdminSupport from './pages/admin/AdminSupport'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/staff-profile/:id" element={<StaffProfilePage />} />

            {/* Customer */}
            <Route path="/dashboard" element={<ProtectedRoute role="customer"><UserDashboard /></ProtectedRoute>} />
            <Route path="/book/:id" element={<ProtectedRoute role="customer"><BookingPage /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute role="customer"><MyBookingsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute role="customer"><UserProfilePage /></ProtectedRoute>} />

            {/* Staff */}
            <Route path="/staff" element={<ProtectedRoute role="staff"><StaffDashboard /></ProtectedRoute>} />
            <Route path="/staff/bookings" element={<ProtectedRoute role="staff"><StaffBookings /></ProtectedRoute>} />
            <Route path="/staff/schedule" element={<ProtectedRoute role="staff"><StaffSchedule /></ProtectedRoute>} />
            <Route path="/staff/services" element={<ProtectedRoute role="staff"><StaffServices /></ProtectedRoute>} />
            <Route path="/staff/profile" element={<ProtectedRoute role="staff"><StaffProfile /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute role="admin"><AdminBookings /></ProtectedRoute>} />
            <Route path="/admin/staff" element={<ProtectedRoute role="admin"><AdminStaff /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/support" element={<ProtectedRoute role="admin"><AdminSupport /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
