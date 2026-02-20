import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

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
                href="https://www.youtube.com/@zplusesecurities?si=NHxpMQcBqYdODgZu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass glow-border rounded-lg flex items-center justify-center text-cobalt hover:bg-cobalt hover:text-white transition-all"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/zplusesecurity?igsh=MWx0ZHo1ZHd0bWliaQ"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass glow-border rounded-lg flex items-center justify-center text-cobalt hover:bg-cobalt hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://x.com/zplusesecuritie"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass glow-border rounded-lg flex items-center justify-center text-cobalt hover:bg-cobalt hover:text-white transition-all"
                aria-label="Twitter/X"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/zpluse-security-5a67403a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass glow-border rounded-lg flex items-center justify-center text-cobalt hover:bg-cobalt hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
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
