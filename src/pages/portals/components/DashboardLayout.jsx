import React from 'react';
import { motion } from 'framer-motion';
import { HUDHeading } from '../../../components/UIComponents';

const DashboardLayout = ({ title, subtitle, children, actions }) => {
    return (
        <div className="relative min-h-screen py-20 px-6">
            <div className="container mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <HUDHeading className="mb-2">{title}</HUDHeading>
                            {subtitle && (
                                <p className="text-silver-grey text-lg">{subtitle}</p>
                            )}
                        </div>
                        {actions && (
                            <div className="flex gap-3 flex-wrap">
                                {actions}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Content */}
                <div className="space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
