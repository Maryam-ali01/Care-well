import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import AppointmentDetails from './pages/AppointmentDetails.jsx';
import PatientDashboard from './pages/patient/PatientDashboard.jsx';
import BrowseDoctors from './pages/patient/BrowseDoctors.jsx';
import DoctorDetails from './pages/patient/DoctorDetails.jsx';
import BookAppointment from './pages/patient/BookAppointment.jsx';
import MyAppointments from './pages/patient/MyAppointments.jsx';
import DoctorDashboard from './pages/doctor/DoctorDashboard.jsx';
import AppointmentRequests from './pages/doctor/AppointmentRequests.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';
import AddDoctor from './pages/admin/AddDoctor.jsx';
import AllAppointments from './pages/admin/AllAppointments.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute roles={['patient']} />}>
        <Route path="/patient" element={<DashboardLayout />}>
          <Route index element={<PatientDashboard />} />
          <Route path="doctors" element={<BrowseDoctors />} />
          <Route path="doctors/:id" element={<DoctorDetails />} />
          <Route path="book" element={<BookAppointment />} />
          <Route path="appointments" element={<MyAppointments />} />
          <Route path="appointments/:id" element={<AppointmentDetails />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['doctor']} />}>
        <Route path="/doctor" element={<DashboardLayout />}>
          <Route index element={<DoctorDashboard />} />
          <Route path="requests" element={<AppointmentRequests />} />
          <Route path="appointments/:id" element={<AppointmentDetails />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="doctors/new" element={<AddDoctor />} />
          <Route path="appointments" element={<AllAppointments />} />
          <Route path="appointments/:id" element={<AppointmentDetails />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
