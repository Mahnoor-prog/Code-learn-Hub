import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { API_URL } from '../config.js';

const STARTER_TEMPLATES = {
  'JavaScript': `// Code Learn Hub - JavaScript Practice\nconsole.log("Hello, Developer!");\n\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\nconsole.log("Fibonacci:", fibonacci(10));\n`,
  'Python': `# Code Learn Hub - Python Practice\nprint("Hello, Developer!")\n\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint("Fibonacci:", fibonacci(10))\n`,
  'C++': `// Code Learn Hub - C++ Practice\n#include <iostream>\nusing namespace std;\n\nint fibonacci(int n) {\n    if (n <= 1) return n;\n    return fibonacci(n-1) + fibonacci(n-2);\n}\n\nint main() {\n    cout << "Hello, Developer!" << endl;\n    cout << "Fibonacci: " << fibonacci(10) << endl;\n    return 0;\n}\n`,
  'Java': `// Code Learn Hub - Java Practice\npublic class Main {\n    public static int fibonacci(int n) {\n        if (n <= 1) return n;\n        return fibonacci(n-1) + fibonacci(n-2);\n    }\n    \n    public static void main(String[] args) {\n        System.out.println("Hello, Developer!");\n        System.out.println("Fibonacci: " + fibonacci(10));\n    }\n}\n`,
  'C#': `// Code Learn Hub - C# Practice\nusing System;\n\nclass Program {\n    static int Fibonacci(int n) {\n        if (n <= 1) return n;\n        return Fibonacci(n-1) + Fibonacci(n-2);\n    }\n    \n    static void Main() {\n        Console.WriteLine("Hello, Developer!");\n    }\n}\n`,
  'React': `// Code Learn Hub - React JSX Practice\n// This code is transpiled on the server and executed in Node.js\nconst App = () => {\n  return <div><h1>Hello React!</h1></div>;\n};\n\nconsole.log("Transpiled JSX successfully!");\nconsole.log(App());\n`
};

const MONACO_LANGUAGES = {
  'JavaScript': 'javascript',
  'Python': 'python',
  'C++': 'cpp',
  'Java': 'java',
  'C#': 'csharp',
  'React': 'javascript'
};

