import { motion } from 'framer-motion';
import { useState } from 'react';

const IDE = () => {
  const [code, setCode] = useState(`// Welcome to Code Learn Hub IDE
// Write your code here and click Run

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("Developer"));
`);

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
              Online IDE
            </span>
          </h1>
          <p className="text-gray-400">Practice coding with instant feedback</p>
        </motion.div>
      </section>

      {/* IDE Container */}
      <section className="container mx-auto px-4 pb-20">
        <div className="glass rounded-custom overflow-hidden border border-white/20">
          {/* Toolbar */}
          <div className="bg-dark-blue-gray px-4 py-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-sm text-gray-400">main.js</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">JavaScript</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-primary to-cyan-glow rounded-lg font-semibold text-sm flex items-center space-x-2"
              >
                <span>▶</span>
                <span>Run</span>
              </motion.button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Editor */}
            <div className="bg-deep-navy p-6 min-h-[500px]">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
                spellCheck={false}
              />
            </div>

            {/* Output Panel */}
            <div className="bg-dark-blue-gray p-6 min-h-[500px] border-l border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Output</h3>
                <button className="text-xs text-gray-400 hover:text-cyan-glow">Clear</button>
              </div>
              <div className="bg-deep-navy rounded-lg p-4 font-mono text-sm text-green-400 min-h-[400px]">
                <div className="text-gray-400 mb-2">// Output will appear here</div>
                <div className="text-cyan-glow">Hello, Developer!</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Syntax Highlighting', icon: '🎨', description: 'Beautiful code highlighting for better readability' },
            { title: 'Auto Complete', icon: '⚡', description: 'Smart code suggestions as you type' },
            { title: 'Error Detection', icon: '🔍', description: 'Instant error detection and suggestions' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-custom p-6 text-center border border-white/20"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default IDE;

