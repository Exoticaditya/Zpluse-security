import React from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from '../../../components/UIComponents';

const StatCard = ({ icon: Icon, label, value, trend, color = 'cobalt', delay = 0 }) => {
    return (
        <GlowCard delay={delay}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center mb-2">
                        <Icon className={`text-${color} mr-2`} size={24} />
                        <span className="text-silver-grey text-sm">{label}</span>
                    </div>
                    <div className={`text-3xl font-['Orbitron'] font-bold text-${color} text-glow`}>
                        {value}
                    </div>
                    {trend && (
                        <div className={`text-xs mt-2 ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
                            {trend.positive ? '↑' : '↓'} {trend.value}
                        </div>
                    )}
                </div>
            </div>
        </GlowCard>
    );
};

export default StatCard;
