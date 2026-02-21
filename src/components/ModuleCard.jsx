import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ModuleCard = ({ module, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="glass rounded-custom p-6 hover:border-cyan-glow border border-white/20 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-5xl">{module.icon}</div>
        <span className="px-3 py-1 bg-gradient-to-r from-indigo-primary to-neon-purple rounded-full text-xs font-semibold">
          {module.difficulty}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{module.title}</h3>
      <p className="text-gray-400 text-sm mb-4">{module.totalLessons || module.lessons || 0} lessons</p>
      
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

      <Link to={`/modules/${module._id || module.id}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2 bg-gradient-to-r from-indigo-primary to-neon-purple rounded-custom font-semibold hover:shadow-glow-purple transition-all"
        >
          {module.progress > 0 ? 'Continue' : 'Start'}
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default ModuleCard;

