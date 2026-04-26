import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ModuleCard = ({ module, index }) => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const handleYoutubeClick = () => {
    // Generate a search query link based on the language and topic
    const searchQuery = encodeURIComponent(`${module.language} ${module.difficulty} tutorial for beginners`);
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
  };

  const handleIDEClick = () => {
    // Navigate to IDE, you can pass state if you want the IDE to pre-select language
    navigate('/ide', { state: { language: module.language.toLowerCase() } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="glass rounded-custom p-6 hover:border-cyan-glow border border-white/20 transition-all relative overflow-hidden flex flex-col justify-between"
      style={{ minHeight: '300px' }}
    >
      <AnimatePresence mode="wait">
        {!showOptions ? (
          <motion.div 
            key="front"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{module.icon}</div>
                <span className="px-3 py-1 bg-gradient-to-r from-indigo-primary to-neon-purple rounded-full text-xs font-semibold">
                  {module.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{module.title}</h3>
              <p className="text-gray-400 text-sm mb-4">10 lessons</p>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-cyan-glow font-semibold">{module.progress || 0}%</span>
                </div>
                <div className="w-full bg-dark-blue-gray rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${module.progress || 0}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-indigo-primary to-cyan-glow"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowOptions(true)}
              className="w-full py-2 mt-auto bg-gradient-to-r from-indigo-primary to-neon-purple rounded-custom font-semibold hover:shadow-glow-purple transition-all"
            >
              {module.progress > 0 ? 'Continue' : 'Start'}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full justify-center space-y-4"
          >
            <h3 className="text-xl font-bold text-center text-cyan-glow mb-2">Choose an Option</h3>
            
            <Link to={`/modules/${module._id || module.id}/lessons`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <span>📚</span> Practice Lessons
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleYoutubeClick}
              className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <span>🎥</span> YouTube Video
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleIDEClick}
              className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <span>💻</span> Code Practice
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowOptions(false)}
              className="mt-4 text-gray-400 hover:text-white text-sm underline"
            >
              Back
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ModuleCard;

