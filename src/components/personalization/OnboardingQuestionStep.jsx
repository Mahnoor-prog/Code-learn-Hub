import { motion } from 'framer-motion';

const OnboardingQuestionStep = ({
  question,
  options,
  value,
  onChange,
  isInput = false,
  inputPlaceholder = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-bold text-white">{question}</h3>
      {isInput ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={inputPlaceholder}
          className="w-full px-4 py-3 rounded-lg bg-dark-blue-gray border border-white/20 text-white outline-none focus:border-cyan-glow"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((option) => {
            const selected = value === option;
            return (
              <button
                key={option}
                onClick={() => onChange(option)}
                className={`px-4 py-3 rounded-lg border text-left transition-all ${
                  selected
                    ? 'bg-gradient-to-r from-indigo-primary/40 to-neon-purple/40 border-cyan-glow text-white'
                    : 'bg-dark-blue-gray border-white/20 text-gray-300 hover:border-cyan-glow'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default OnboardingQuestionStep;
