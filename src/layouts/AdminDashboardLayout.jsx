import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Shield,
  MapPin,
  Building2,
  ClipboardList,
  Locate,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard/admin',
    },
    {
      id: 'guards',
      label: 'Guards Management',
      icon: Shield,
      path: '/dashboard/admin/guards',
    },
    {
      id: 'sites',
      label: 'Sites Management',
      icon: MapPin,
      path: '/dashboard/admin/sites',
    },
    {
      id: 'clients',
      label: 'Clients Management',
      icon: Building2,
      path: '/dashboard/admin/clients',
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: ClipboardList,
      path: '/dashboard/admin/assignments',
    },
    {
      id: 'site-posts',
      label: 'Site Posts',
      icon: Locate,
      path: '/dashboard/admin/site-posts',
    },
  ];

  const isActive = (path) => {
    if (path === '/dashboard/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/portal');
  };

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-cobalt/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
              <Shield className="text-white" size={24} />
            </div>
            {(sidebarOpen || mobile) && (
              <div>
                <h2 className="text-lg font-['Orbitron'] font-bold text-white">
                  ADMIN
                </h2>
                <p className="text-xs text-cobalt">Control Panel</p>
              </div>
            )}
          </div>
          {mobile && (
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors md:hidden"
            >
              <X className="text-silver-grey" size={20} />
            </button>
          )}
        </div>
      </div>

      {/* User Info */}
      {(sidebarOpen || mobile) && (
        <div className="p-4 border-b border-cobalt/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cobalt to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-['Orbitron'] font-bold">
                {currentUser?.fullName?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {currentUser?.fullName || 'Admin User'}
              </p>
              <p className="text-cobalt text-xs truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={mobile ? () => setMobileSidebarOpen(false) : undefined}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-all duration-200 group
                  ${active
                    ? 'bg-gradient-to-r from-cobalt/20 to-blue-500/20 text-cobalt border border-cobalt/50'
                    : 'text-silver-grey hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon
                  size={20}
                  className={active ? 'text-cobalt' : 'text-silver-grey group-hover:text-white'}
                />
                {(sidebarOpen || mobile) && (
                  <span className="font-['Orbitron'] font-medium">
                    {item.label}
                  </span>
                )}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1 h-6 bg-cobalt rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-cobalt/30">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center space-x-3 px-4 py-3 rounded-lg
            text-red-400 hover:bg-red-500/10 border border-red-500/30
            transition-all duration-200 group
          `}
        >
          <LogOut size={20} className="text-red-400" />
          {(sidebarOpen || mobile) && (
            <span className="font-['Orbitron'] font-medium">
              Logout
            </span>
          )}
        </button>
      </div>

      {/* Desktop Toggle */}
      {!mobile && (
        <div className="p-4 border-t border-cobalt/30 hidden md:block">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="text-silver-grey" size={20} />
            ) : (
              <ChevronRight className="text-silver-grey" size={20} />
            )}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-obsidian via-gray-900 to-obsidian flex">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="hidden md:flex flex-col bg-black/40 backdrop-blur-md border-r border-cobalt/30 transition-all duration-300"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-black/95 backdrop-blur-md border-r border-cobalt/30 z-50 md:hidden"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-black/40 backdrop-blur-md border-b border-cobalt/30 p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="text-white" size={24} />
          </button>
          <h1 className="text-lg font font-['Orbitron'] font-bold text-white">
            Admin Panel
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
