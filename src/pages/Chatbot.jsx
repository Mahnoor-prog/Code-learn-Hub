import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { chatbotAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI coding assistant. I can help you with Python, C++, C#, Java, and React. What would you like to learn today?",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendQuickPrompt = async (promptText, fallbackText) => {
    if (!promptText.trim() || loading) return;
    const userMessage = {
      id: Date.now(),
      text: promptText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await chatbotAPI.sendMessage(promptText);
      const aiMessage = response.data.aiMessage || response.data;
      const aiResponse = {
        id: Date.now() + 1,
        text: aiMessage.text || aiMessage.response || response.data.response || fallbackText || generateAIResponse(promptText),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const aiResponse = {
        id: Date.now() + 1,
        text: fallbackText || generateAIResponse(promptText),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzePerformance = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await chatbotAPI.analyzePerformance();
      const aiResponse = {
        id: Date.now() + 1,
        text: res.data?.analysis || 'Could not analyze performance right now.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: 'Analyze my performance',
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }, aiResponse]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Performance analysis is unavailable right now. Please try again shortly.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'AI Chatbot — Code Learn Hub';
    return () => { document.title = 'Code Learn Hub'; };
  }, []);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await chatbotAPI.getHistory();
      if (response.data && response.data.length > 0) {
        const historyMessages = response.data.map(msg => ({
          id: msg._id || Date.now(),
          text: msg.text,
          sender: msg.sender || 'ai',
          timestamp: new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages(historyMessages);
      }
    } catch (error) {
      console.log('No chat history found, starting fresh');
    }
  };

  // AI Response Generator based on query
  const generateAIResponse = (userQuery) => {
    const query = userQuery.toLowerCase();
    
    // Python responses
    if (query.includes('python')) {
      if (query.includes('list') || query.includes('array')) {
        return "In Python, lists are mutable sequences. Here's an example:\n\n```python\nmy_list = [1, 2, 3, 4, 5]\nmy_list.append(6)  # Add element\nprint(my_list)  # [1, 2, 3, 4, 5, 6]\n```\n\nLists can contain different data types and are very flexible!";
      }
      if (query.includes('function') || query.includes('def')) {
        return "Python functions are defined with `def`. Example:\n\n```python\ndef greet(name):\n    return f\"Hello, {name}!\"\n\nprint(greet(\"Developer\"))\n```\n\nFunctions can return values and accept parameters.";
      }
      if (query.includes('class') || query.includes('oop')) {
        return "Python supports Object-Oriented Programming. Here's a simple class:\n\n```python\nclass Person:\n    def __init__(self, name):\n        self.name = name\n    \n    def greet(self):\n        return f\"Hi, I'm {self.name}\"\n\nperson = Person(\"Alice\")\nprint(person.greet())\n```";
      }
      return "Python is a versatile language! I can help with:\n- Variables and data types\n- Functions and classes\n- Lists, dictionaries, tuples\n- File handling\n- Modules and packages\n\nWhat specific Python topic interests you?";
    }
    
    // C++ responses
    if (query.includes('c++') || query.includes('cpp')) {
      if (query.includes('pointer') || query.includes('memory')) {
        return "C++ pointers store memory addresses:\n\n```cpp\nint x = 10;\nint* ptr = &x;  // ptr holds address of x\ncout << *ptr;   // Dereference: outputs 10\n```\n\nPointers are powerful but require careful memory management!";
      }
      if (query.includes('class') || query.includes('object')) {
        return "C++ classes define objects:\n\n```cpp\nclass Car {\nprivate:\n    string brand;\npublic:\n    Car(string b) { brand = b; }\n    void display() { cout << brand; }\n};\n\nCar myCar(\"Toyota\");\nmyCar.display();\n```";
      }
      return "C++ is great for system programming! I can help with:\n- Variables and data types\n- Pointers and references\n- Classes and objects\n- STL containers\n- Memory management\n\nWhat C++ concept do you want to learn?";
    }
    
    // C# responses
    if (query.includes('c#') || query.includes('csharp')) {
      if (query.includes('class') || query.includes('object')) {
        return "C# classes are fundamental:\n\n```csharp\npublic class Person\n{\n    public string Name { get; set; }\n    \n    public Person(string name)\n    {\n        Name = name;\n    }\n}\n\nPerson p = new Person(\"John\");\n```";
      }
      if (query.includes('linq') || query.includes('query')) {
        return "LINQ (Language Integrated Query) in C#:\n\n```csharp\nvar numbers = new[] { 1, 2, 3, 4, 5 };\nvar evens = numbers.Where(n => n % 2 == 0);\nforeach(var n in evens)\n    Console.WriteLine(n);\n```";
      }
      return "C# is excellent for .NET development! I can help with:\n- Classes and objects\n- Properties and methods\n- LINQ queries\n- Async/await\n- Collections\n\nWhat C# topic would you like to explore?";
    }
    
    // Java responses
    if (query.includes('java')) {
      if (query.includes('class') || query.includes('object')) {
        return "Java classes define objects:\n\n```java\npublic class Student {\n    private String name;\n    \n    public Student(String name) {\n        this.name = name;\n    }\n    \n    public String getName() {\n        return name;\n    }\n}\n```";
      }
      if (query.includes('array') || query.includes('list')) {
        return "Java arrays and ArrayList:\n\n```java\n// Array\nint[] numbers = {1, 2, 3};\n\n// ArrayList\nArrayList<String> list = new ArrayList<>();\nlist.add(\"Hello\");\nlist.add(\"World\");\n```";
      }
      return "Java is platform-independent! I can help with:\n- Classes and objects\n- Inheritance and polymorphism\n- Collections (ArrayList, HashMap)\n- Exception handling\n- Multithreading\n\nWhat Java concept interests you?";
    }
    
    // React responses
    if (query.includes('react')) {
      if (query.includes('component') || query.includes('jsx')) {
        return "React components are reusable UI pieces:\n\n```jsx\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\n// Usage\n<Welcome name=\"Developer\" />\n```\n\nComponents can be functional or class-based!";
      }
      if (query.includes('hook') || query.includes('useState')) {
        return "React Hooks manage state:\n\n```jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}\n```";
      }
      if (query.includes('props') || query.includes('prop')) {
        return "Props pass data to components:\n\n```jsx\nfunction Greeting({ name, age }) {\n  return <h1>Hello {name}, you are {age}!</h1>;\n}\n\n<Greeting name=\"Alice\" age={25} />\n```\n\nProps are read-only and flow down from parent to child.";
      }
      return "React builds interactive UIs! I can help with:\n- Components and JSX\n- Props and State\n- Hooks (useState, useEffect)\n- Event handling\n- Conditional rendering\n\nWhat React topic do you want to learn?";
    }
    
    // General coding questions
    if (query.includes('hello') || query.includes('hi')) {
      return "Hello! 👋 I'm here to help you learn Python, C++, C#, Java, and React. What would you like to know?";
    }
    
    if (query.includes('help') || query.includes('what can')) {
      return "I can help you with:\n\n🐍 **Python** - Basics, OOP, data structures\n⚙️ **C++** - Pointers, classes, STL\n🔷 **C#** - .NET, LINQ, async programming\n☕ **Java** - OOP, collections, Spring\n⚛️ **React** - Components, hooks, state management\n\nJust ask me about any of these languages!";
    }
    
    // Default response
    return "That's an interesting question! I specialize in Python, C++, C#, Java, and React. Could you be more specific about which language or concept you'd like help with? I can provide:\n- Code examples\n- Explanations\n- Best practices\n- Common patterns\n\nWhat would you like to learn?";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setLoading(true);

    try {
      // Try to send to backend API
      const response = await chatbotAPI.sendMessage(userInput);
      const aiMessage = response.data.aiMessage || response.data;
      const aiResponse = {
        id: Date.now() + 1,
        text: aiMessage.text || aiMessage.response || response.data.response || generateAIResponse(userInput),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      // Fallback to local AI response if backend fails
      console.error('Chatbot API error, using fallback:', error);
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: generateAIResponse(userInput),
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

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
              AI Chatbot Assistant
            </span>
          </h1>
          <p className="text-gray-400">Get instant help with your coding questions</p>
          <p className="text-sm text-cyan-glow mt-2">Personalized for {user?.name || 'you'} based on progress, weak/strong areas, and recent quiz scores.</p>
        </motion.div>
      </section>

      {/* Chat Container */}
      <section className="container mx-auto px-4 pb-20">
        <div className="glass rounded-custom border border-white/20 overflow-hidden flex flex-col" style={{ height: '600px' }}>
          {/* Chat Header */}
          <div className="bg-dark-blue-gray px-6 py-4 border-b border-white/10 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-primary to-neon-purple flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Assistant</h3>
              <p className="text-xs text-gray-400">Online • Ready to help</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] rounded-custom p-4 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-primary to-neon-purple'
                    : 'glass border border-white/20'
                }`}>
                  <div className="text-white whitespace-pre-wrap font-sans">
                    {message.text.split('```').map((part, index) => {
                      if (index % 2 === 1) {
                        // Code block
                        const lines = part.split('\n');
                        const lang = lines[0] || '';
                        const code = lines.slice(1).join('\n');
                        return (
                          <div key={index} className="bg-deep-navy rounded-lg p-3 my-2 font-mono text-sm overflow-x-auto">
                            {lang && <div className="text-cyan-glow text-xs mb-2">{lang}</div>}
                            <pre className="text-gray-200">{code}</pre>
                          </div>
                        );
                      }
                      return <span key={index}>{part}</span>;
                    })}
                  </div>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-indigo-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="border-t border-white/10 p-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about coding..."
                className="flex-1 bg-dark-blue-gray border border-white/20 rounded-custom px-4 py-3 text-white focus:outline-none focus:border-cyan-glow transition-all"
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-primary to-neon-purple rounded-custom font-semibold hover:shadow-glow-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : 'Send'}
              </motion.button>
            </div>
          </form>
        </div>

        {/* Quick Suggestions */}
        <div className="mt-6">
          <p className="text-gray-400 mb-3 text-sm">Quick questions about our 5 languages:</p>
          <div className="mb-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAnalyzePerformance}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-glow/30 to-indigo-primary/30 border border-cyan-glow/40 text-cyan-glow text-sm"
            >
              Analyze my performance
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'Python functions',
              'React hooks',
              'C++ pointers',
              'Java classes',
              'C# LINQ',
              'Python lists',
              'React components',
              'C++ classes'
            ].map((suggestion, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => sendQuickPrompt(suggestion)}
                className="px-4 py-2 glass rounded-full text-sm border border-white/20 hover:border-cyan-glow transition-all"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chatbot;

