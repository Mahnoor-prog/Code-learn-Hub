import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingQuestionStep from './OnboardingQuestionStep';

const OnboardingModal = ({ open, loading, onSubmit }) => {
  const questions = useMemo(() => ([
    {
      key: 'name',
      question: 'What is your name?',
      isInput: true,
      inputPlaceholder: 'Enter your name'
    },
    {
      key: 'ageGroup',
      question: 'What is your age group?',
      options: ['Under 18', '18-25', '25-35', '35+']
    },
    {
      key: 'experience',
      question: 'What is your coding experience?',
      options: ['Complete Beginner', 'Know Basics', 'Intermediate', 'Advanced']
    },
    {
      key: 'goal',
      question: 'What is your goal?',
      options: ['Get a Job', 'Freelancing', 'Build Projects', 'Learn for Fun']
    },
    {
      key: 'studyHours',
      question: 'How many hours per day can you study?',
      options: ['30 mins', '1 hour', '2 hours', '3+ hours']
    }
  ]), []);

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({
    name: '',
    ageGroup: '',
    experience: '',
    goal: '',
    studyHours: ''
  });

  const current = questions[stepIndex];
  const currentValue = answers[current.key];
  const canProceed = typeof currentValue === 'string' && currentValue.trim().length > 0;
  const isLast = stepIndex === questions.length - 1;

  const handleNext = async () => {
    if (!canProceed || loading) return;
    if (isLast) {
      await onSubmit({
        ...answers,
        name: answers.name.trim()
      });
      return;
    }
    setStepIndex((prev) => prev + 1);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-2xl glass border border-white/20 rounded-2xl p-6 md:p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Personalize Your Learning Path</h2>
              <p className="text-gray-400 mt-2">Answer 5 quick questions and get your AI roadmap instantly.</p>
              <div className="w-full bg-dark-blue-gray rounded-full h-2 mt-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((stepIndex + 1) / questions.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-indigo-primary to-cyan-glow"
                />
              </div>
            </div>

            <OnboardingQuestionStep
              question={current.question}
              options={current.options || []}
              value={answers[current.key]}
              onChange={(value) => setAnswers((prev) => ({ ...prev, [current.key]: value }))}
              isInput={Boolean(current.isInput)}
              inputPlaceholder={current.inputPlaceholder}
            />

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
                disabled={stepIndex === 0 || loading}
                className="px-5 py-2 rounded-lg border border-white/20 text-gray-300 disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed || loading}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-primary to-neon-purple text-white font-semibold disabled:opacity-50"
              >
                {loading ? 'Saving...' : isLast ? 'Generate My Roadmap' : 'Next'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;
