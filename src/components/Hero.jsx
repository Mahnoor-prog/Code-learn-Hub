import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-primary/10 via-white dark:via-deep-navy to-neon-purple/10 transition-colors duration-300" />
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute inset-0 bg-gradient-to-br from-indigo-primary/20 via-transparent to-cyan-glow/20"
        style={{ backgroundSize: '200% 200%' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-indigo-primary via-neon-purple to-cyan-glow bg-clip-text text-transparent">
                Master Coding
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">with AI Power</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 mb-8 px-4"
            >
              Personalized learning paths, AI-powered content generation, and interactive coding practice
              all in one platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/dashboard" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(79, 70, 229, 0.6)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-8 py-4 bg-gradient-to-r from-indigo-primary to-neon-purple text-white rounded-custom font-semibold text-lg shadow-glow-purple hover:shadow-glow-cyan transition-all"
                >
                  Start Learning
                </motion.button>
              </Link>
              <Link to="/features" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-8 py-4 glass rounded-custom font-semibold text-lg border border-indigo-primary/30 dark:border-white/30 text-indigo-primary dark:text-white hover:border-cyan-glow transition-all"
                >
                  Explore Features
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating AI elements - Hidden on very small screens */}
          <div className="absolute top-20 left-4 md:left-10 opacity-20 hidden sm:block">
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-4xl md:text-6xl"
            >
              🤖
            </motion.div>
          </div>
          <div className="absolute bottom-20 right-4 md:right-10 opacity-20 hidden sm:block">
            <motion.div
              animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-4xl md:text-6xl"
            >
              💻
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
