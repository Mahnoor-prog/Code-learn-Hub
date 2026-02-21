import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/features', label: 'Features' },
    { path: '/modules', label: 'Modules' },
  ];

  const socialLinks = [
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'GitHub', icon: '💻', url: '#' },
    { name: 'LinkedIn', icon: '💼', url: '#' },
    { name: 'Discord', icon: '💬', url: '#' },
  ];

  return (
    <footer className="bg-dark-blue-gray border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
              Code Learn Hub
            </h3>
            <p className="text-gray-400 text-sm">
              AI-powered coding learning platform to accelerate your programming journey.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-cyan-glow">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-cyan-glow transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-cyan-glow">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-cyan-glow transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-cyan-glow transition-colors text-sm">
                  Support
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-glow transition-colors text-sm">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-cyan-glow">Connect</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-2xl hover:text-cyan-glow transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Code Learn Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

