import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.name, formData.email, formData.password);
      }
      if (result.success) {
        onClose();
        setFormData({ name: '', email: '', password: '' });
      } else {
        setError(result.message || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-[#1E293B] border border-black/10 dark:border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden transition-colors duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-primary/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-3xl leading-none transition-colors"
            >
              ×
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2.5 rounded-xl font-bold transition-all text-sm ${
                isLogin 
                ? 'bg-gradient-to-r from-indigo-primary to-neon-purple text-white shadow-glow-indigo' 
                : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2.5 rounded-xl font-bold transition-all text-sm ${
                !isLogin 
                ? 'bg-gradient-to-r from-indigo-primary to-neon-purple text-white shadow-glow-indigo' 
                : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 dark:text-red-400 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300 px-1">Full Name</label>
                <input
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:border-indigo-primary focus:ring-1 focus:ring-indigo-primary outline-none transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300 px-1">Email Address</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:border-indigo-primary focus:ring-1 focus:ring-indigo-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300 px-1">Password</label>
              <input
                type="password"
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:border-indigo-primary focus:ring-1 focus:ring-indigo-primary outline-none transition-all"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-indigo-primary to-neon-purple text-white rounded-xl font-bold text-base shadow-glow-indigo hover:shadow-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Processing...' : isLogin ? 'Login to Account' : 'Get Started Now'}
            </motion.button>

            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
              {isLogin ? "Don't have an account? " : "Already registered? "}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-indigo-primary dark:text-cyan-glow font-bold hover:underline"
              >
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;