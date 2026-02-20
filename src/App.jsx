import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import WhatsAppButton from './components/WhatsAppButton';

// Layouts
import AdminDashboardLayout from './layouts/AdminDashboardLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import CyberTools from './pages/CyberTools';

// Role Selection Portal
import RoleSelectionPortal from './pages/RoleSelectionPortal';

// Auth Pages - Role-specific logins and signup
import { AdminLogin, ManagerLogin, ClientLogin, GuardLogin } from './components/auth/RoleLogin';
import Register from './components/auth/Register';

// Dashboards
import GuardDashboardMobile from './pages/dashboards/GuardDashboardMobile';
import ClientDashboard from './pages/portals/ClientDashboard';
import ManagerDashboard from './pages/portals/ManagerDashboard';

// Admin Pages
import AdminDashboardHome from './pages/dashboards/admin/AdminDashboardHome';
import GuardsPage from './pages/guards/GuardsPage';
import SitesPage from './pages/sites/SitesPage';
import ClientsPage from './pages/clients/ClientsPage';
import AssignmentsPage from './pages/assignments/AssignmentsPage';
import SitePostsPage from './pages/siteposts/SitePostsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <WhatsAppButton />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/tools" element={<CyberTools />} />

          {/* Role Selection Portal */}
          <Route path="/portal" element={<RoleSelectionPortal />} />

          {/* Signup Route */}
          <Route path="/signup" element={<Register />} />
          <Route path="/register" element={<Register />} />

          {/* Role-Specific Login Pages */}
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/login/manager" element={<ManagerLogin />} />
          <Route path="/login/client" element={<ClientLogin />} />
          <Route path="/login/guard" element={<GuardLogin />} />

          {/* Legacy login redirect */}
          <Route path="/login" element={<Navigate to="/portal" replace />} />

          {/* Guard Dashboard - Mobile First */}
          <Route
            path="/dashboard/guard"
            element={
              <ProtectedRoute allowedRoles={['GUARD']}>
                <GuardDashboardMobile />
              </ProtectedRoute>
            }
          />

          {/* Client Dashboard */}
          <Route
            path="/dashboard/client"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Manager/Supervisor Dashboard */}
          <Route
            path="/dashboard/manager"
            element={
              <ProtectedRoute allowedRoles={['SUPERVISOR']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard with Sidebar Layout */}
          <Route
            path="/dashboard/admin/*"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardHome />} />
            <Route path="guards" element={<GuardsPage />} />
            <Route path="sites" element={<SitesPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="site-posts" element={<SitePostsPage />} />
          </Route>

          {/* Legacy routes - redirect to new structure */}
          <Route path="/portal/client" element={<Navigate to="/dashboard/client" replace />} />
          <Route path="/portal/worker" element={<Navigate to="/dashboard/guard" replace />} />
          <Route path="/portal/guard" element={<Navigate to="/dashboard/guard" replace />} />
          <Route path="/portal/supervisor" element={<Navigate to="/dashboard/manager" replace />} />
          <Route path="/portal/manager" element={<Navigate to="/dashboard/manager" replace />} />
          <Route path="/admin/*" element={<Navigate to="/dashboard/admin" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
