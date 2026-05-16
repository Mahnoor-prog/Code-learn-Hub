import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AuthModal from './AuthModal';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoText, setShowLogoText] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/features', label: 'Features' },
    { path: '/modules', label: 'Modules' },
    { path: '/ide', label: 'Code IDE' },
    { path: '/chatbot', label: 'Chatbot' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/contact', label: 'Contact' },
  ];

  const handleMobileLinkClick = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#0F172A] border-b border-black/10 dark:border-white/5"
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <motion.img 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              src="/logo.png" 
              alt="Code Learn Hub Logo" 
              className="h-10 w-10 rounded-lg shadow-glow-cyan cursor-pointer object-cover border border-white/20" 
              onClick={() => setShowLogoText(!showLogoText)} 
            />
            <AnimatePresence>
              {showLogoText && (
                <Link to="/">
                  <motion.span 
                    initial={{ opacity: 0, x: -10, width: 0 }} 
                    animate={{ opacity: 1, x: 0, width: 'auto' }}
                    exit={{ opacity: 0, x: -10, width: 0 }}
                    className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent cursor-pointer whitespace-nowrap overflow-hidden"
                  >
                    Code Learn Hub
                  </motion.span>
                </Link>
              )}
            </AnimatePresence>
            {!showLogoText && (
              <span className="text-cyan-glow text-xl hidden sm:inline">✨</span>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-2 py-1 transition-colors text-sm xl:text-base ${location.pathname === link.path
                    ? 'text-cyan-glow'
                    : 'text-gray-600 dark:text-gray-300 hover:text-indigo-primary dark:hover:text-white'
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

          <div className="flex items-center space-x-4">
            {/* Theme Toggle (Desktop) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors hidden md:block"
              title="Toggle Theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Auth/User Section */}
            {user ? (
              <div className="relative">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg cursor-pointer shadow-glow-purple border-2 border-white/20"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </motion.div>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-14 right-0 bg-white dark:bg-black/90 border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-2xl min-w-[220px] flex flex-col items-center backdrop-blur-md z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-3xl flex items-center justify-center mb-3 border-2 border-white/10 shadow-glow-purple">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-gray-900 dark:text-white font-semibold text-center mb-1">{user.name || "User"}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs text-center mb-4 truncate w-full px-2">{user.email}</p>
                      
                      <div className="w-full space-y-2">
                        <Link to="/dashboard" onClick={() => setShowUserMenu(false)} className="block w-full py-2 text-center text-sm bg-indigo-primary/10 dark:bg-white/10 hover:bg-indigo-primary/20 dark:hover:bg-white/20 rounded-lg text-indigo-primary dark:text-white transition-colors">
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            toggleTheme();
                            setShowUserMenu(false);
                          }}
                          className="w-full py-2 text-center text-sm bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-700 dark:text-gray-300 transition-colors md:hidden"
                        >
                          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
                        </button>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                            navigate('/');
                          }}
                          className="w-full py-2 text-center text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors font-medium"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 md:px-6 md:py-2 bg-gradient-to-r from-indigo-primary to-neon-purple text-white rounded-custom font-semibold shadow-glow-purple hover:shadow-glow-cyan transition-all text-sm md:text-base"
              >
                Get Started
              </motion.button>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-white"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <motion.span
                  animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-current rounded-full transition-all"
                />
                <motion.span
                  animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-full h-0.5 bg-current rounded-full transition-all"
                />
                <motion.span
                  animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-current rounded-full transition-all"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 overflow-hidden"
            >
              <div className="flex flex-col space-y-2 pb-4">
                {navLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleMobileLinkClick(link.path)}
                    className={`text-left px-4 py-3 rounded-xl transition-all ${
                      location.pathname === link.path
                        ? 'bg-indigo-primary text-white shadow-glow-indigo'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={toggleTheme}
                  className="text-left px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-between sm:hidden"
                >
                  <span>Theme</span>
                  <span>{isDark ? '☀️' : '🌙'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </motion.header>
  );
};

export default Header;
