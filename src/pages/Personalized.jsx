import { motion } from 'framer-motion';
import ProgressGraph from '../components/ProgressGraph';

const Personalized = () => {
  const progressData = [
    { label: 'Mon', value: 65 },
    { label: 'Tue', value: 80 },
    { label: 'Wed', value: 45 },
    { label: 'Thu', value: 90 },
    { label: 'Fri', value: 70 },
    { label: 'Sat', value: 85 },
    { label: 'Sun', value: 60 },
  ];

  const recommendations = [
    {
      title: 'Python Advanced',
      reason: 'Based on your progress in Python Fundamentals',
      progress: 75,
      icon: '🐍'
    },
    {
      title: 'React Advanced Patterns',
      reason: 'You\'re ready for advanced React concepts',
      progress: 50,
      icon: '⚛️'
    },
    {
      title: 'C# .NET Development',
      reason: 'Continue building on your C# fundamentals',
      progress: 30,
      icon: '🔷'
    }
  ];

  const stats = [
    { label: 'Learning Streak', value: '12 days', icon: '🔥' },
    { label: 'Modules Completed', value: '8/20', icon: '✅' },
    { label: 'Average Score', value: '87%', icon: '📊' },
    { label: 'Time Spent', value: '24h', icon: '⏱️' },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
              Personalized Learning
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Your AI-powered learning path, tailored just for you
          </p>
        </motion.div>
      </section>

      {/* Stats Cards */}
      <section className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass rounded-custom p-6 text-center border border-white/20 hover:border-cyan-glow transition-all"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold mb-2 text-cyan-glow">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Progress Graph */}
      <section className="container mx-auto px-4 mb-12">
        <ProgressGraph data={progressData} />
      </section>

      {/* Recommendations */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-primary to-cyan-glow bg-clip-text text-transparent">
              Recommended for You
            </span>
          </h2>
          <p className="text-gray-400">Based on your learning progress and goals</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass rounded-custom p-6 border border-white/20 hover:border-cyan-glow transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{rec.icon}</div>
                <span className="px-3 py-1 bg-gradient-to-r from-indigo-primary to-neon-purple rounded-full text-xs font-semibold">
                  {rec.progress}%
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{rec.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{rec.reason}</p>
              <div className="w-full bg-dark-blue-gray rounded-full h-2 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${rec.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-indigo-primary to-cyan-glow"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2 bg-gradient-to-r from-indigo-primary to-neon-purple rounded-custom font-semibold hover:shadow-glow-purple transition-all"
              >
                Continue Learning
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Personalized;

