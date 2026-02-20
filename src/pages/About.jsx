import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Users, Target } from 'lucide-react';
import { GlowCard, HUDHeading } from '../components/UIComponents';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  const team = [
    { name: 'Alex Chen', role: 'Chief Security Officer', icon: Shield },
    { name: 'Sarah Connor', role: 'Head of Cyber Defense', icon: Target },
    { name: 'Marcus Wright', role: 'Tactical Operations', icon: Users },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 px-6 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <HUDHeading>About Zpluse Security</HUDHeading>
        <p className="text-xl text-silver-grey mt-4 max-w-2xl mx-auto">
          Forging the future of protective services through advanced robotics and cyber-intelligence.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <GlowCard>
          <div className="flex items-start">
            <div className="mr-6 p-4 bg-cobalt/10 rounded-lg">
              <Award className="text-cobalt" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-['Orbitron'] text-white mb-3">Our Mission</h3>
              <p className="text-silver-grey leading-relaxed">
                To bridge the gap between physical security and digital defense. We believe in a holistic
                approach where AI-driven surveillance meets elite human expertise.
              </p>
            </div>
          </div>
        </GlowCard>

        <GlowCard delay={0.2}>
          <div className="flex items-start">
            <div className="mr-6 p-4 bg-cobalt/10 rounded-lg">
              <Target className="text-cobalt" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-['Orbitron'] text-white mb-3">Our Vision</h3>
              <p className="text-silver-grey leading-relaxed">
                A world where security is proactive, not reactive. Utilizing predictive algorithms
                and autonomous systems to neutralize threats before they manifest.
              </p>
            </div>
          </div>
        </GlowCard>
      </div>

      <section>
        <h3 className="text-3xl font-['Orbitron'] text-white text-center mb-10">
          <span className="text-cobalt">[</span> The Elite Team <span className="text-cobalt">]</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <GlowCard key={index} delay={index * 0.1}>
              <div className="text-center py-6">
                <div className="w-24 h-24 mx-auto bg-cobalt/20 rounded-full flex items-center justify-center mb-4 border border-cobalt/50">
                  <member.icon size={40} className="text-cobalt" />
                </div>
                <h4 className="text-xl font-['Orbitron'] text-white">{member.name}</h4>
                <p className="text-silver-grey text-sm mt-1">{member.role}</p>
              </div>
            </GlowCard>
          ))}
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default About;
