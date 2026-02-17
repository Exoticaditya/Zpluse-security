import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, HUDHeading } from '../components/UIComponents';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await resetPassword(email);
            setSuccess(true);
        } catch (error) {
            console.error('Password reset error:', error);
            setError(
                error.code === 'auth/user-not-found'
                    ? 'No account found with this email address.'
                    : error.code === 'auth/invalid-email'
                    ? 'Please enter a valid email address.'
                    : 'Failed to send reset email. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 py-20">
                <div className="container mx-auto max-w-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="flex justify-center mb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center"
                            >
                                <CheckCircle className="text-green-400" size={48} />
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass p-8 rounded-lg glow-border"
                        >
                            <HUDHeading level="h2" className="mb-4">
                                Check Your Email
                            </HUDHeading>
                            <p className="text-silver-grey mb-6">
                                We've sent a password reset link to{' '}
                                <span className="text-cobalt font-['Orbitron']">{email}</span>
                            </p>
                            <p className="text-sm text-silver-grey mb-8">
                                Click the link in the email to reset your password. If you don't see the email,
                                check your spam folder.
                            </p>
                            <Link to="/login">
                                <Button variant="primary" className="w-full">
                                    Return to Login
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-20">
            <div className="container mx-auto max-w-md">
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
                    <HUDHeading level="h2">Reset Password</HUDHeading>
                    <p className="text-silver-grey mt-2">
                        Enter your email address and we'll send you a link to reset your password
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-8 rounded-lg glow-border"
                >
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
                        >
                            <p className="text-red-400 text-sm">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cobalt/50"
                                    size={20}
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-black/50 border border-cobalt/30 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cobalt outline-none transition-colors"
                                    placeholder="your@email.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                    <span className="ml-2">Sending...</span>
                                </div>
                            ) : (
                                'Send Reset Link'
                            )}
                        </Button>

                        {/* Back to Login */}
                        <div className="text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center text-sm text-cobalt hover:text-blue-400 transition-colors"
                            >
                                <ArrowLeft size={16} className="mr-2" />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </motion.div>

                {/* Additional Help */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 text-center"
                >
                    <p className="text-sm text-silver-grey">
                        Need help?{' '}
                        <Link to="/contact" className="text-cobalt hover:text-blue-400 transition-colors">
                            Contact Support
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;
