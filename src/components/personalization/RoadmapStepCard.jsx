import { motion } from 'framer-motion';

const RoadmapStepCard = ({ step, index, onOpenModule }) => {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      onClick={() => step.moduleId && onOpenModule(step.moduleId)}
      className="w-full text-left glass border border-white/20 rounded-xl p-4 hover:border-cyan-glow transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-cyan-glow font-bold">Step {index + 1}</div>
        <div className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-200">{step.level}</div>
      </div>
      <h4 className="text-white font-semibold mb-1">{step.title}</h4>
      <p className="text-sm text-gray-400">{step.moduleTitle || step.language}</p>
      <p className="text-xs text-gray-500 mt-2">Estimated: {step.estimatedDays} day(s)</p>
      <p className="text-sm text-gray-300 mt-3">{step.dailyPlan}</p>
      {step.moduleId && (
        <div className="text-xs text-indigo-300 mt-3">Click to open module</div>
      )}
    </motion.button>
  );
};

export default RoadmapStepCard;
