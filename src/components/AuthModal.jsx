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
      <div
        style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '440px',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button onClick={onClose} style={{ color: '#9ca3af', fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <button
              onClick={() => { setIsLogin(true); setError(''); setFormData({ name: '', email: '', password: '' }); }}
              style={{
                flex: 1, padding: '8px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', border: 'none',
                background: isLogin ? 'linear-gradient(to right, #6366f1, #a855f7)' : 'transparent',
                color: isLogin ? 'white' : '#9ca3af',
                border: isLogin ? 'none' : '1px solid rgba(255,255,255,0.2)',
              }}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setFormData({ name: '', email: '', password: '' }); }}
              style={{
                flex: 1, padding: '8px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
                background: !isLogin ? 'linear-gradient(to right, #6366f1, #a855f7)' : 'transparent',
                color: !isLogin ? 'white' : '#9ca3af',
                border: !isLogin ? 'none' : '1px solid rgba(255,255,255,0.2)',
              }}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: '8px', color: '#fca5a5', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#d1d5db' }}>Full Name</label>
                <input
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '12px 16px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#d1d5db' }}>Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '12px 16px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#d1d5db' }}>Password</label>
              <input
                type="password"
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password (min 6 characters)"
                minLength={6}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '12px 16px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%', padding: '12px', background: 'linear-gradient(to right, #6366f1, #a855f7)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
            </motion.button>

            <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px', marginTop: '16px' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); setFormData({ name: '', email: '', password: '' }); }}
                style={{ color: '#22d3ee', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;