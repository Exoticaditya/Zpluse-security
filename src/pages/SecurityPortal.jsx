import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, AlertTriangle, Activity, MapPin, Phone, CheckCircle } from 'lucide-react';
import { Button, GlowCard, HUDHeading, ScanningLine } from '../components/UIComponents';

const SecurityPortal = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data
  const guards = [
    { id: 1, name: 'Rajesh Kumar', position: 'Main Gate', status: 'on-duty', shift: 'Day Shift (6AM-2PM)' },
    { id: 2, name: 'Amit Singh', position: 'Lobby', status: 'on-duty', shift: 'Day Shift (6AM-2PM)' },
    { id: 3, name: 'Suresh Patel', position: 'Parking Area', status: 'on-duty', shift: 'Day Shift (6AM-2PM)' },
    { id: 4, name: 'Vijay Sharma', position: 'Back Entrance', status: 'on-break', shift: 'Day Shift (6AM-2PM)' },
  ];

  const patrols = [
    { id: 1, guard: 'Mohan Das', location: 'Building A - Floor 3', time: '14:25', status: 'in-progress' },
    { id: 2, guard: 'Ravi Verma', location: 'Parking Basement', time: '14:10', status: 'completed' },
    { id: 3, guard: 'Prakash Joshi', location: 'Perimeter Check', time: '13:55', status: 'completed' },
  ];

  const accessLogs = [
    { id: 1, person: 'Sarah Chen', action: 'Entry Approved', location: 'Main Entrance', time: '14:32:18', type: 'resident' },
    { id: 2, person: 'Delivery - Amazon', action: 'Temporary Pass', location: 'Service Gate', time: '14:28:45', type: 'visitor' },
    { id: 3, person: 'Unknown Vehicle', action: 'Entry Denied', location: 'Parking Gate', time: '14:15:22', type: 'denied' },
    { id: 4, person: 'Dr. Kumar (Resident)', action: 'Entry Approved', location: 'Main Gate', time: '14:02:11', type: 'resident' },
  ];

  return (
    <div className="relative min-h-screen py-20 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <HUDHeading className="mb-4">Security Command Center</HUDHeading>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <p className="text-silver-grey text-lg mb-4 md:mb-0">
              Real-time monitoring and control dashboard
            </p>
            <div className="glass px-6 py-3 rounded-lg glow-border">
              <div className="font-['Orbitron'] text-cobalt text-xl">
                {time.toLocaleTimeString('en-US', { hour12: false })}
              </div>
              <div className="text-silver-grey text-sm">
                {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Camera Feeds */}
        <section className="mb-12">
          <h3 className="text-2xl font-['Orbitron'] font-bold text-white mb-6 flex items-center">
            <Users className="mr-3 text-cobalt" size={28} />
            On-Duty Security Personnel
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guards.map((guard, index) => (
              <GlowCard key={guard.id} delay={index * 0.1}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-['Orbitron'] text-xl text-white mb-2">{guard.name}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-silver-grey">
                        <MapPin size={14} className="text-cobalt mr-2" />
                        <span>{guard.position}</span>
                      </div>
                      <div className="flex items-center text-sm text-silver-grey">
                        <Clock size={14} className="text-cobalt mr-2" />
                        <span>{guard.shift}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-['Orbitron'] ${
                      guard.status === 'on-duty'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {guard.status === 'on-duty' ? 'ON DUTY' : 'ON BREAK'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 glass px-3 py-2 rounded text-sm text-cobalt hover:bg-cobalt/20 transition-colors flex items-center justify-center">
                    <Phone size={14} className="mr-1" />
                    Contact
                  </button>
                  <button className="flex-1 glass px-3 py-2 rounded text-sm text-cobalt hover:bg-cobalt/20 transition-colors">
                    View Details
                  </button>
                </div>
              </GlowCard>
            ))}
          </div>
        </section>

        {/* Drone Status */}
        <section className="mb-12">
          <h3 className="text-2xl font-['Orbitron'] font-bold text-white mb-6 flex items-center">
            <Activity className="mr-3 text-cobalt" size={28} />
            Active Patrol Rounds
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {patrols.map((patrol, index) => (
              <GlowCard key={patrol.id} delay={index * 0.1}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-['Orbitron'] text-lg text-white mb-1">{patrol.guard}</h4>
                    <div className="flex items-center text-sm">
                      <MapPin size={14} className="text-cobalt mr-1" />
                      <span className="text-silver-grey">{patrol.location}</span>
                    </div>
                  </div>
                  <motion.div
                    animate={{
                      scale: patrol.status === 'in-progress' ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 2,
                      repeat: patrol.status === 'in-progress' ? Infinity : 0,
                    }}
                  >
                    {patrol.status === 'in-progress' ? (
                      <Activity className="text-green-400" size={24} />
                    ) : (
                      <CheckCircle className="text-cobalt" size={24} />
                    )}
                  </motion.div>
                </div>

                {/* Time */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-silver-grey flex items-center">
                      <Clock size={16} className="mr-2 text-cobalt" />
                      Last Update
                    </span>
                    <span className="text-sm font-['Orbitron'] text-cobalt">{patrol.time}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-silver-grey">Status</span>
                  <span
                    className={`text-sm font-['Orbitron'] px-3 py-1 rounded-full ${
                      patrol.status === 'in-progress'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {patrol.status === 'in-progress' ? 'IN PROGRESS' : 'COMPLETED'}
                  </span>
                </div>
              </GlowCard>
            ))}
          </div>
        </section>

        {/* Biometric Access Logs */}
        <section className="mb-12">
          <h3 className="text-2xl font-['Orbitron'] font-bold text-white mb-6 flex items-center">
            <Clock className="mr-3 text-cobalt" size={28} />
            Access Control Logs
          </h3>
          <GlowCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cobalt/30">
                    <th className="text-left py-3 px-4 font-['Orbitron'] text-cobalt">Person/Vehicle</th>
                    <th className="text-left py-3 px-4 font-['Orbitron'] text-cobalt">Action</th>
                    <th className="text-left py-3 px-4 font-['Orbitron'] text-cobalt">Location</th>
                    <th className="text-left py-3 px-4 font-['Orbitron'] text-cobalt">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {accessLogs.map((log, index) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 text-white">{log.person}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-['Orbitron'] ${
                            log.type === 'resident'
                              ? 'bg-green-500/20 text-green-400'
                              : log.type === 'visitor'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-silver-grey">{log.location}</td>
                      <td className="py-3 px-4 text-silver-grey font-['Orbitron']">{log.time}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlowCard>
        </section>

        {/* Emergency Response */}
        <section>
          <GlowCard className="border-red-500/50">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-2xl font-['Orbitron'] font-bold text-white mb-2 flex items-center">
                  <AlertTriangle className="mr-3 text-red-500" size={28} />
                  Emergency Response
                </h3>
                <p className="text-silver-grey">
                  Activate immediate emergency protocol for critical situations
                </p>
              </div>
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(220, 38, 38, 0.5)',
                    '0 0 40px rgba(220, 38, 38, 0.8)',
                    '0 0 20px rgba(220, 38, 38, 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Button variant="danger" className="text-lg">
                  <AlertTriangle className="mr-2" size={20} />
                  Request Emergency Response
                </Button>
              </motion.div>
            </div>
          </GlowCard>
        </section>
      </div>
    </div>
  );
};

export default SecurityPortal;