const IDE = () => {
  const location = useLocation();
  const editorRef = useRef(null);
  const aiBannerRef = useRef(null);
  
  const getInitialLang = () => {
    if (location.state?.language) {
      const lower = location.state.language.toLowerCase();
      const match = Object.keys(STARTER_TEMPLATES).find(k => k.toLowerCase() === lower);
      if (match) return match;
    }
    return 'Python';
  };

  const [language, setLanguage] = useState(getInitialLang());
  const [code, setCode] = useState(STARTER_TEMPLATES[getInitialLang()]);
  const [output, setOutput] = useState('// Output will appear here\\n');
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(STARTER_TEMPLATES[lang]);
    setOutput('// Output will appear here\\n');
    setAiError(null);
  };

  const handleClear = () => {
    setCode(STARTER_TEMPLATES[language]);
    setOutput('// Output cleared.\\n');
    setAiError(null);
  };

  const triggerAIHelper = async (errorMsg) => {
    try {
        setIsAnalyzing(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAnalyzing(false);
            return;
        }
        
        const response = await fetch(`${API_URL}/aicontent/debug`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ language, code, error: errorMsg })
        });
        const data = await response.json();
        
        if (data.markdown) {
            setAiError(data.markdown);
            
            // Scroll UP to show error banner
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Wait 8 seconds then scroll back down
            setTimeout(() => {
              editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 8000);
        }
    } catch (err) {
        console.error("AI Helper Failed", err);
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setAiError(null);
    setOutput('Executing code...\n');
    try {
      const token = localStorage.getItem('token');
      const reqHeaders = { 'Content-Type': 'application/json' };
      if (token) reqHeaders['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/code/run`, {
        method: 'POST',
        headers: reqHeaders,
        body: JSON.stringify({ language, code })
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output + (data.error ? '\\n\\nErrors:\\n' + data.error : ''));
        if (data.error) {
            triggerAIHelper(data.error);
        }
      } else {
        const errMsg = data.error || JSON.stringify(data);
        setOutput(`Execution Failed:\n${errMsg}`);
        triggerAIHelper(errMsg);
      }
    } catch (err) {
      setOutput(`Network Error: Failed to execute code.\n${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    const token = localStorage.getItem('token');

    if (!token) {
      alert("Please log in to save your code snippets permanently to your account!");
      setIsSaving(false);
      return;
    }

    setTimeout(() => {
      const savedKey = `saved_code_${language}`;
      localStorage.setItem(savedKey, code);
      alert(`Saved ${language} snippet to your profile!`);
      setIsSaving(false);
    }, 600);
  };

  const renderAIErrorText = (text) => {
    // Simple custom markdown rendering to highlight backticks and format text
    const lines = text.split('\\n');
    return lines.map((line, idx) => {
        // Highlight code snippets within backticks
        const parts = line.split(/(\`[^\`]+\`)/g);
        const formattedLine = parts.map((part, pIdx) => {
            if (part.startsWith('\`') && part.endsWith('\`')) {
                return <code key={pIdx} className="bg-black/30 text-neon-purple px-1.5 py-0.5 rounded mx-1 font-mono text-[13px]">{part.slice(1, -1)}</code>;
            }
            return <span key={pIdx}>{part}</span>;
        });

        if (line.startsWith('---')) return <hr key={idx} className="my-4 border-white/20" />;
        if (line.includes('🔴 ERROR DETECTED')) return <h3 key={idx} className="text-red-400 font-bold text-lg mb-2 mt-4 flex items-center gap-2">{formattedLine}</h3>;
        if (line.includes('🔍 YOUR MISTAKE')) return <h3 key={idx} className="text-yellow-400 font-bold text-lg mb-2 mt-4 flex items-center gap-2">{formattedLine}</h3>;
        if (line.includes('💡 WHY THIS HAPPENS') || line.includes('📚 TIP TO REVISE')) return <h3 key={idx} className="text-cyan-glow font-bold text-lg mb-2 mt-4 flex items-center gap-2">{formattedLine}</h3>;
        if (line.includes('🛠️ SIMILAR CORRECT APPROACHES')) return <h3 key={idx} className="text-green-400 font-bold text-lg mb-2 mt-4 flex items-center gap-2">{formattedLine}</h3>;
        
        return <p key={idx} className="mb-2 text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{formattedLine}</p>;
    });
  };

  return (
    <div className="min-h-screen pt-20 bg-deep-navy">
      <section className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
                Code Practice IDE
              </span>
            </h1>
            <p className="text-gray-400">Write, execute, and test code right in your browser</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-dark-blue-gray text-white border border-white/20 rounded-lg px-4 py-2 focus:border-cyan-glow focus:outline-none"
            >
              {Object.keys(STARTER_TEMPLATES).map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </motion.div>
      </section>

      {/* AI Error Banner */}
      <AnimatePresence>
          {aiError && (
              <motion.section 
                  ref={aiBannerRef}
                  initial={{ opacity: 0, height: 0, mb: 0 }}
                  animate={{ opacity: 1, height: 'auto', mb: 24 }}
                  exit={{ opacity: 0, height: 0, mb: 0 }}
                  className="container mx-auto px-4 overflow-hidden"
              >
                  <div className="bg-gradient-to-br from-[#2a1b3d] to-[#1e1e2e] border border-neon-purple shadow-[0_0_20px_rgba(168,85,247,0.2)] rounded-xl p-6 relative">
                      <button 
                          onClick={() => setAiError(null)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-xl"
                      >
                          ×
                      </button>
                      <div className="absolute top-0 left-0 w-1 h-full bg-neon-purple rounded-l-xl shadow-glow-purple"></div>
                      <div className="pl-4">
                          {renderAIErrorText(aiError)}
                          <div className="mt-6">
                              <button 
                                  onClick={() => {
                                      setAiError(null);
                                      editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  }}
                                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all font-semibold border border-white/20"
                              >
                                  Got it!
                              </button>
                          </div>
                      </div>
                  </div>
              </motion.section>
          )}
          {isAnalyzing && !aiError && (
              <motion.section 
                  initial={{ opacity: 0, height: 0, mb: 0 }}
                  animate={{ opacity: 1, height: 'auto', mb: 24 }}
                  exit={{ opacity: 0, height: 0, mb: 0 }}
                  className="container mx-auto px-4 overflow-hidden"
              >
                  <div className="bg-[#1e1e2e] border border-white/10 rounded-xl p-4 flex items-center space-x-4">
                      <div className="w-5 h-5 border-2 border-cyan-glow border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-cyan-glow font-medium animate-pulse">AI is analyzing your error...</span>
                  </div>
              </motion.section>
          )}
      </AnimatePresence>

      <section ref={editorRef} className="container mx-auto px-4 pb-20 scroll-mt-24">
        <div className="glass rounded-xl overflow-hidden border border-white/20 shadow-[0_0_20px_rgba(138,43,226,0.1)]">
          <div className="bg-[#1e1e2e] px-4 py-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-sm text-gray-400 font-mono">main.{MONACO_LANGUAGES[language] === 'python' ? 'py' : MONACO_LANGUAGES[language] === 'javascript' ? 'js' : MONACO_LANGUAGES[language] === 'cpp' ? 'cpp' : MONACO_LANGUAGES[language] === 'java' ? 'java' : 'cs'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={handleClear} className="text-xs text-gray-400 hover:text-red-400 transition-colors mr-2">
                Reset Template
              </button>
              <button onClick={handleSave} disabled={isSaving} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-sm transition-all border border-white/10 flex items-center">
                {isSaving ? 'Saving...' : 'Save Code'}
              </button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRun} disabled={isRunning} className="px-6 py-1.5 bg-gradient-to-r from-neon-purple to-cyan-glow hover:shadow-glow-cyan rounded-lg font-bold text-sm text-white flex items-center space-x-2 transition-all disabled:opacity-50">
                <span>{isRunning ? '⏳' : '▶'}</span>
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh]">
            <div className="border-r border-white/10">
              <Editor
                height="100%"
                width="100%"
                theme="vs-dark"
                language={MONACO_LANGUAGES[language]}
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: "'Fira Code', 'Consolas', monospace", padding: { top: 16, bottom: 16 }, scrollBeyondLastLine: false, smoothScrolling: true, cursorBlinking: "smooth" }}
              />
            </div>
            <div className="bg-[#1a1b26] flex flex-col h-full border-t lg:border-t-0 border-white/10 relative">
              <div className="px-4 py-2 bg-black/20 border-b border-white/5 flex justify-between items-center text-xs font-bold text-gray-400 tracking-wider uppercase">
                Console Output
              </div>
              <div className="p-4 flex-1 overflow-y-auto">
                <pre className="font-mono text-sm text-cyan-50 whitespace-pre-wrap word-break">
                  {output}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IDE;
