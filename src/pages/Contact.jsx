import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { GlowCard, HUDHeading, Button } from '../components/UIComponents';

const Contact = () => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            console.log('Form Submitted:', formState);
            alert('Transmission Received. Our operatives will contact you securely.');
            setIsSubmitting(false);
            setFormState({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 container mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <HUDHeading>Secure Channel</HUDHeading>
                <p className="text-silver-grey mt-4">Encrypted communication line established.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-6">
                    <GlowCard>
                        <div className="flex items-center space-x-4">
                            <div className="bg-cobalt/20 p-3 rounded-full">
                                <Phone className="text-cobalt" />
                            </div>
                            <div>
                                <h4 className="text-white font-['Orbitron']">Emergency Line</h4>
                                <p className="text-silver-grey">+1 (555) 000-ZERO</p>
                            </div>
                        </div>
                    </GlowCard>

                    <GlowCard delay={0.1}>
                        <div className="flex items-center space-x-4">
                            <div className="bg-cobalt/20 p-3 rounded-full">
                                <Mail className="text-cobalt" />
                            </div>
                            <div>
                                <h4 className="text-white font-['Orbitron']">Secure Email</h4>
                                <p className="text-silver-grey">access@zpluse-security.com</p>
                            </div>
                        </div>
                    </GlowCard>

                    <GlowCard delay={0.2}>
                        <div className="flex items-center space-x-4">
                            <div className="bg-cobalt/20 p-3 rounded-full">
                                <MapPin className="text-cobalt" />
                            </div>
                            <div>
                                <h4 className="text-white font-['Orbitron']">HQ Coordinates</h4>
                                <p className="text-silver-grey">Sector 7, Neo-Tokyo Dist, Cyber City</p>
                            </div>
                        </div>
                    </GlowCard>
                </div>

                {/* Contact Form */}
                <GlowCard className="border-cobalt/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">Identify</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formState.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/50 border border-cobalt/30 rounded p-3 text-white focus:border-cobalt outline-none transition-colors"
                                    placeholder="Codename / Name"
                                />
                            </div>
                            <div>
                                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">Frequency</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formState.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/50 border border-cobalt/30 rounded p-3 text-white focus:border-cobalt outline-none transition-colors"
                                    placeholder="Email Address"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formState.subject}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/50 border border-cobalt/30 rounded p-3 text-white focus:border-cobalt outline-none transition-colors"
                                placeholder="Inquiry Type"
                            />
                        </div>

                        <div>
                            <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">Transmission</label>
                            <textarea
                                name="message"
                                value={formState.message}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full bg-black/50 border border-cobalt/30 rounded p-3 text-white focus:border-cobalt outline-none transition-colors"
                                placeholder="Secure message content..."
                            ></textarea>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full flex justify-center items-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Transmitting...' : (
                                <>
                                    <Send size={18} className="mr-2" />
                                    Initiate Transmission
                                </>
                            )}
                        </Button>
                    </form>
                </GlowCard>
            </div>
        </div>
    );
};

export default Contact;
