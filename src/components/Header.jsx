import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/features', label: 'Features' },
    { path: '/modules', label: 'Modules' },
    { path: '/ide', label: 'Code IDE' },
    { path: '/ai-content', label: 'AI Generator' },
    { path: '/chatbot', label: 'Chatbot' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
              Code Learn Hub
            </span>
            <span className="text-cyan-glow text-xl">✨</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 transition-colors ${location.pathname === link.path
                    ? 'text-cyan-glow'
                    : 'text-gray-300 hover:text-white'
                  }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-primary to-cyan-glow"
                  />
                )}
              </Link>
            ))}
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-white transition-colors"
              >
                {user.name || user.email}
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="px-6 py-2 glass border border-white/20 rounded-custom font-semibold hover:border-cyan-glow transition-all"
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-2 bg-gradient-to-r from-indigo-primary to-neon-purple rounded-custom font-semibold shadow-glow-purple hover:shadow-glow-cyan transition-all"
            >
              Get Started
            </motion.button>
          )}
        </div>
      </nav>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </motion.header>
  );
};

export default Header;

