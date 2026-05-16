import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, progressAPI } from '../utils/api';
import ProgressGraph from '../components/ProgressGraph';
import { personalizationAPI } from '../utils/api';
import RoadmapTimeline from '../components/personalization/RoadmapTimeline';
import { getCachedValue, setCachedValue } from '../utils/personalizationCache';
import { performanceAPI, weeklyReportsAPI } from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    activeModules: 0,
    completed: 0,
    streak: 0,
    totalPoints: 0
  });
  const [progressData, setProgressData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [performanceSummary, setPerformanceSummary] = useState({
    averageQuizScorePercentage: 0,
    weakAreas: [],
    strongAreas: [],
    totalTimeSpentSeconds: 0,
    currentStreak: 0
  });
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [weeklyHistory, setWeeklyHistory] = useState([]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/');
      } else {
        loadDashboardData();
        loadRoadmapData();
        loadPerformanceAndReports();
      }
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    const intervalId = setInterval(() => {
      loadDashboardData();
      loadPerformanceAndReports();
    }, 30000);
    return () => clearInterval(intervalId);
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const headers = { 'Authorization': `Bearer ${token}` };

      const [dashRes, activityRes] = await Promise.all([
        fetch(`${apiBaseUrl}/dashboard/me`, { headers }).catch(() => ({ ok: false })),
        fetch(`${apiBaseUrl}/activity/me`, { headers }).catch(() => ({ ok: false }))
      ]);

      let dashboardData = {};
      if (dashRes.ok) {
        dashboardData = await dashRes.json();
      }

      setStats({
        activeModules: dashboardData.activeModules || 0,
        completed: dashboardData.completed || 0,
        streak: dashboardData.streak || 0,
        totalPoints: dashboardData.totalPoints || 0
      });

      setProgressData(dashboardData.enrolledModules || []);

      if (activityRes.ok) {
        const actData = await activityRes.json();
        const acts = actData.map(a => ({
          action: a.action,
          item: a.item,
          icon: a.icon || '📝',
          time: new Date(a.createdAt).toLocaleString()
        }));
        setRecentActivity(acts.length > 0 ? acts : [
          { action: 'Welcome!', item: 'Start your dynamic learning journey', time: 'Just now', icon: '👋' }
        ]);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRoadmapData = async () => {
    if (!user) return;
    try {
      setRoadmapLoading(true);
      const userKey = user.id || user._id || 'me';
      const cached = getCachedValue(`roadmap_${userKey}`);
      if (cached) {
        setRoadmap(cached);
      }

      const response = await personalizationAPI.getRoadmap();
      setRoadmap(response.data);
      setCachedValue(`roadmap_${userKey}`, response.data);
    } catch {
    } finally {
      setRoadmapLoading(false);
    }
  };

  const loadPerformanceAndReports = async () => {
    try {
      const [perfRes, reportRes, historyRes] = await Promise.all([
        performanceAPI.getSummary().catch(() => null),
        weeklyReportsAPI.getCurrent().catch(() => null),
        weeklyReportsAPI.getHistory().catch(() => null)
      ]);
      if (perfRes?.data) {
        setPerformanceSummary({
          averageQuizScorePercentage: perfRes.data.averageQuizScorePercentage || 0,
          weakAreas: perfRes.data.weakAreas || [],
          strongAreas: perfRes.data.strongAreas || [],
          totalTimeSpentSeconds: perfRes.data.totalTimeSpentSeconds || 0,
          currentStreak: perfRes.data.currentStreak || 0
        });
      }
      if (reportRes?.data) setWeeklyReport(reportRes.data);
      if (historyRes?.data) setWeeklyHistory(historyRes.data);
    } catch {
    }
  };

  const sidebarItems = [
    { label: 'Overview', icon: '📊', active: true },
    { label: 'My Modules', icon: '📚' },
    { label: 'Progress', icon: '📈' },
    { label: 'Achievements', icon: '🏆' },
    { label: 'Settings', icon: '⚙️' },
  ];

  useEffect(() => {
    document.title = `Dashboard — Code Learn Hub`;
    return () => { document.title = 'Code Learn Hub'; };
  }, []);

  const greetingPrefix = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  const getTodayPlan = () => {
    const nextModule = progressData.find((p) => p.percent < 100) || progressData[0];
    const nextLessonEstimate = nextModule ? `${Math.max(1, Math.ceil((100 - nextModule.percent) / 10))} lesson steps left` : 'Pick a new module';
    const dailyChallenge = performanceSummary.weakAreas[0]
      ? `Revise weak topic: ${performanceSummary.weakAreas[0]}`
      : 'Solve one coding challenge from your current module';
    const estimatedTime = roadmap?.dailyStudyPlan || '60 minutes focused practice';
    return {
      nextLesson: nextModule ? `${nextModule.title} (${nextLessonEstimate})` : 'Start your first module',
      challenge: dailyChallenge,
      estimatedTime
    };
  };

  const predictedCompletionDate = weeklyReport?.predictedCompletionDate || 'Not enough data yet';
  const todayPlan = getTodayPlan();
  const lessonsCompletedThisWeek = weeklyReport?.totalLessonsCompleted || 0;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-20 px-6 bg-white dark:bg-deep-navy">
        <div className="container mx-auto py-8">
          <div className="animate-pulse mb-8">
            <div className="h-10 w-72 bg-gray-200 dark:bg-white/10 rounded-lg mb-3"></div>
            <div className="h-5 w-48 bg-gray-200 dark:bg-white/10 rounded"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-custom p-6 border border-black/5 dark:border-white/10 animate-pulse">
                <div className="h-10 w-10 bg-gray-200 dark:bg-white/10 rounded mb-4"></div>
                <div className="h-8 w-16 bg-gray-200 dark:bg-white/10 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex bg-white dark:bg-deep-navy transition-colors duration-300">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-20 left-0 h-[calc(100vh-80px)] bg-gray-50 dark:bg-dark-blue-gray border-r border-gray-200 dark:border-white/10 p-6 z-40 w-64 lg:static lg:translate-x-0 transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
            Navigation
          </h2>
        </div>
        <nav className="space-y-2">
          {sidebarItems.map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ x: 5 }}
              onClick={() => {
                if (item.label === 'My Modules') navigate('/modules', { state: { filterEnrolled: true } });
                else if (item.label === 'Achievements') navigate('/gamification');
                else if (item.label === 'Overview') navigate('/dashboard');
                else if (item.label === 'Progress') document.getElementById('progress-section')?.scrollIntoView({ behavior: 'smooth' });
                else alert('Feature coming soon!');
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 transition-all ${item.active
                ? 'bg-gradient-to-r from-indigo-primary to-neon-purple text-white shadow-glow-indigo'
                : 'text-gray-600 dark:text-gray-300 hover:bg-indigo-primary/10 dark:hover:bg-white/5'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold">{item.label}</span>
            </motion.button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 w-full overflow-x-hidden">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
                  Welcome Back{user?.name ? `, ${user.name}` : ''}!
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{greetingPrefix} {user?.name || 'Coder'}! Ready to code today? 🔥</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-3 glass rounded-xl border border-black/10 dark:border-white/20 text-indigo-primary dark:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </motion.button>
          </div>

          {/* Personalized Roadmap */}
          {!roadmapLoading && roadmap && (
            <div className="mb-8 overflow-hidden">
              <RoadmapTimeline
                roadmap={roadmap}
                onOpenModule={(moduleId) => navigate(`/modules/${moduleId}/lessons`)}
              />
            </div>
          )}

          {/* Personalized Plan */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-custom p-6 border border-black/5 dark:border-white/10 lg:col-span-2">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Today's AI Recommended Plan</h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p><span className="text-indigo-primary dark:text-cyan-glow font-semibold">Next lesson:</span> {todayPlan.nextLesson}</p>
                <p><span className="text-indigo-primary dark:text-cyan-glow font-semibold">Daily challenge:</span> {todayPlan.challenge}</p>
                <p><span className="text-indigo-primary dark:text-cyan-glow font-semibold">Estimated time:</span> {todayPlan.estimatedTime}</p>
                <p><span className="text-indigo-primary dark:text-cyan-glow font-semibold">Predicted completion:</span> {predictedCompletionDate}</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-custom p-6 border border-black/5 dark:border-white/10">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Snapshot</h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg quiz score</span>
                  <span className="text-indigo-primary dark:text-cyan-glow font-bold">{performanceSummary.averageQuizScorePercentage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Streak</span>
                  <span className="text-indigo-primary dark:text-cyan-glow font-bold">{performanceSummary.currentStreak || stats.streak} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">XP points</span>
                  <span className="text-indigo-primary dark:text-cyan-glow font-bold">{stats.totalPoints.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="glass rounded-custom p-4 md:p-6 border border-black/5 dark:border-white/10 bg-indigo-primary/5 dark:bg-indigo-primary/10"
            >
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeModules}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Active</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="glass rounded-custom p-4 md:p-6 border border-black/5 dark:border-white/10 bg-cyan-500/5 dark:bg-cyan-500/10"
            >
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Done</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="glass rounded-custom p-4 md:p-6 border border-black/5 dark:border-white/10 bg-purple-500/5 dark:bg-purple-500/10"
            >
              <div className="text-3xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.streak}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Streak</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="glass rounded-custom p-4 md:p-6 border border-black/5 dark:border-white/10 bg-orange-500/5 dark:bg-orange-500/10"
            >
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPoints}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">XP</div>
            </motion.div>
          </div>

          {/* Charts and Activity */}
          <div id="progress-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress */}
            <motion.div className="glass rounded-custom p-6 border border-black/5 dark:border-white/10">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                <span className="mr-2">📈</span> Learning Progress
              </h3>
              <div className="space-y-6">
                {progressData.length > 0 ? progressData.map((mod, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700 dark:text-white truncate pr-4">{mod.title}</span>
                      <span className="text-indigo-primary dark:text-cyan-glow font-bold shrink-0">{mod.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${mod.percent}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-indigo-primary to-cyan-glow"
                      />
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No active modules yet.</p>
                )}
              </div>
            </motion.div>

            {/* Activity */}
            <motion.div className="glass rounded-custom p-6 border border-black/5 dark:border-white/10">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-transparent">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-white font-semibold text-sm truncate">
                        {activity.action} <span className="text-indigo-primary dark:text-cyan-glow">{activity.item}</span>
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
