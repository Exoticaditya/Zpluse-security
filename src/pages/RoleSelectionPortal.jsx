import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  UserCog,
  Building2,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RoleSelectionPortal = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'admin',
      title: 'ADMIN',
      description: 'System Administration & Management',
      icon: Shield,
      route: '/login/admin',
      gradient: 'from-red-500 to-orange-500',
      borderColor: 'border-red-500/50',
      hoverColor: 'hover:border-red-500',
    },
    {
      id: 'manager',
      title: 'SUPERVISOR / MANAGER',
      description: 'Operations & Team Management',
      icon: UserCog,
      route: '/login/manager',
      gradient: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500/50',
      hoverColor: 'hover:border-blue-500',
    },
    {
      id: 'client',
      title: 'CLIENT',
      description: 'Security Services & Reports',
      icon: Building2,
      route: '/login/client',
      gradient: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500/50',
      hoverColor: 'hover:border-purple-500',
    },
    {
      id: 'guard',
      title: 'GUARD / WORKER',
      description: 'Field Operations & Attendance',
      icon: Users,
      route: '/login/guard',
      gradient: 'from-green-500 to-emerald-500',
      borderColor: 'border-green-500/50',
      hoverColor: 'hover:border-green-500',
    },
  ];

  const handleRoleSelect = (route) => {
    navigate(route);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-obsidian via-gray-900 to-obsidian flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Shield className="text-cobalt" size={64} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Orbitron'] font-bold text-white mb-4">
            ZPLUSE SECURITY
          </h1>
          <p className="text-xl md:text-2xl text-cobalt font-['Orbitron'] mb-2">
            MANAGEMENT SYSTEM
          </p>
          <p className="text-silver-grey text-lg">
            Select your role to continue
          </p>
        </motion.div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  onClick={() => handleRoleSelect(role.route)}
                  className={`
                    relative overflow-hidden rounded-2xl p-8 md:p-10
                    bg-black/40 backdrop-blur-md
                    border-2 ${role.borderColor} ${role.hoverColor}
                    transition-all duration-300 cursor-pointer
                    group min-h-[280px] md:min-h-[320px] flex flex-col
                  `}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center flex-1">
                    {/* Icon */}
                    <motion.div
                      className="mb-6"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className={`p-6 rounded-full bg-gradient-to-br ${role.gradient} shadow-2xl`}>
                        <Icon className="text-white" size={48} />
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-['Orbitron'] font-bold text-white mb-3">
                      {role.title}
                    </h2>

                    {/* Description */}
                    <p className="text-silver-grey mb-6 text-base md:text-lg">
                      {role.description}
                    </p>

                    {/* Arrow Icon */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                        <ArrowRight className="text-cobalt group-hover:translate-x-1 transition-transform" size={24} />
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-r ${role.gradient} opacity-20 blur-xl`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-silver-grey text-sm md:text-base">
            Need help? Contact your system administrator
          </p>
        </motion.div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default RoleSelectionPortal;
