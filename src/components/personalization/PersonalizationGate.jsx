import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { personalizationAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { getCachedValue, setCachedValue } from '../../utils/personalizationCache';
import OnboardingModal from './OnboardingModal';

const PersonalizationGate = () => {
  const location = useLocation();
  const { user, loading, onboardingCompleted, setOnboardingCompleted, refreshOnboardingState } = useAuth();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const isPublicLanding = useMemo(() => location.pathname === '/', [location.pathname]);

  useEffect(() => {
    if (loading || !user) {
      setOpen(false);
      return;
    }
    if (isPublicLanding) {
      setOpen(false);
      return;
    }

    const localFlag = localStorage.getItem('onboardingCompleted') === 'true';
    setOpen(!(onboardingCompleted || localFlag));
  }, [user, loading, onboardingCompleted, isPublicLanding]);

  const handleSubmit = async (answers) => {
    try {
      setSaving(true);
      const response = await personalizationAPI.submitOnboarding(answers);
      const roadmap = response.data?.roadmap || null;
      localStorage.setItem('onboardingCompleted', 'true');
      setOnboardingCompleted(true);
      if (roadmap) {
        setCachedValue(`roadmap_${user?.id || user?._id || 'me'}`, roadmap);
      }
      await refreshOnboardingState();
      setOpen(false);
    } catch (error) {
      const roadmapCache = getCachedValue(`roadmap_${user?.id || user?._id || 'me'}`);
      if (roadmapCache) {
        localStorage.setItem('onboardingCompleted', 'true');
        setOnboardingCompleted(true);
        setOpen(false);
        return;
      }
      alert(error?.response?.data?.message || 'Failed to save onboarding. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return <OnboardingModal open={open} loading={saving} onSubmit={handleSubmit} />;
};

export default PersonalizationGate;
