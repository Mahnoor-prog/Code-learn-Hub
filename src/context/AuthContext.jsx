import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, loginUser, registerUser, logoutUser } from '../firebase';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // MongoDB user
  const [firebaseUser, setFirebaseUser] = useState(null); // Firebase user
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [onboardingCompleted, setOnboardingCompleted] = useState(
    localStorage.getItem('onboardingCompleted') === 'true'
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const newToken = await fbUser.getIdToken();
          localStorage.setItem('token', newToken);
          setToken(newToken);
          await loadUser(newToken);
        } catch (err) {
          console.error("Error getting token", err);
          setLoading(false);
        }
      } else {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUser = async (currentAuthToken) => {
    try {
      // The api.js defaults to localStorage.getItem('token'), but since state might not have updated yet, 
      // the token is there.
      const response = await authAPI.getMe();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user from MongoDB:', error);
      // Wait, if it fails because the MongoDB user isn't created yet during registration, we shouldn't logout.
      // But for normal loads, if it fails, maybe the backend is down.
    } finally {
      setLoading(false);
    }
  };

  const refreshOnboardingState = async () => {
    if (!token) return;
    try {
      const { personalizationAPI } = await import('../utils/api');
      const response = await personalizationAPI.getOnboardingStatus();
      const completed = Boolean(response.data?.onboardingCompleted);
      setOnboardingCompleted(completed);
      localStorage.setItem('onboardingCompleted', completed ? 'true' : 'false');
    } catch {
      // Keep silent so auth flow remains unaffected
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const fbUser = await loginUser(email, password);
      const newToken = await fbUser.getIdToken();
      localStorage.setItem('token', newToken);
      setToken(newToken);
      // wait for loadUser to populate MongoDB data
      const response = await authAPI.getMe();
      setUser(response.data);
      setTimeout(() => { refreshOnboardingState(); }, 0);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.message || 'Login failed',
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const fbUser = await registerUser(email, password);
      const newToken = await fbUser.getIdToken();
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Sync to MongoDB backend
      const response = await authAPI.register({ name, email, firebaseUid: fbUser.uid });
      setUser(response.data.user);

      localStorage.setItem('onboardingCompleted', 'false');
      setOnboardingCompleted(false);
      setTimeout(() => { refreshOnboardingState(); }, 0);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    await logoutUser();
    localStorage.removeItem('token');
    localStorage.removeItem('onboardingCompleted');
    setToken(null);
    setUser(null);
    setOnboardingCompleted(false);
  };

  useEffect(() => {
    if (token && user) {
      refreshOnboardingState();
    }
  }, [token, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        login,
        register,
        logout,
        loading,
        onboardingCompleted,
        setOnboardingCompleted,
        refreshOnboardingState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


