import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userRole, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Security Portal', path: '/portal' },
    { name: 'Cyber Tools', path: '/tools' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Careers', path: '/careers' },
  ];

  const isActive = (path) => location.pathname === path;

  const getRoleDashboard = () => {
    const dashboards = {
      client: '/portal/client',
      worker: '/portal/worker',
      manager: '/portal/manager',
      admin: '/portal/admin'
    };
    return dashboards[userRole] || '/';
  };

  const getRoleLabel = () => {
    const labels = {
      client: 'Client',
      worker: 'Guard',
      manager: 'Manager',
      admin: 'Admin'
    };
    return labels[userRole] || 'User';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-cobalt/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/portal" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="text-cobalt"
            >
              <Shield size={32} />
            </motion.div>
            <div>
              <h1 className="text-2xl font-['Orbitron'] font-bold text-white">
                ZPLUSE
              </h1>
              <p className="text-xs text-cobalt">SECURITY SERVICES</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative group"
              >
                <span
                  className={`font-['Orbitron'] font-medium transition-colors ${isActive(link.path) ? 'text-cobalt' : 'text-silver-grey hover:text-white'
                    }`}
                >
                  {link.name}
                </span>
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cobalt"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Auth Section */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 glass px-4 py-2 rounded-lg hover:border-cobalt/50 transition-colors border border-white/10"
                >
                  <User size={20} className="text-cobalt" />
                  <span className="text-white font-['Orbitron'] text-sm">
                    {getRoleLabel()}
                  </span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 glass border border-cobalt/30 rounded-lg overflow-hidden"
                    >
                      <Link
                        to={getRoleDashboard()}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-3 text-white hover:bg-cobalt/20 transition-colors"
                      >
                        <LayoutDashboard size={18} className="mr-2 text-cobalt" />
                        <span className="font-['Orbitron'] text-sm">Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-white hover:bg-red-500/20 transition-colors border-t border-white/10"
                      >
                        <LogOut size={18} className="mr-2 text-red-400" />
                        <span className="font-['Orbitron'] text-sm">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="glass px-6 py-2 rounded-lg border border-cobalt/50 text-cobalt font-['Orbitron'] hover:bg-cobalt/20 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-cobalt"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block py-3 px-4 rounded-lg font-['Orbitron'] transition-colors ${isActive(link.path)
                        ? 'bg-cobalt/20 text-cobalt'
                        : 'text-silver-grey hover:bg-white/5'
                      }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Auth Section */}
              {currentUser ? (
                <>
                  <Link
                    to={getRoleDashboard()}
                    onClick={() => setIsOpen(false)}
                    className="block py-3 px-4 rounded-lg font-['Orbitron'] text-cobalt hover:bg-cobalt/20 transition-colors mt-2"
                  >
                    <LayoutDashboard size={18} className="inline mr-2" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left py-3 px-4 rounded-lg font-['Orbitron'] text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <LogOut size={18} className="inline mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block py-3 px-4 rounded-lg font-['Orbitron'] text-cobalt hover:bg-cobalt/20 transition-colors mt-2"
                >
                  Login
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
