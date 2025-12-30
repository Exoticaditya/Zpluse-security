import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Users, Building2, Cross, Lock, CheckCircle } from 'lucide-react';
import { Button, GlowCard, HUDHeading } from '../components/UIComponents';

const Home = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 cyber-grid opacity-20"
        />

        {/* Hero Section */}
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: 'spring' }}
            className="mb-8 inline-block"
          >
            <div className="relative w-64 h-64 mx-auto">
              {/* Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-4 border-cobalt/30"
                style={{
                  background: 'radial-gradient(circle, rgba(0,71,255,0.1) 0%, transparent 70%)',
                }}
              />
              
              {/* Middle Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-8 rounded-full border-2 border-cobalt/50"
              />

              {/* Inner Shield */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 30px rgba(0,71,255,0.5)',
                    '0 0 60px rgba(0,71,255,0.8)',
                    '0 0 30px rgba(0,71,255,0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-16 rounded-full bg-gradient-radial from-cobalt to-blue-900 flex items-center justify-center"
              >
                <Shield size={64} className="text-white" />
              </motion.div>

              {/* Scanner Lines */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                <div className="absolute top-0 left-1/2 w-0.5 h-32 bg-gradient-to-b from-cobalt to-transparent transform -translate-x-1/2" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <HUDHeading className="mb-6 text-5xl md:text-7xl">
              Professional Security You Can Trust
            </HUDHeading>
            <p className="text-xl md:text-2xl text-silver-grey mb-8 max-w-3xl mx-auto">
              Expert security personnel for residential, corporate, and healthcare facilities. 
              Experience reliable protection powered by trained professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" className="text-lg">
                Our Services
              </Button>
              <Button variant="secondary" className="text-lg">
                Get Quote
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-cobalt rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-cobalt rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Services Grid Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <HUDHeading level="h2" className="mb-4">
              Security Solutions
            </HUDHeading>
            <p className="text-xl text-silver-grey">
              Cutting-edge protection systems tailored to your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <GlowCard delay={0}>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-radial from-cobalt to-blue-900 rounded-lg flex items-center justify-center"
              >
                <Building2 size={40} className="text-white" />
              </motion.div>
              <h3 className="text-2xl font-['Orbitron'] font-bold text-white mb-4 hud-bracket">
                Residential Security
              </h3>
              <p className="text-silver-grey mb-6">
                Professional security guards for apartments, gated communities, and residential complexes. 
                Trained personnel providing 24/7 protection, access control, and patrol services.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-silver-grey">
                  <CheckCircle size={16} className="text-cobalt mr-2" />
                  24/7 Manned Security
                </li>
                <li className="flex items-center text-sm text-silver-grey">
                  <CheckCircle size={16} className="text-cobalt mr-2" />
                  Visitor Management
                </li>
                <li className="flex items-center text-sm text-silver-grey">
                  <CheckCircle size={16} className="text-cobalt mr-2" />
                  Regular Patrols
                </li>
              </ul>
              <Button variant="secondary" className="w-full">
                Learn More
              </Button>
            </GlowCard>

            {/* Service Card 2 */}
            <GlowCard delay={0.2}>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-radial from-cobalt to-blue-900 rounded-lg flex items-center justify-center"
              >
                <Users size={40} className="text-white" />
              </motion.div>
              <h3 className="text-2xl font-['Orbitron'] font-bold text-white mb-4 hud-bracket">
                Corporate Security
              </h3>
              <p className="text-silver-grey mb-6">
                Dedicated security teams for offices, warehouses, and commercial properties. 
                Professional guards trained in corporate security protocols and emergency response.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-silver-grey">
                  <CheckCircle size={16} className="text-cobalt mr-2" />
                  Access Control Systems
                </li>
                <li className="flex items-center text-sm text-silver-grey">
                  <CheckCircle size={16} className="text-cobalt mr-2" />
                  Employee Safety
                </li>
                <li className="flex items-center text-sm text-silver-grey">
                  <CheckCircle size={16} className="text-cobalt mr-2" />
                  Asset Protection
                </li>
              </ul>
              <Button variant="secondary" className="w-full">
                Learn More
              </Button>
            </GlowCard>

            {/* Service Card 3 */}
            <GlowCard delay={0.4}>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-radial from-cobalt to-blue-900 rounded-lg flex items-center justify-center"
              >
                <Cross size={40} className="text-white" />
              </motion.div>
              <h3 className="text-2xl font-['Orbitron'] font-bold text-white mb-4 hud-bracket">
                Healthcare Facility Security
              </h3>
              <p className="text-silver-grey mb-6">
                Specialized security personnel for hospitals, clinics, and medical centers. 
                Guards trained in healthcare security, patient safety, and emergency protocols.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-silver-grey">
                  <CheckCircle size={16} className="text-cobalt mr-2" />
                  Patient Safety
                </li>
                <li className="flex items-center text-sm text-silver-grey">
                  <CheckCircle size={16} className="text-cobalt mr-2" />
                  Emergency Response
                </li>
                <li className="flex items-center text-sm text-silver-grey">
                  <CheckCircle size={16} className="text-cobalt mr-2" />
                  Medical Equipment Protection
                </li>
              </ul>
              <Button variant="secondary" className="w-full">
                Learn More
              </Button>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Trained Security Guards' },
              { value: '<5min', label: 'Average Response Time' },
              { value: '200+', label: 'Protected Sites' },
              { value: '24/7', label: 'Security Coverage' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-['Orbitron'] font-bold text-cobalt text-glow mb-2">
                  {stat.value}
                </div>
                <div className="text-silver-grey">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
