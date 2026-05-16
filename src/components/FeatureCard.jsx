import { motion } from 'framer-motion';

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="glass rounded-custom p-6 hover:border-cyan-glow border border-black/5 dark:border-white/10 shadow-sm dark:shadow-none transition-all cursor-pointer h-full"
    >
      <div className={`text-4xl md:text-5xl mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
        {feature.icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">{feature.description}</p>
    </motion.div>
  );
};

export default FeatureCard;
