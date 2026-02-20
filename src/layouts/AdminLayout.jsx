import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  MapPin,
  Shield,
  UserCog,
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const navigation = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Clients', path: '/admin/clients', icon: Users },
    { name: 'Sites', path: '/admin/sites', icon: Building2 },
    { name: 'Site Posts', path: '/admin/site-posts', icon: MapPin },
    { name: 'Guards', path: '/admin/guards', icon: Shield },
    { name: 'Supervisors', path: '/admin/supervisors', icon: UserCog },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3, disabled: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-obsidian via-charcoal to-obsidian">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-obsidian border-r border-cobalt/20 transition-all duration-300 z-50 ${
          sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between p-6 border-b border-cobalt/20">
            <div className="flex items-center gap-3">
              <Shield className="text-cobalt" size={32} />
              <div>
                <h1 className="text-xl font-['Orbitron'] font-bold text-white">SGMS</h1>
                <p className="text-xs text-silver-grey">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isDisabled = item.disabled;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed pointer-events-none'
                      : isActive
                      ? 'bg-cobalt/20 text-cobalt border border-cobalt/50'
                      : 'text-silver-grey hover:bg-cobalt/10 hover:text-cobalt'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-['Rajdhani'] font-medium">{item.name}</span>
                  {isDisabled && (
                    <span className="ml-auto text-xs bg-cobalt/20 px-2 py-0.5 rounded">Soon</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-cobalt/20">
            <div className="mb-3 p-3 bg-charcoal rounded-lg">
              <p className="text-xs text-silver-grey">Logged in as</p>
              <p className="text-sm font-['Orbitron'] text-white truncate">
                {currentUser?.fullName || currentUser?.email || 'Admin'}
              </p>
              <p className="text-xs text-cobalt mt-1">{currentUser?.role || 'ADMIN'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
            >
              <LogOut size={18} />
              <span className="font-['Rajdhani'] font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-obsidian/95 backdrop-blur-sm border-b border-cobalt/20">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-silver-grey hover:text-cobalt hover:bg-cobalt/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-['Orbitron'] text-white">
                  {currentUser?.fullName || 'Admin User'}
                </p>
                <p className="text-xs text-silver-grey">{currentUser?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cobalt to-blue-600 flex items-center justify-center">
                <span className="text-white font-['Orbitron'] font-bold">
                  {currentUser?.fullName?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
