import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { GlowCard } from '../../../components/UIComponents';

const ActivityFeed = ({ activities, title = "Recent Activity" }) => {
    const getActivityColor = (type) => {
        const colors = {
            success: 'text-green-400',
            warning: 'text-yellow-400',
            error: 'text-red-400',
            info: 'text-blue-400',
            default: 'text-cobalt'
        };
        return colors[type] || colors.default;
    };

    return (
        <GlowCard>
            <h3 className="text-xl font-['Orbitron'] font-bold text-white mb-6 flex items-center">
                <Clock className="mr-3 text-cobalt" size={24} />
                {title}
            </h3>

            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {activities.length === 0 ? (
                    <p className="text-silver-grey text-center py-8">No recent activity</p>
                ) : (
                    activities.map((activity, index) => (
                        <motion.div
                            key={activity.id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}`} />
                            <div className="flex-1">
                                <p className="text-white text-sm">{activity.message}</p>
                                <p className="text-silver-grey text-xs mt-1">{activity.timestamp}</p>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </GlowCard>
    );
};

export default ActivityFeed;
