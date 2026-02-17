import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, Terminal, Wifi, Eye, Key } from 'lucide-react';
import { GlowCard, HUDHeading, Button } from '../components/UIComponents';

const CyberTools = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 px-6 container mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <HUDHeading>Cyber Defense Toolkit</HUDHeading>
                <p className="text-xl text-silver-grey mt-4">
                    Client-side security diagnostics and educational tools.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PasswordStrengthTool />
                <EncryptionTool />
                <NetworkScanner />
            </div>
        </div>
    );
};

const PasswordStrengthTool = () => {
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState(0);
    const [feedback, setFeedback] = useState('Enter a password to analyze');

    useEffect(() => {
        let score = 0;
        if (password.length > 7) score += 20;
        if (password.length > 12) score += 20;
        if (/[A-Z]/.test(password)) score += 20;
        if (/[0-9]/.test(password)) score += 20;
        if (/[^A-Za-z0-9]/.test(password)) score += 20;

        setStrength(score);

        if (password.length === 0) setFeedback('Enter a password to analyze');
        else if (score < 40) setFeedback('VULNERABLE: Instantly crackable by brute force.');
        else if (score < 80) setFeedback('WEAK: Vulnerable to dictionary attacks.');
        else setFeedback('SECURE: High entropy detected.');
    }, [password]);

    return (
        <GlowCard className="h-full">
            <div className="flex items-center mb-6">
                <Key className="text-cobalt mr-3" />
                <h3 className="text-xl font-['Orbitron'] text-white">Password Entropy Analyzer</h3>
            </div>
            <div className="space-y-4">
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Input string..."
                    className="w-full bg-black/50 border border-cobalt/30 rounded p-3 text-white focus:border-cobalt outline-none font-mono"
                />
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full ${strength > 60 ? 'bg-green-500' : strength > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${strength}%` }}
                    />
                </div>
                <p className={`font-mono text-sm ${strength > 60 ? 'text-green-400' : strength > 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                    [{strength}%] {feedback}
                </p>
            </div>
        </GlowCard>
    );
};

const EncryptionTool = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('encrypt');

    const process = () => {
        try {
            if (mode === 'encrypt') {
                setOutput(btoa(input));
            } else {
                setOutput(atob(input));
            }
        } catch (e) {
            setOutput('ERROR: Invalid Input');
        }
    };

    return (
        <GlowCard className="h-full">
            <div className="flex items-center mb-6">
                <Lock className="text-cobalt mr-3" />
                <h3 className="text-xl font-['Orbitron'] text-white">Base64 Encoder/Decoder</h3>
            </div>
            <div className="space-y-4">
                <div className="flex space-x-2">
                    <Button
                        size="sm"
                        variant={mode === 'encrypt' ? 'primary' : 'outline'}
                        onClick={() => setMode('encrypt')}
                    >
                        Encrypt
                    </Button>
                    <Button
                        size="sm"
                        variant={mode === 'decrypt' ? 'primary' : 'outline'}
                        onClick={() => setMode('decrypt')}
                    >
                        Decrypt
                    </Button>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === 'encrypt' ? "Text to encrypt..." : "Base64 string to decrypt..."}
                    className="w-full bg-black/50 border border-cobalt/30 rounded p-3 text-white focus:border-cobalt outline-none font-mono h-24"
                />
                <Button onClick={process} className="w-full">Process Data</Button>
                <div className="bg-black/80 p-3 rounded border border-cobalt/20 min-h-[60px]">
                    <p className="text-silver-grey text-xs mb-1">OUTPUT_STREAM:</p>
                    <p className="text-green-400 font-mono break-all">{output}</p>
                </div>
            </div>
        </GlowCard>
    );
};

const NetworkScanner = () => {
    const [ips, setIps] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newIp = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            const status = Math.random() > 0.8 ? 'VULNERABLE' : 'SECURE';

            setIps(current => {
                const updated = [...current, { ip: newIp, status }];
                if (updated.length > 5) updated.shift();
                return updated;
            });
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <GlowCard className="lg:col-span-2">
            <div className="flex items-center mb-6">
                <Wifi className="text-cobalt mr-3" />
                <h3 className="text-xl font-['Orbitron'] text-white">Network Traffic Monitor (Simulation)</h3>
            </div>
            <div className="bg-black/90 p-4 rounded border border-cobalt/30 font-mono text-sm h-64 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-cobalt/50 shadow-[0_0_10px_#0047FF]" />

                <div className="space-y-2">
                    {ips.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex justify-between border-b border-gray-800 pb-1"
                        >
                            <span className="text-silver-grey">Target: {item.ip}</span>
                            <span className={item.status === 'SECURE' ? 'text-green-500' : 'text-red-500'}>
                                [{item.status}]
                            </span>
                        </motion.div>
                    ))}
                    <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-cobalt mt-4"
                    >
                        Scanning network segments...
                    </motion.div>
                </div>
            </div>
        </GlowCard>
    );
};

export default CyberTools;
