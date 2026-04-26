import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ModuleCard from '../components/ModuleCard';
import { modulesAPI } from '../utils/api';

const Modules = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const languages = ['All', 'Python', 'C++', 'C#', 'Java', 'React'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    loadModules();
  }, [selectedLanguage, selectedDifficulty]);

  const loadModules = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedLanguage !== 'All') params.language = selectedLanguage;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;

      const response = await modulesAPI.getAll(params);
      let loadedModules = response.data;

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const progRes = await fetch(`${apiBaseUrl}/progress/all`, { headers: { 'Authorization': `Bearer ${token}` } });
          if (progRes.ok) {
            const progresses = await progRes.json();
            loadedModules = loadedModules.map(mod => {
              const prog = progresses.find(p => (p.moduleId?._id || p.moduleId) === mod._id);
              return { ...mod, progress: prog ? prog.progressPercentage : 0 };
            });
          }
        } catch (e) { console.error('Failed to fetch progress', e); }
      }

      setModules(loadedModules);
    } catch (error) {
      console.error('Failed to load modules:', error);
      // Fallback to empty array if API fails
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const location = useLocation();
  const filterEnrolled = location.state?.filterEnrolled;

  const filteredModules = modules.filter(m => {
    if (filterEnrolled && (!m.progress || m.progress <= 0)) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
              {filterEnrolled ? "My Custom Modules" : "Learning Modules"}
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Master Python, C++, C#, Java, and React with our comprehensive courses
          </p>
        </motion.div>
      </section>

      {/* Language Filters */}
      <section className="container mx-auto px-4 mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3 text-cyan-glow">Filter by Language:</h3>
          <div className="flex flex-wrap gap-3">
            {languages.map((lang, index) => (
              <motion.button
                key={lang}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-6 py-2 rounded-custom font-semibold transition-all ${selectedLanguage === lang
                  ? 'bg-gradient-to-r from-indigo-primary to-neon-purple shadow-glow-purple'
                  : 'glass border border-white/20 hover:border-cyan-glow'
                  }`}
              >
                {lang}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Difficulty Filters */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-cyan-glow">Filter by Difficulty:</h3>
          <div className="flex flex-wrap gap-3">
            {difficulties.map((difficulty, index) => (
              <motion.button
                key={difficulty}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-6 py-2 rounded-custom font-semibold transition-all ${selectedDifficulty === difficulty
                  ? 'bg-gradient-to-r from-indigo-primary to-cyan-glow shadow-glow-cyan'
                  : 'glass border border-white/20 hover:border-cyan-glow'
                  }`}
              >
                {difficulty}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="container mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Loading modules...</p>
          </div>
        ) : filteredModules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module, index) => (
              <ModuleCard key={module._id || module.id} module={module} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No modules found with the selected filters.</p>
            <p className="text-gray-500 text-sm mt-2">Try running: node server/seed.js to add sample data</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Modules;

