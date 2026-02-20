import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative mt-20 glass border-t border-cobalt/30">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="text-cobalt" size={28} />
              <div>
                <h3 className="text-xl font-['Orbitron'] font-bold text-white">ZPLUSE</h3>
                <p className="text-xs text-cobalt">SECURITY SERVICES</p>
              </div>
            </div>
            <p className="text-silver-grey text-sm">
              Professional security solutions with trained personnel. Protecting what matters most with reliable and trusted security guards.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-['Orbitron'] font-semibold text-cobalt mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-silver-grey hover:text-cobalt transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/portal" className="text-silver-grey hover:text-cobalt transition-colors">
                  Security Portal
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-silver-grey hover:text-cobalt transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-['Orbitron'] font-semibold text-cobalt mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-silver-grey text-sm">
                <Mail size={16} className="text-cobalt" />
                <span>contact@zplusesecurity.com</span>
              </li>
              <li className="flex items-center space-x-2 text-silver-grey text-sm">
                <Phone size={16} className="text-cobalt" />
                <span>+1 (555) 0123-4567</span>
              </li>
              <li className="flex items-center space-x-2 text-silver-grey text-sm">
                <MapPin size={16} className="text-cobalt" />
                <span>Business District, Main Office</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-['Orbitron'] font-semibold text-cobalt mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/zplusesecurity"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass glow-border rounded-lg flex items-center justify-center text-cobalt hover:bg-cobalt hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com/zplusesecurity"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass glow-border rounded-lg flex items-center justify-center text-cobalt hover:bg-cobalt hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/zpluse-security"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass glow-border rounded-lg flex items-center justify-center text-cobalt hover:bg-cobalt hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://github.com/zplusesecurity"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass glow-border rounded-lg flex items-center justify-center text-cobalt hover:bg-cobalt hover:text-white transition-all"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cobalt/30 text-center">
          <p className="text-silver-grey text-sm">
            © 2025 Zpluse Security Services. All rights reserved. | 
            <span className="text-cobalt"> Your Safety is Our Priority</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
