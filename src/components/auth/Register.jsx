import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Phone, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, HUDHeading } from '../UIComponents';
import Navbar from '../Navbar';
import Footer from '../Footer';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'client' // default role
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const roles = [
        { value: 'client', label: 'Client', description: 'Property owner or facility manager' },
        { value: 'guard', label: 'Security Guard', description: 'Field security personnel' },
        { value: 'supervisor', label: 'Supervisor', description: 'Operations supervisor' },
        { value: 'admin', label: 'Administrator', description: 'System administrator' }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const validateForm = () => {
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            await register(formData.email, formData.password, {
                name: formData.name,
                phone: formData.phone,
                role: formData.role
            });

            // Show success message instead of redirecting immediately
            setSuccess(true);
        } catch (error) {
            console.error('Registration error:', error);
            if (error.code === 'auth/email-already-in-use') {
                setError('This email is already registered');
            } else {
                setError(error.message || 'Failed to create account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center px-6 py-20">
                <div className="container mx-auto max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="flex justify-center mb-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="w-16 h-16 border-4 border-cobalt/30 rounded-full flex items-center justify-center"
                        >
                            <Shield className="text-cobalt" size={32} />
                        </motion.div>
                    </div>
                    <HUDHeading level="h2">Request Access</HUDHeading>
                    <p className="text-silver-grey mt-2">Create your account to access the security portal</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-8 rounded-lg glow-border"
                >
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center"
                            >
                                <CheckCircle className="text-green-500" size={40} />
                            </motion.div>
                            <h3 className="text-2xl font-['Orbitron'] text-white mb-4">Registration Successful!</h3>
                            <p className="text-silver-grey mb-6">
                                Your account has been created and is pending admin approval. 
                                You will receive an email notification once your account is activated.
                            </p>
                            <div className="space-y-3">
                                <Link to="/portal">
                                    <Button variant="primary" className="w-full">
                                        Go to Login Portal
                                    </Button>
                                </Link>
                                <Link to="/">
                                    <Button variant="secondary" className="w-full">
                                        Back to Home
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start"
                                >
                                    <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                                    <p className="text-red-400 text-sm">{error}</p>
                                </motion.div>
                            )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-cobalt text-sm font-['Orbitron'] mb-3">
                                Select Role
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {roles.map((role) => (
                                    <label
                                        key={role.value}
                                        className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${formData.role === role.value
                                                ? 'border-cobalt bg-cobalt/20'
                                                : 'border-white/10 bg-black/30 hover:border-cobalt/50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={role.value}
                                            checked={formData.role === role.value}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className="flex items-start">
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 ${formData.role === role.value
                                                        ? 'border-cobalt'
                                                        : 'border-white/30'
                                                    }`}
                                            >
                                                {formData.role === role.value && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-cobalt"></div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-white font-['Orbitron'] text-sm">{role.label}</div>
                                                <div className="text-silver-grey text-xs mt-1">{role.description}</div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name Field */}
                            <div>
                                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cobalt/50" size={20} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-black/50 border border-cobalt/30 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cobalt outline-none transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cobalt/50" size={20} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-cobalt/30 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cobalt outline-none transition-colors"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cobalt/50" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/50 border border-cobalt/30 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cobalt outline-none transition-colors"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Password Field */}
                            <div>
                                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cobalt/50" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-black/50 border border-cobalt/30 rounded-lg pl-10 pr-12 py-3 text-white focus:border-cobalt outline-none transition-colors"
                                        placeholder="Min. 6 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cobalt/50 hover:text-cobalt transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cobalt/50" size={20} />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-black/50 border border-cobalt/30 rounded-lg pl-10 pr-12 py-3 text-white focus:border-cobalt outline-none transition-colors"
                                        placeholder="Repeat password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cobalt/50 hover:text-cobalt transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-silver-grey text-sm">
                            Already have an account?{' '}
                            <Link to="/portal" className="text-cobalt hover:text-blue-400 transition-colors font-['Orbitron']">
                                Login
                            </Link>
                        </p>
                    </div>
                    </>
                    )}
                </motion.div>

                {/* Back to Home */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-6"
                >
                    <Link to="/" className="text-sm text-silver-grey hover:text-cobalt transition-colors">
                        ← Back to Home
                    </Link>
                </motion.div>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default Register;
