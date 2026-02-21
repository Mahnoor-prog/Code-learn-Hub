import { motion } from 'framer-motion';
import BadgeCard from '../components/BadgeCard';
import { badges, leaderboard } from '../utils/dummyData';

const Gamification = () => {
  const totalPoints = 12500;
  const level = 5;
  const nextLevelPoints = 15000;
  const progress = (totalPoints / nextLevelPoints) * 100;

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
              Gamification
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
          {badges.map((badge, index) => (
            <BadgeCard key={badge.id} badge={badge} index={index} />
          ))}
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
          <p className="text-gray-400">Top performers this month</p>
        </motion.div>

        <div className="glass rounded-custom border border-white/20 overflow-hidden">
          <div className="divide-y divide-white/10">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 flex items-center justify-between hover:bg-white/5 transition-all ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-deep-navy' :
                    index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-deep-navy' :
                    index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white' :
                    'bg-dark-blue-gray text-gray-400'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : entry.rank}
                  </div>
                  <div className="text-3xl">{entry.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-white">{entry.name}</h3>
                    <p className="text-sm text-gray-400">Rank #{entry.rank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-cyan-glow">{entry.points.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">points</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gamification;

