import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BadgeCard from '../components/BadgeCard';
import { API_URL } from '../config.js';
import { gamificationAPI } from '../utils/api';

const Gamification = () => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [xpMeta, setXpMeta] = useState({
    xpTitle: 'Newbie',
    xpIcon: '🌱',
    xpProgress: 0,
    pointsToNextTitle: 500,
    missions: []
  });

  useEffect(() => {
    document.title = 'Achievements — Code Learn Hub';
    return () => { document.title = 'Code Learn Hub'; };
  }, []);

  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }

        // Auto award missing badges
        const checkRes = await fetch(`${API_URL}/badges/check`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          setTotalPoints(checkData.totalPoints || 0);
        }

        // Fetch badges
        const res = await fetch(`${API_URL}/badges/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBadges(data);
        }

        // Fetch XP status + missions
        try {
          const statusRes = await gamificationAPI.getStatus();
          const status = statusRes.data || {};
          setXpMeta({
            xpTitle: status.xpTitle || 'Newbie',
            xpIcon: status.xpIcon || '🌱',
            xpProgress: status.xpProgress || 0,
            pointsToNextTitle: status.pointsToNextTitle || 0,
            missions: status.missions || []
          });
          if (typeof status.totalPoints === 'number') {
            setTotalPoints(status.totalPoints);
          }
        } catch {
          // keep old behavior if status API unavailable
        }

        // Fetch live leaderboard
        try {
          const lbRes = await fetch(`${API_URL}/gamification/leaderboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (lbRes.ok) {
            const lbData = await lbRes.json();
            setLeaderboard(lbData);
          }
        } catch {
          // leaderboard is optional, silent fail
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGamificationData();
  }, []);

  const level = Math.floor(totalPoints / 1000) + 1;
  const nextLevelPoints = level * 1000;
  const progress = ((totalPoints % 1000) / 1000) * 100;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6">
        <div className="container mx-auto">
          {/* Skeleton header */}
          <div className="animate-pulse text-center mb-12">
            <div className="h-14 w-72 bg-white/10 rounded-lg mx-auto mb-4"></div>
            <div className="h-5 w-56 bg-white/10 rounded mx-auto"></div>
          </div>
          {/* Skeleton XP bar */}
          <div className="glass rounded-custom p-8 border border-white/10 animate-pulse mb-8">
            <div className="flex justify-between mb-6">
              <div className="h-8 w-32 bg-white/10 rounded"></div>
              <div className="h-8 w-24 bg-white/10 rounded"></div>
            </div>
            <div className="h-4 bg-white/10 rounded-full w-full mb-2"></div>
            <div className="h-4 w-32 bg-white/10 rounded mt-2"></div>
          </div>
          {/* Skeleton badge grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-custom p-6 border border-white/10 animate-pulse text-center">
                <div className="h-16 w-16 bg-white/10 rounded-full mx-auto mb-4"></div>
                <div className="h-5 w-32 bg-white/10 rounded mx-auto mb-2"></div>
                <div className="h-4 w-40 bg-white/10 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
              Achievements
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Earn badges, level up, and compete on leaderboards
          </p>
        </motion.div>
      </section>

      {/* Progress Meter */}
      <section className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-custom p-8 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-white">Level {level}</h2>
              <p className="text-gray-400">Keep learning to level up!</p>
              <p className="text-cyan-glow mt-2">{xpMeta.xpIcon} {xpMeta.xpTitle}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-cyan-glow">{totalPoints.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Points</div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress to Level {level + 1}</span>
              <span className="text-cyan-glow font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-dark-blue-gray rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-indigo-primary via-neon-purple to-cyan-glow"
              />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {nextLevelPoints - totalPoints} points until next level
          </p>
          <p className="text-sm text-indigo-300 mt-1">
            {xpMeta.pointsToNextTitle} points until next title
          </p>
        </motion.div>
      </section>

      {/* Weekly Missions */}
      <section className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-custom p-8 border border-white/20"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-glow to-indigo-primary bg-clip-text text-transparent">
              Weekly Missions
            </span>
          </h2>
          <div className="space-y-3">
            {(xpMeta.missions || []).length > 0 ? xpMeta.missions.map((mission) => (
              <div key={mission.key} className={`p-4 rounded-lg border ${mission.completed ? 'bg-green-500/10 border-green-400/30' : 'bg-dark-blue-gray border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-white flex items-center gap-2">
                    {mission.completed && <span className="text-green-400">✓</span>}
                    {mission.label}
                  </span>
                  <span className={mission.completed ? 'text-green-300 font-semibold' : 'text-gray-400'}>
                    {mission.completed ? `+${mission.bonusXp} XP Earned` : `Bonus ${mission.bonusXp} XP`}
                  </span>
                </div>
              </div>
            )) : <div className="text-gray-400">Mission tracking is preparing your first weekly missions.</div>}
          </div>
        </motion.div>
      </section>

      {/* Badges */}
      <section className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-primary to-cyan-glow bg-clip-text text-transparent">
              Your Badges
            </span>
          </h2>
          <p className="text-gray-400">Earned {badges.filter(b => b.earned).length} of {badges.length} badges</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.length > 0 ? badges.map((badge, index) => (
            <BadgeCard key={badge._id} badge={badge} index={index} />
          )) : <div className="text-gray-400 col-span-3 text-center py-8">No badges yet. Complete lessons to earn your first badge! 🏅</div>}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neon-purple to-cyan-glow bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h2>
          <p className="text-gray-400">Top performers by XP points</p>
        </motion.div>

        <div className="glass rounded-custom border border-white/20 overflow-hidden">
          <div className="divide-y divide-white/10">
            {leaderboard.length > 0 ? leaderboard.map((entry, index) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className={`p-6 flex items-center justify-between hover:bg-white/5 transition-all ${index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-deep-navy' :
                    index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-deep-navy' :
                    index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white' :
                    'bg-dark-blue-gray text-gray-400'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : entry.rank}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{entry.name}</h3>
                    <p className="text-sm text-gray-400">🔥 {entry.streak || 0} day streak</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-cyan-glow">{entry.points.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">XP points</div>
                </div>
              </motion.div>
            )) : (
              <div className="p-12 text-center text-gray-400">
                <div className="text-4xl mb-4">🏆</div>
                <p className="text-lg">Complete lessons and earn XP to appear on the leaderboard!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gamification;
