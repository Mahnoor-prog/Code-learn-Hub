import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import TestimonialSlider from '../components/TestimonialSlider';
import { features, testimonials } from '../utils/dummyData';

const Landing = () => {
  const shortFeatures = features.slice(0, 4);
  const whyChooseUs = [
    {
      title: 'AI-Powered Learning',
      description: 'Personalized content that adapts to your learning style',
      icon: '🧠'
    },
    {
      title: 'Interactive Practice',
      description: 'Code directly in your browser with instant feedback',
      icon: '⚡'
    },
    {
      title: 'Gamified Experience',
      description: 'Earn badges, compete on leaderboards, stay motivated',
      icon: '🎮'
    },
    {
      title: '5 Core Languages',
      description: 'Master Python, C++, C#, Java, and React with structured courses',
      icon: '📚'
    }
  ];

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Short Features Grid */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-primary to-cyan-glow bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-gray-400 text-lg">Everything you need to master coding</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {shortFeatures.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-dark-blue-gray/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-neon-purple to-cyan-glow bg-clip-text text-transparent">
                Why Choose Us?
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass rounded-custom p-6 text-center border border-white/20 hover:border-cyan-glow transition-all"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
              What Learners Say
            </span>
          </h2>
        </motion.div>

        <TestimonialSlider testimonials={testimonials} />
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass rounded-custom p-12 text-center max-w-3xl mx-auto border border-cyan-glow/30"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-primary to-cyan-glow bg-clip-text text-transparent">
              Ready to Start Learning?
            </span>
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of developers mastering coding with AI-powered learning
          </p>
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(79, 70, 229, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-indigo-primary to-neon-purple rounded-custom font-semibold text-lg shadow-glow-purple hover:shadow-glow-cyan transition-all"
            >
              Get Started Now
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;

