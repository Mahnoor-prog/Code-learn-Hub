import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, progressAPI } from '../utils/api';
import ProgressGraph from '../components/ProgressGraph';

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

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/');
      } else {
        loadDashboardData();
      }
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, progressResponse] = await Promise.all([
        dashboardAPI.getStats().catch(() => ({ data: {} })),
        progressAPI.getAllProgress().catch(() => ({ data: [] }))
      ]);

      const dashboardData = dashboardResponse.data || {};
      setStats({
        activeModules: dashboardData.activeModules || 0,
        completed: dashboardData.completedModules || 0,
        streak: user.streak || 0,
        totalPoints: user.points || 0
      });

      // Generate progress data from recent progress
      const allProgress = progressResponse.data || [];
      if (allProgress.length > 0) {
        const weeklyData = allProgress.slice(-7).map((p, index) => ({
          label: `Week ${index + 1}`,
          value: p.progressPercentage || 0
        }));
        setProgressData(weeklyData.length > 0 ? weeklyData : [
          { label: 'Week 1', value: 0 }
        ]);
      } else {
        setProgressData([{ label: 'Week 1', value: 0 }]);
      }

      // Generate recent activity from progress
      const activities = allProgress
        .filter(p => p.updatedAt)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 4)
        .map(p => ({
          action: p.isCompleted ? 'Completed' : 'Progress',
          item: p.moduleId?.title || 'Module',
          time: new Date(p.updatedAt).toLocaleDateString(),
          icon: p.isCompleted ? '✅' : '📖'
        }));
      setRecentActivity(activities.length > 0 ? activities : [
        { action: 'Welcome!', item: 'Start your first module', time: 'Just now', icon: '👋' }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { label: 'Overview', icon: '📊', active: true },
    { label: 'My Modules', icon: '📚' },
    { label: 'Progress', icon: '📈' },
    { label: 'Achievements', icon: '🏆' },
    { label: 'Settings', icon: '⚙️' },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading dashboard...</p>
      </div>
    );
  }

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
                if (item.label === 'My Modules') navigate('/modules');
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
              <p className="text-gray-400">Here's your learning summary</p>
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
            {/* Progress Graph */}
            <ProgressGraph data={progressData} />

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

          {/* Learning Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-custom p-8 border border-white/20"
          >
            <h3 className="text-2xl font-bold mb-6 text-white">Learning Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-glow mb-2">87%</div>
                <div className="text-gray-400">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-glow mb-2">24h</div>
                <div className="text-gray-400">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-glow mb-2">5</div>
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

