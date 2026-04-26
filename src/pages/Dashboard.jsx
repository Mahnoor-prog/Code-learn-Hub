import { motion } from 'framer-motion';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

      // Multi-fetch the core features
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

      // The chart will just show flat enrollment numbers over time or static placeholders based on prompt "Show progress bar for each module... Learning Progress section". 
      // The prompt actually wants a list of active modules, not a generic line graph, but I'll pass enrolledModules to ProgressData safely.
      setProgressData(dashboardData.enrolledModules || []);

      if (activityRes.ok) {
        const actData = await activityRes.json();
        // Map to standard layout expected
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
      // Keep dashboard resilient when roadmap isn't ready yet
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
      // silent failure to preserve old dashboard
    }
  };

  const sidebarItems = [
    { label: 'Overview', icon: '📊', active: true },
    { label: 'My Modules', icon: '📚' },
    { label: 'Progress', icon: '📈' },
    { label: 'Achievements', icon: '🏆' },
    { label: 'Settings', icon: '⚙️' },
  ];

  // Set dynamic page title
  useEffect(() => {
    document.title = `Dashboard — Code Learn Hub`;
    return () => { document.title = 'Code Learn Hub'; };
  }, []);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-20 px-6">
        <div className="container mx-auto py-8">
          {/* Skeleton header */}
          <div className="animate-pulse mb-8">
            <div className="h-10 w-72 bg-white/10 rounded-lg mb-3"></div>
            <div className="h-5 w-48 bg-white/10 rounded"></div>
          </div>
          {/* Skeleton stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-custom p-6 border border-white/10 animate-pulse">
                <div className="h-10 w-10 bg-white/10 rounded mb-4"></div>
                <div className="h-8 w-16 bg-white/10 rounded mb-2"></div>
                <div className="h-4 w-24 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
          {/* Skeleton cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="glass rounded-custom p-6 border border-white/10 animate-pulse">
                <div className="h-6 w-40 bg-white/10 rounded mb-6"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 bg-white/10 rounded" style={{ width: `${70 + j * 7}%` }}></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen pt-20 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className={`fixed lg:static h-screen bg-dark-blue-gray border-r border-white/10 p-6 z-40 transition-all ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          }`}
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
            Dashboard
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
              }}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${item.active
                ? 'bg-gradient-to-r from-indigo-primary to-neon-purple'
                : 'hover:bg-white/5'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold">{item.label}</span>
            </motion.button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
                  Welcome Back{user?.name ? `, ${user.name}` : ''}!
                </span>
              </h1>
              <p className="text-gray-400">{greetingPrefix} {user?.name || 'Coder'}! Ready to code today? 🔥</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-3 glass rounded-lg border border-white/20"
            >
              ☰
            </motion.button>
          </div>

          {/* Personalized Roadmap */}
          {roadmapLoading && (
            <div className="glass rounded-custom p-6 border border-white/20 mb-8">
              <div className="animate-pulse h-6 w-64 bg-white/10 rounded mb-4"></div>
              <div className="animate-pulse h-4 w-full bg-white/10 rounded mb-3"></div>
              <div className="animate-pulse h-4 w-4/5 bg-white/10 rounded"></div>
            </div>
          )}
          {!roadmapLoading && roadmap && (
            <RoadmapTimeline
              roadmap={roadmap}
              onOpenModule={(moduleId) => navigate(`/modules/${moduleId}/lessons`)}
            />
          )}

          {/* Personalized Plan */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-custom p-6 border border-white/20 lg:col-span-2">
              <h3 className="text-xl font-bold mb-4 text-white">Today's AI Recommended Plan</h3>
              <div className="space-y-3 text-gray-300">
                <p><span className="text-cyan-glow font-semibold">Next lesson:</span> {todayPlan.nextLesson}</p>
                <p><span className="text-cyan-glow font-semibold">Daily challenge:</span> {todayPlan.challenge}</p>
                <p><span className="text-cyan-glow font-semibold">Estimated time:</span> {todayPlan.estimatedTime}</p>
                <p><span className="text-cyan-glow font-semibold">Predicted completion date:</span> {predictedCompletionDate}</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-custom p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-white">Performance Snapshot</h3>
              <div className="space-y-3 text-gray-300">
                <p><span className="text-cyan-glow font-semibold">Avg quiz score:</span> {performanceSummary.averageQuizScorePercentage}%</p>
                <p><span className="text-cyan-glow font-semibold">Current streak:</span> {performanceSummary.currentStreak || stats.streak} days</p>
                <p><span className="text-cyan-glow font-semibold">XP points:</span> {stats.totalPoints}</p>
                <p><span className="text-cyan-glow font-semibold">Lessons this week:</span> {lessonsCompletedThisWeek}</p>
              </div>
            </motion.div>
          </div>

          {/* Weekly AI report */}
          {weeklyReport && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-custom p-6 border border-white/20 mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Weekly AI Progress Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                <p><span className="text-cyan-glow font-semibold">Strongest topic:</span> {weeklyReport.strongestTopic}</p>
                <p><span className="text-cyan-glow font-semibold">Weakest topic:</span> {weeklyReport.weakestTopic}</p>
                <p><span className="text-cyan-glow font-semibold">Average this week:</span> {weeklyReport.averageQuizScore}%</p>
                <p><span className="text-cyan-glow font-semibold">Focus next week:</span> {weeklyReport.recommendedFocus}</p>
              </div>
              <div className="mt-4 p-4 bg-dark-blue-gray rounded-lg border border-white/10 text-gray-200">
                {weeklyReport.motivationalMessage}
              </div>
              {weeklyHistory.length > 1 && (
                <div className="mt-4 text-sm text-gray-400">
                  Previous reports saved: {Math.max(weeklyHistory.length - 1, 0)}
                </div>
              )}
            </motion.div>
          )}

          {/* Weak and strong areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-custom p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-white">Weak Areas</h3>
              <div className="space-y-2">
                {performanceSummary.weakAreas.length ? performanceSummary.weakAreas.slice(0, 6).map((topic, idx) => (
                  <div key={`${topic}-${idx}`} className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-400/20 text-red-200">{topic}</div>
                )) : <div className="text-gray-400">No weak areas detected yet.</div>}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-custom p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-white">Strong Areas</h3>
              <div className="space-y-2">
                {performanceSummary.strongAreas.length ? performanceSummary.strongAreas.slice(0, 6).map((topic, idx) => (
                  <div key={`${topic}-${idx}`} className="px-3 py-2 rounded-lg bg-green-500/10 border border-green-400/20 text-green-200">{topic}</div>
                )) : <div className="text-gray-400">Strong areas will appear after quiz completions.</div>}
              </div>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="glass rounded-custom p-6 border border-white/20 bg-gradient-to-br from-indigo-primary to-neon-purple bg-opacity-10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">📚</div>
              </div>
              <div className="text-3xl font-bold mb-1 text-white">{stats.activeModules}</div>
              <div className="text-gray-400 text-sm">Active Modules</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="glass rounded-custom p-6 border border-white/20 bg-gradient-to-br from-cyan-glow to-indigo-primary bg-opacity-10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">✅</div>
              </div>
              <div className="text-3xl font-bold mb-1 text-white">{stats.completed}</div>
              <div className="text-gray-400 text-sm">Completed</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="glass rounded-custom p-6 border border-white/20 bg-gradient-to-br from-neon-purple to-cyan-glow bg-opacity-10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">🔥</div>
              </div>
              <div className="text-3xl font-bold mb-1 text-white">{stats.streak} days</div>
              <div className="text-gray-400 text-sm">Streak</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="glass rounded-custom p-6 border border-white/20 bg-gradient-to-br from-indigo-primary to-cyan-glow bg-opacity-10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">⭐</div>
              </div>
              <div className="text-3xl font-bold mb-1 text-white">{stats.totalPoints.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Total Points</div>
            </motion.div>
          </div>

          {/* Charts and Activity */}
          <div id="progress-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Learning Progress Cards */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-custom p-6 border border-white/20 overflow-y-auto"
              style={{ maxHeight: '400px' }}
            >
              <h3 className="text-xl font-bold mb-6 text-white flex items-center"><span className="mr-2">📈</span> Learning Progress</h3>
              <div className="space-y-6">
                {progressData.length > 0 ? progressData.map((mod, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-white">{mod.title}</span>
                      <span className="text-cyan-glow font-bold">{mod.completeCount} / {mod.totalLessons} ({mod.percent}%)</span>
                    </div>
                    <div className="w-full bg-dark-blue-gray rounded-full h-2 overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${mod.percent}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-neon-purple to-cyan-glow"
                      />
                    </div>
                  </div>
                )) : (
                  <div className="text-gray-400 text-sm">No active modules found. Head to Modules to start learning!</div>
                )}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-custom p-6 border border-white/20"
            >
              <h3 className="text-xl font-bold mb-6 text-white">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-dark-blue-gray rounded-lg hover:bg-white/5 transition-all"
                  >
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">
                        {activity.action} <span className="text-cyan-glow">{activity.item}</span>
                      </p>
                      <p className="text-gray-400 text-sm">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Learning Summary — live data */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-custom p-8 border border-white/20"
          >
            <h3 className="text-2xl font-bold mb-6 text-white">Learning Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-glow mb-2">
                  {performanceSummary.averageQuizScorePercentage}%
                </div>
                <div className="text-gray-400">Average Quiz Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-glow mb-2">
                  {performanceSummary.totalTimeSpentSeconds > 0
                    ? `${Math.round(performanceSummary.totalTimeSpentSeconds / 3600 * 10) / 10}h`
                    : '0h'}
                </div>
                <div className="text-gray-400">Total Study Time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-glow mb-2">{stats.activeModules}</div>
                <div className="text-gray-400">Active Modules</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

