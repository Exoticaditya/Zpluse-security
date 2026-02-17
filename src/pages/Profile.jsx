import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Lock,
    Shield, Bell, Eye, EyeOff, Save,
    Camera, Edit2, AlertCircle, CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, GlowCard, HUDHeading } from '../components/UIComponents';

const Profile = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile form state - will be populated from Firebase
    const [profileData, setProfileData] = useState({
        name: '',
        email: currentUser?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        role: ''
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Notification preferences
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        incidentAlerts: true,
        shiftReminders: true,
        systemUpdates: false
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Firebase update logic will go here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match!' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long!' });
            return;
        }

        setLoading(true);

        try {
            // Firebase password update logic will go here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update password. Please check your current password.' });
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationUpdate = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Firebase update logic will go here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
            setMessage({ type: 'success', text: 'Notification preferences updated!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update preferences. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => {
                setActiveTab(id);
                setMessage({ type: '', text: '' });
            }}
            className={`flex items-center px-6 py-3 font-['Orbitron'] transition-all ${
                activeTab === id
                    ? 'bg-cobalt text-white border-b-2 border-cobalt'
                    : 'text-silver-grey hover:text-white hover:bg-cobalt/20'
            }`}
        >
            <Icon size={18} className="mr-2" />
            {label}
        </button>
    );

    const InputField = ({ label, icon: Icon, ...props }) => (
        <div>
            <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">{label}</label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cobalt/50" size={20} />
                <input
                    className="w-full bg-black/50 border border-cobalt/30 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cobalt outline-none transition-colors"
                    {...props}
                />
            </div>
        </div>
    );

    const ToggleSwitch = ({ label, checked, onChange }) => (
        <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
            <span className="text-silver-grey">{label}</span>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                    checked ? 'bg-cobalt' : 'bg-gray-600'
                }`}
            >
                <motion.div
                    animate={{ x: checked ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full"
                />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <HUDHeading>Account Settings</HUDHeading>
                    <p className="text-silver-grey mt-2">Manage your profile and preferences</p>
                </motion.div>

                {/* Message Alert */}
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-lg border flex items-start ${
                            message.type === 'success'
                                ? 'bg-green-500/20 border-green-500/50'
                                : 'bg-red-500/20 border-red-500/50'
                        }`}
                    >
                        {message.type === 'success' ? (
                            <CheckCircle className="text-green-400 mr-3 flex-shrink-0" size={20} />
                        ) : (
                            <AlertCircle className="text-red-400 mr-3 flex-shrink-0" size={20} />
                        )}
                        <p className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                            {message.text}
                        </p>
                    </motion.div>
                )}

                {/* Tab Navigation */}
                <div className="mb-8 border-b border-cobalt/30 flex overflow-x-auto">
                    <TabButton id="profile" label="Profile" icon={User} />
                    <TabButton id="security" label="Security" icon={Lock} />
                    <TabButton id="notifications" label="Notifications" icon={Bell} />
                </div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <GlowCard>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-['Orbitron'] text-white">Profile Information</h3>
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-radial from-cobalt to-blue-900 rounded-full flex items-center justify-center">
                                        <User size={48} className="text-white" />
                                    </div>
                                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-cobalt rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                        <Camera size={16} className="text-white" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Full Name"
                                        icon={User}
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                    <InputField
                                        label="Email Address"
                                        icon={Mail}
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        placeholder="your@email.com"
                                        disabled
                                    />
                                    <InputField
                                        label="Phone Number"
                                        icon={Phone}
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        placeholder="+91 98765 43210"
                                    />
                                    <InputField
                                        label="Role"
                                        icon={Shield}
                                        type="text"
                                        value={profileData.role}
                                        placeholder="Your role"
                                        disabled
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <InputField
                                        label="Address"
                                        icon={MapPin}
                                        type="text"
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                        placeholder="Street address"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <InputField
                                            label="City"
                                            icon={MapPin}
                                            type="text"
                                            value={profileData.city}
                                            onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                            placeholder="City"
                                        />
                                        <InputField
                                            label="State"
                                            icon={MapPin}
                                            type="text"
                                            value={profileData.state}
                                            onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                                            placeholder="State"
                                        />
                                        <InputField
                                            label="ZIP Code"
                                            icon={MapPin}
                                            type="text"
                                            value={profileData.zipCode}
                                            onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                                            placeholder="ZIP"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" variant="primary" className="flex items-center" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                                />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} className="mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </GlowCard>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <GlowCard>
                            <h3 className="text-2xl font-['Orbitron'] text-white mb-6">Change Password</h3>
                            <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                <div>
                                    <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cobalt/50" size={20} />
                                        <input
                                            type={showPassword.current ? 'text' : 'password'}
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            required
                                            className="w-full bg-black/50 border border-cobalt/30 rounded-lg pl-10 pr-12 py-3 text-white focus:border-cobalt outline-none transition-colors"
                                            placeholder="Enter current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cobalt/50 hover:text-cobalt transition-colors"
                                        >
                                            {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cobalt/50" size={20} />
                                        <input
                                            type={showPassword.new ? 'text' : 'password'}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            required
                                            className="w-full bg-black/50 border border-cobalt/30 rounded-lg pl-10 pr-12 py-3 text-white focus:border-cobalt outline-none transition-colors"
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cobalt/50 hover:text-cobalt transition-colors"
                                        >
                                            {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cobalt/50" size={20} />
                                        <input
                                            type={showPassword.confirm ? 'text' : 'password'}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            required
                                            className="w-full bg-black/50 border border-cobalt/30 rounded-lg pl-10 pr-12 py-3 text-white focus:border-cobalt outline-none transition-colors"
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cobalt/50 hover:text-cobalt transition-colors"
                                        >
                                            {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" variant="primary" className="flex items-center" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                                />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={18} className="mr-2" />
                                                Update Password
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </GlowCard>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <GlowCard>
                            <h3 className="text-2xl font-['Orbitron'] text-white mb-6">Notification Preferences</h3>
                            <div className="space-y-4">
                                <ToggleSwitch
                                    label="Email Notifications"
                                    checked={notifications.emailNotifications}
                                    onChange={(val) => setNotifications({ ...notifications, emailNotifications: val })}
                                />
                                <ToggleSwitch
                                    label="SMS Notifications"
                                    checked={notifications.smsNotifications}
                                    onChange={(val) => setNotifications({ ...notifications, smsNotifications: val })}
                                />
                                <ToggleSwitch
                                    label="Push Notifications"
                                    checked={notifications.pushNotifications}
                                    onChange={(val) => setNotifications({ ...notifications, pushNotifications: val })}
                                />
                                <ToggleSwitch
                                    label="Incident Alerts"
                                    checked={notifications.incidentAlerts}
                                    onChange={(val) => setNotifications({ ...notifications, incidentAlerts: val })}
                                />
                                <ToggleSwitch
                                    label="Shift Reminders"
                                    checked={notifications.shiftReminders}
                                    onChange={(val) => setNotifications({ ...notifications, shiftReminders: val })}
                                />
                                <ToggleSwitch
                                    label="System Updates"
                                    checked={notifications.systemUpdates}
                                    onChange={(val) => setNotifications({ ...notifications, systemUpdates: val })}
                                />
                            </div>
                            <div className="flex justify-end mt-6">
                                <Button
                                    onClick={handleNotificationUpdate}
                                    variant="primary"
                                    className="flex items-center"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                            />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} className="mr-2" />
                                            Save Preferences
                                        </>
                                    )}
                                </Button>
                            </div>
                        </GlowCard>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
