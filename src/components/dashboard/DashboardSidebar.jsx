import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Shield,
  Users,
  MapPin,
  ClipboardList,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const DashboardSidebar = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/portal/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/portal/admin/guards', icon: Shield, label: 'Guards' },
    { path: '/portal/admin/clients', icon: Building2, label: 'Clients' },
    { path: '/portal/admin/sites', icon: MapPin, label: 'Sites' },
    { path: '/portal/admin/attendance', icon: ClipboardList, label: 'Attendance' },
    { path: '/portal/admin/reports', icon: BarChart3, label: 'Reports' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-obsidian/95 backdrop-blur-lg border-b border-cobalt/30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Shield className="text-cobalt" size={24} />
            <span className="text-white font-['Orbitron'] text-lg">SGMS</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-cobalt hover:text-blue-400 transition-colors p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? '280px' : '80px',
        }}
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-obsidian via-obsidian to-black border-r border-cobalt/30 z-40 hidden lg:block transition-all duration-300`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8 mt-4">
            <motion.div
              initial={false}
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              className="flex items-center space-x-3"
            >
              <Shield className="text-cobalt" size={32} />
              {sidebarOpen && (
                <span className="text-white font-['Orbitron'] text-xl">SGMS</span>
              )}
            </motion.div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-cobalt hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-cobalt/10"
            >
              <motion.div
                animate={{ rotate: sidebarOpen ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeft size={20} />
              </motion.div>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive(item.path)
                    ? 'bg-cobalt/20 text-cobalt border border-cobalt/50'
                    : 'text-silver-grey hover:text-white hover:bg-cobalt/10'
                }`}
              >
                <item.icon
                  size={22}
                  className={isActive(item.path) ? 'text-cobalt' : 'text-silver-grey group-hover:text-cobalt'}
                />
                {sidebarOpen && (
                  <span className="font-['Orbitron'] text-sm">{item.label}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-cobalt/30 pt-4 mt-4">
            {sidebarOpen && currentUser && (
              <div className="mb-3 px-2">
                <p className="text-white font-['Orbitron'] text-sm truncate">
                  {currentUser.fullName || currentUser.email}
                </p>
                <p className="text-cobalt text-xs uppercase">{currentUser.role}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all w-full group"
            >
              <LogOut size={22} className="group-hover:text-red-300" />
              {sidebarOpen && (
                <span className="font-['Orbitron'] text-sm">Logout</span>
              )}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-obsidian via-obsidian to-black border-r border-cobalt/30 z-50 overflow-y-auto"
          >
            <div className="flex flex-col h-full p-4">
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-8 mt-4">
                <Shield className="text-cobalt" size={32} />
                <span className="text-white font-['Orbitron'] text-xl">SGMS</span>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-cobalt/20 text-cobalt border border-cobalt/50'
                        : 'text-silver-grey hover:text-white hover:bg-cobalt/10'
                    }`}
                  >
                    <item.icon size={22} />
                    <span className="font-['Orbitron'] text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* User Info & Logout */}
              <div className="border-t border-cobalt/30 pt-4 mt-4">
                {currentUser && (
                  <div className="mb-3 px-2">
                    <p className="text-white font-['Orbitron'] text-sm">
                      {currentUser.fullName || currentUser.email}
                    </p>
                    <p className="text-cobalt text-xs uppercase">{currentUser.role}</p>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all w-full"
                >
                  <LogOut size={22} />
                  <span className="font-['Orbitron'] text-sm">Logout</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{
          marginLeft: sidebarOpen ? '280px' : '80px',
        }}
        className="lg:ml-[280px] ml-0 mt-16 lg:mt-0 min-h-screen transition-all duration-300"
      >
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardSidebar;
