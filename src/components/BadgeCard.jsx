import { motion } from 'framer-motion';

const BadgeCard = ({ badge, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, rotate: 2 }}
      className={`glass rounded-custom p-6 text-center border-2 transition-all ${
        badge.earned
          ? 'border-cyan-glow shadow-glow-cyan'
          : 'border-gray-600 opacity-60'
      }`}
    >
      <div className="text-6xl mb-4">{badge.icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{badge.name}</h3>
      <p className="text-gray-400 text-sm mb-2">{badge.description}</p>
      {badge.earned && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-cyan-glow text-xs mt-2"
        >
          Earned: {badge.date}
        </motion.div>
      )}
      {!badge.earned && (
        <div className="text-gray-500 text-xs mt-2">Locked</div>
      )}
    </motion.div>
  );
};

export default BadgeCard;

