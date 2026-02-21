import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { modulesAPI, progressAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

// Quiz Component
const QuizComponent = ({ questions, moduleId, user }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (index) => {
    if (answered) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setAnswered(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Quiz completed
      const percentage = Math.round((score / questions.length) * 100);
      alert(`Quiz Complete! 🎉\n\nYour Score: ${score}/${questions.length} (${percentage}%)\n${percentage === 100 ? 'Perfect Score! 🏆' : percentage >= 70 ? 'Great Job! 👍' : 'Keep Practicing! 💪'}`);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setAnswered(false);
      setScore(0);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setAnswered(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h3>
        <span className="text-cyan-glow font-semibold">
          Score: {score}/{questions.length}
        </span>
      </div>

      <div className="bg-dark-blue-gray rounded-lg p-6 border border-white/10">
        <p className="text-gray-300 mb-6 text-lg">{currentQuestion.question}</p>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showResult = answered && (isSelected || isCorrect);

            return (
              <motion.button
                key={index}
                whileHover={!answered ? { x: 5 } : {}}
                onClick={() => handleAnswerSelect(index)}
                disabled={answered}
                className={`w-full text-left p-4 rounded-lg border transition-all ${showResult
                    ? isCorrect
                      ? 'bg-green-500/20 border-green-500'
                      : isSelected
                        ? 'bg-red-500/20 border-red-500'
                        : 'glass border-white/20'
                    : isSelected
                      ? 'bg-indigo-primary/30 border-cyan-glow'
                      : 'glass border-white/20 hover:border-cyan-glow'
                  } ${answered ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white">{option}</span>
                  {showResult && (
                    <span className="text-xl">
                      {isCorrect ? '✓' : isSelected ? '✗' : ''}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-deep-navy rounded-lg border border-cyan-glow/30"
          >
            <p className="text-cyan-glow font-semibold mb-2">Explanation:</p>
            <p className="text-gray-300 text-sm">{currentQuestion.explanation}</p>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex(currentQuestionIndex - 1);
              setSelectedAnswer(null);
              setShowExplanation(false);
              setAnswered(false);
            }
          }}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 glass border border-white/20 rounded-custom font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </motion.button>

        {!answered ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="px-6 py-2 bg-gradient-to-r from-indigo-primary to-neon-purple rounded-custom font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleNext}
            className="px-6 py-2 bg-gradient-to-r from-indigo-primary to-neon-purple rounded-custom font-semibold"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </motion.button>
        )}
      </div>
    </div>
  );
};

const ModuleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState({ progressPercentage: 0, completedLessons: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  useEffect(() => {
    loadModule();
  }, [id]);

  const loadModule = async () => {
    try {
      setLoading(true);
      const response = await modulesAPI.getById(id);
      setModule(response.data);

      // Load progress if user is logged in
      if (user) {
        try {
          const progressResponse = await progressAPI.getModuleProgress(id);
          setProgress(progressResponse.data);
        } catch (err) {
          // Progress doesn't exist yet, that's okay
          console.log('No progress found');
        }
      }
    } catch (error) {
      console.error('Failed to load module:', error);
      navigate('/modules');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async (lessonIndex) => {
    if (!user) {
      alert('Please login to track your progress');
      return;
    }

    try {
      const completedLessons = [...progress.completedLessons, lessonIndex];
      const totalLessons = module.lessons?.length || module.totalLessons || 1;
      const progressPercentage = Math.round((completedLessons.length / totalLessons) * 100);

      await progressAPI.updateProgress(id, {
        progressPercentage,
        completedLessons,
        isCompleted: progressPercentage === 100
      });

      setProgress({ ...progress, completedLessons, progressPercentage });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading module...</p>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Module not found</p>
      </div>
    );
  }

  const currentLesson = module.lessons?.[currentLessonIndex] || null;
  const totalLessons = module.lessons?.length || module.totalLessons || 0;
  const progressPercent = progress.progressPercentage || 0;

  const tabs = [
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'examples', label: 'Examples', icon: '💡' },
    { id: 'editor', label: 'Code Editor', icon: '💻' },
    { id: 'quiz', label: 'Quiz', icon: '📋' }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-5xl">{module.icon}</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
                  {module.title}
                </span>
              </h1>
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-gradient-to-r from-indigo-primary to-neon-purple rounded-full text-xs font-semibold">
                  {module.difficulty}
                </span>
                <span className="text-gray-400 text-sm">{totalLessons} lessons</span>
                <span className="text-gray-400 text-sm">{progressPercent}% complete</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-dark-blue-gray rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-indigo-primary to-cyan-glow"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tabs */}
      <section className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2 border-b border-white/10">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -2 }}
              className={`px-6 py-3 font-semibold transition-all relative ${activeTab === tab.id
                  ? 'text-cyan-glow'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-primary to-cyan-glow"
                />
              )}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Tab Content */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-custom p-8 border border-white/20 min-h-[500px]"
        >
          {activeTab === 'notes' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">Module Notes</h2>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  {module.description || `Welcome to ${module.title}! This module will guide you through all the essential concepts and help you build a strong foundation.`}
                </p>

                {module.lessons && module.lessons.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-cyan-glow mb-4">Lessons ({module.lessons.length})</h3>
                    {module.lessons.map((lesson, index) => (
                      <div
                        key={index}
                        className={`bg-dark-blue-gray rounded-lg p-4 border ${progress.completedLessons.includes(index)
                            ? 'border-green-500/50'
                            : 'border-white/10'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">
                            Lesson {index + 1}: {lesson.title}
                          </h4>
                          {progress.completedLessons.includes(index) && (
                            <span className="text-green-400">✓ Completed</span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{lesson.content}</p>
                        {lesson.videoUrl && (
                          <div className="mb-4 aspect-video rounded-lg overflow-hidden border border-white/10">
                            <iframe
                              src={lesson.videoUrl}
                              title={lesson.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        )}
                        {!progress.completedLessons.includes(index) && user && (
                          <button
                            onClick={() => handleCompleteLesson(index)}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-primary to-neon-purple rounded-lg text-sm font-semibold hover:shadow-glow-purple transition-all"
                          >
                            Mark as Complete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">Code Examples</h2>
              {currentLesson && currentLesson.examples && currentLesson.examples.length > 0 ? (
                <div className="space-y-4">
                  {currentLesson.examples.map((example, index) => (
                    <div key={index} className="bg-deep-navy rounded-lg p-4">
                      <div className="text-cyan-glow text-sm mb-2">// Example {index + 1}</div>
                      <pre className="text-white font-mono text-sm whitespace-pre-wrap">
                        {example}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-deep-navy rounded-lg p-4">
                    <div className="text-cyan-glow text-sm mb-2">// Example: Basic Syntax</div>
                    <pre className="text-white font-mono text-sm">
                      {`// ${module.language} example
function example() {
  console.log("Hello, World!");
  return true;
}`}
                    </pre>
                  </div>
                  <p className="text-gray-400 text-sm">More examples coming soon for this module!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'editor' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">Practice Code Editor</h2>
              <div className="bg-deep-navy rounded-lg p-4 min-h-[400px] border border-white/10">
                <textarea
                  defaultValue={`// ${module.language} Practice Code\n// Write your code here\n\n`}
                  className="w-full h-full bg-transparent text-white font-mono text-sm resize-none focus:outline-none transition-all"
                  style={{ minHeight: '400px' }}
                  spellCheck={false}
                />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-gray-400 text-sm">💡 Tip: This is a practice editor. For full IDE features, visit the IDE page.</p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 glass border border-white/20 rounded-custom font-semibold hover:border-cyan-glow transition-all"
                  >
                    Clear
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => alert('Code execution feature coming soon! For now, use the IDE page for full code execution.')}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-primary to-neon-purple rounded-custom font-semibold hover:shadow-glow-purple transition-all"
                  >
                    Run Code
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">Module Quiz</h2>
              {module.quiz && module.quiz.length > 0 ? (
                <QuizComponent
                  questions={module.quiz}
                  moduleId={module._id || module.id}
                  user={user}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg mb-4">No quiz questions available for this module yet.</p>
                  <p className="text-gray-500 text-sm">Quiz questions will be added soon!</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default ModuleDetails;

