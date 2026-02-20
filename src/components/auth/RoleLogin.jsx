import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, AlertCircle, Loader, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const RoleLogin = ({ role, title, description, icon: Icon, gradient }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleConfig = {
    admin: {
      title: 'Admin Portal',
      description: 'System Administration Access',
      icon: Shield,
      gradient: 'from-red-500 to-orange-500',
      expectedRole: 'ADMIN',
      redirectRoute: '/dashboard/admin',
    },
    manager: {
      title: 'Manager Portal',
      description: 'Supervisor & Operations Management',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-500',
      expectedRole: 'SUPERVISOR',
      redirectRoute: '/dashboard/manager',
    },
    client: {
      title: 'Client Portal',
      description: 'Security Services Portal',
      icon: Shield,
      gradient: 'from-purple-500 to-pink-500',
      expectedRole: 'CLIENT',
      redirectRoute: '/dashboard/client',
    },
    guard: {
      title: 'Guard Portal',
      description: 'Field Operations & Attendance',
      icon: Shield,
      gradient: 'from-green-500 to-emerald-500',
      expectedRole: 'GUARD',
      redirectRoute: '/dashboard/guard',
    },
  };

  const config = roleConfig[role] || roleConfig.client;
  const RoleIcon = config.icon;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      
      // Check if user has the correct role
      if (user.role !== config.expectedRole) {
        setError(`This account does not belong to the ${config.title}. Please use the correct portal.`);
        setLoading(false);
        return;
      }

      // Redirect to role-specific dashboard
      navigate(config.redirectRoute, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-obsidian via-gray-900 to-obsidian flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <Link
          to="/portal"
          className="inline-flex items-center text-silver-grey hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Portal Selection
        </Link>

        {/* Login Card */}
        <div className="bg-black/40 backdrop-blur-md border-2 border-cobalt/30 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-block mb-4"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <div className={`p-4 rounded-full bg-gradient-to-br ${config.gradient} shadow-lg`}>
                <RoleIcon className="text-white" size={40} />
              </div>
            </motion.div>
            <h1 className="text-3xl font-['Orbitron'] font-bold text-white mb-2">
              {config.title}
            </h1>
            <p className="text-silver-grey">
              {config.description}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start"
            >
              <AlertCircle className="text-red-500 flex-shrink-0 mr-3 mt-0.5" size={20} />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-['Orbitron'] text-silver-grey mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver-grey" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-black/50 border border-cobalt/30 rounded-lg text-white placeholder-silver-grey focus:outline-none focus:border-cobalt transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-['Orbitron'] text-silver-grey mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver-grey" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-black/50 border border-cobalt/30 rounded-lg text-white placeholder-silver-grey focus:outline-none focus:border-cobalt transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full py-3 px-4 bg-gradient-to-r ${config.gradient} text-white font-['Orbitron'] font-bold rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'
              }`}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2" size={20} />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-silver-grey text-sm">
              Need help? Contact your administrator
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-cobalt/10 border border-cobalt/30 rounded-lg">
          <p className="text-cobalt text-xs text-center">
            🔒 All communications are encrypted and secure
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// Export individual login components
export const AdminLogin = () => <RoleLogin role="admin" />;
export const ManagerLogin = () => <RoleLogin role="manager" />;
export const ClientLogin = () => <RoleLogin role="client" />;
export const GuardLogin = () => <RoleLogin role="guard" />;

export default RoleLogin;
