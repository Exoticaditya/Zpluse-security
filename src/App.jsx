import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MatrixBackground from './components/MatrixBackground';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import SecurityPortal from './pages/SecurityPortal';
import Careers from './pages/Careers';
import About from './pages/About';
import Contact from './pages/Contact';
import CyberTools from './pages/CyberTools';

// Auth Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';

// Portal Dashboards
import ClientDashboard from './pages/portals/ClientDashboard';
import WorkerDashboard from './pages/portals/WorkerDashboard';
import ManagerDashboard from './pages/portals/ManagerDashboard';
import AdminDashboard from './pages/portals/AdminDashboard';

// Admin Management Pages
import GuardsPage from './pages/guards/GuardsPage';
import ClientsPage from './pages/clients/ClientsPage';
import SitesPage from './pages/sites/SitesPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen bg-obsidian">
          <MatrixBackground />
          <Navbar />
          <main className="relative z-10 pt-20">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/portal" element={<SecurityPortal />} />
              <Route path="/tools" element={<CyberTools />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/profile" element={<Profile />} />

              {/* Protected Portal Routes */}
              <Route
                path="/portal/client"
                element={
                  <ProtectedRoute allowedRoles={['CLIENT']}>
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/worker"
                element={
                  <ProtectedRoute allowedRoles={['GUARD']}>
                    <WorkerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/manager"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <ManagerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin Management Routes */}
              <Route
                path="/portal/admin/guards"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <GuardsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/admin/clients"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ClientsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/admin/sites"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SitesPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
