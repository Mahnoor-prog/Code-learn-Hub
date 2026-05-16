import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import { features } from '../utils/dummyData';

const Features = () => {
  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-deep-navy transition-colors duration-300">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
              Platform Features
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Discover all the powerful tools and features that make learning to code easier and more effective
          </p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </section>

      {/* Additional Info */}
      <section className="bg-gray-50 dark:bg-dark-blue-gray/50 py-20 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-custom p-8 md:p-12 max-w-4xl mx-auto text-center border border-black/5 dark:border-cyan-glow/30 shadow-xl dark:shadow-none"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Ready to Experience These Features?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              Start your coding journey today and unlock the full potential of AI-powered learning
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/ai-content" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-8 py-4 bg-gradient-to-r from-indigo-primary to-neon-purple text-white rounded-xl font-bold text-lg shadow-glow-indigo hover:shadow-glow-cyan transition-all"
                >
                  Try AI Generator
                </motion.button>
              </Link>
              <Link to="/chatbot" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-8 py-4 glass border border-indigo-primary dark:border-cyan-glow rounded-xl font-bold text-lg text-indigo-primary dark:text-white hover:bg-indigo-primary/10 dark:hover:bg-cyan-glow/10 transition-all"
                >
                  Ask Chatbot
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;
