import { motion } from 'framer-motion';

const About = () => {
  const roadmap = [
    { year: '2024 Q1', milestone: 'Platform Launch', status: 'completed' },
    { year: '2024 Q2', milestone: 'AI Content Generator', status: 'completed' },
    { year: '2024 Q3', milestone: 'Advanced Analytics', status: 'in-progress' },
    { year: '2024 Q4', milestone: 'Mobile App Release', status: 'upcoming' },
  ];

  const team = [
    { name: 'Alex Johnson', role: 'CEO & Founder', avatar: '👨‍💼' },
    { name: 'Sarah Chen', role: 'CTO', avatar: '👩‍💻' },
    { name: 'Mike Rodriguez', role: 'Lead AI Engineer', avatar: '👨‍🔬' },
    { name: 'Emily Davis', role: 'Head of Education', avatar: '👩‍🏫' },
  ];

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
              About Code Learn Hub
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Empowering developers worldwide with AI-powered learning experiences
          </p>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-custom p-8 border border-black/5 dark:border-white/10 shadow-lg"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-indigo-primary dark:text-cyan-glow">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              To democratize coding education by making high-quality, personalized learning accessible
              to everyone. We believe that with the right tools and AI-powered guidance, anyone can
              master programming and build amazing things.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-custom p-8 border border-black/5 dark:border-white/10 shadow-lg"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-indigo-primary dark:text-cyan-glow">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              To become the world's leading AI-powered coding education platform, helping millions of
              developers at every stage of their journey—from complete beginners to seasoned
              professionals looking to upskill.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Platform */}
      <section className="bg-gray-50 dark:bg-dark-blue-gray/50 py-20 transition-colors duration-300 mt-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-primary to-cyan-glow bg-clip-text text-transparent">
                Why Code Learn Hub?
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'AI-Powered',
                description: 'Advanced AI creates personalized learning paths',
                icon: '🤖'
              },
              {
                title: 'Interactive',
                description: 'Practice coding with real-time feedback',
                icon: '⚡'
              },
              {
                title: '5 Core Languages',
                description: 'Focused courses on Python, C++, C#, Java, and React',
                icon: '📚'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass rounded-custom p-6 text-center border border-black/5 dark:border-white/20 hover:border-cyan-glow transition-all shadow-md dark:shadow-none"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neon-purple to-cyan-glow bg-clip-text text-transparent">
              Our Roadmap
            </span>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {roadmap.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8"
            >
              <div className="flex-shrink-0 w-32 text-center md:text-right pt-2">
                <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-white ${
                  item.status === 'completed' ? 'bg-gradient-to-r from-indigo-primary to-cyan-glow' :
                  item.status === 'in-progress' ? 'bg-gradient-to-r from-neon-purple to-indigo-primary' :
                  'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {item.year}
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="glass rounded-2xl p-6 border border-black/5 dark:border-white/10 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.milestone}</h3>
                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${
                      item.status === 'completed' ? 'bg-green-100 dark:bg-cyan-glow/20 text-green-600 dark:text-cyan-glow' :
                      item.status === 'in-progress' ? 'bg-purple-100 dark:bg-neon-purple/20 text-purple-600 dark:text-neon-purple' :
                      'bg-gray-100 dark:bg-white/10 text-gray-400'
                    }`}>
                      {item.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 dark:bg-dark-blue-gray/50 py-20 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
                Meet the Visionaries
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass rounded-2xl p-6 text-center border border-black/5 dark:border-white/10 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="text-5xl md:text-6xl mb-4 grayscale hover:grayscale-0 transition-all duration-500">{member.avatar}</div>
                <h3 className="text-base md:text-lg font-bold mb-1 text-gray-900 dark:text-white truncate">{member.name}</h3>
                <p className="text-xs md:text-sm text-indigo-primary dark:text-cyan-glow font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
