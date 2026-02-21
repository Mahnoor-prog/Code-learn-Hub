import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { aicontentAPI } from '../utils/api';

const AIContent = () => {
  const { user } = useAuth();
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('Python');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [contentType, setContentType] = useState('lesson');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const languages = ['Python', 'C++', 'C#', 'Java', 'React'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const contentTypes = [
    { value: 'lesson', label: 'Lesson' },
    { value: 'example', label: 'Code Example' },
    { value: 'exercise', label: 'Exercise' }
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    if (!user) {
      setError('Please login to generate content');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedContent(null);

    try {
      const response = await aicontentAPI.generate({
        topic,
        language,
        difficulty,
        contentType
      });
      setGeneratedContent(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section with Gradient */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-primary/30 via-neon-purple/20 to-cyan-glow/30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Description */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
                  AI Content Generator
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                Our advanced AI analyzes your learning progress and preferences to generate
                personalized coding lessons, examples, and exercises tailored specifically to your
                skill level and learning style.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-cyan-glow text-2xl">✨</span>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Personalized Lessons</h3>
                    <p className="text-gray-400">Content adapted to your learning pace and style</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-cyan-glow text-2xl">🎯</span>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Smart Examples</h3>
                    <p className="text-gray-400">Real-world examples relevant to your goals</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-cyan-glow text-2xl">📈</span>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Progress Tracking</h3>
                    <p className="text-gray-400">AI adjusts difficulty based on your performance</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Content Generator */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="glass rounded-custom p-6 border border-white/20 neon-glow">
                {!user ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Please login to use AI Content Generator</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Topic</label>
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          placeholder="e.g., Functions, Classes, Arrays"
                          className="w-full bg-dark-blue-gray border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-glow"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-300">Language</label>
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full bg-dark-blue-gray border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-glow"
                          >
                            {languages.map(lang => (
                              <option key={lang} value={lang}>{lang}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-300">Difficulty</label>
                          <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full bg-dark-blue-gray border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-glow"
                          >
                            {difficulties.map(diff => (
                              <option key={diff} value={diff}>{diff}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Content Type</label>
                        <div className="flex gap-2">
                          {contentTypes.map(type => (
                            <button
                              key={type.value}
                              onClick={() => setContentType(type.value)}
                              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                                contentType === type.value
                                  ? 'bg-gradient-to-r from-indigo-primary to-neon-purple'
                                  : 'glass border border-white/20'
                              }`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                        {error}
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGenerate}
                      disabled={loading || !topic.trim()}
                      className="w-full py-3 bg-gradient-to-r from-indigo-primary to-neon-purple rounded-lg font-semibold hover:shadow-glow-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                    >
                      {loading ? 'Generating...' : 'Generate Content'}
                    </motion.button>

                    {generatedContent && (
                      <div className="bg-dark-blue-gray rounded-lg p-4 border border-white/10">
                        <div className="text-cyan-glow text-sm mb-2">Generated {contentType}:</div>
                        <div className="text-white text-sm whitespace-pre-wrap font-mono">
                          {generatedContent.content}
                        </div>
                        {generatedContent.skillLevel && (
                          <div className="mt-3 text-xs text-gray-400">
                            Personalized for: {generatedContent.skillLevel} level
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-primary to-cyan-glow bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Analyze Progress', description: 'AI reviews your learning history and performance', icon: '📊' },
            { step: '2', title: 'Generate Content', description: 'Creates personalized lessons and examples', icon: '✨' },
            { step: '3', title: 'Adapt & Improve', description: 'Continuously adjusts based on your feedback', icon: '🎯' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-custom p-6 text-center border border-white/20 hover:border-cyan-glow transition-all"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <div className="text-cyan-glow font-bold text-lg mb-2">Step {item.step}</div>
              <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AIContent;

