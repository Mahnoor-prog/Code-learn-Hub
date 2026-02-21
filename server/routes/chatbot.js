import express from 'express';
import ChatHistory from '../models/ChatHistory.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// AI Response Generator (same logic as frontend)
const generateAIResponse = (userQuery) => {
  const query = userQuery.toLowerCase();
  
  if (query.includes('python')) {
    if (query.includes('list') || query.includes('array')) {
      return "In Python, lists are mutable sequences. Here's an example:\n\n```python\nmy_list = [1, 2, 3, 4, 5]\nmy_list.append(6)  # Add element\nprint(my_list)  # [1, 2, 3, 4, 5, 6]\n```\n\nLists can contain different data types and are very flexible!";
    }
    if (query.includes('function') || query.includes('def')) {
      return "Python functions are defined with `def`. Example:\n\n```python\ndef greet(name):\n    return f\"Hello, {name}!\"\n\nprint(greet(\"Developer\"))\n```\n\nFunctions can return values and accept parameters.";
    }
    return "Python is a versatile language! I can help with variables, functions, classes, lists, dictionaries, and more. What specific Python topic interests you?";
  }
  
  if (query.includes('c++') || query.includes('cpp')) {
    if (query.includes('pointer')) {
      return "C++ pointers store memory addresses:\n\n```cpp\nint x = 10;\nint* ptr = &x;\ncout << *ptr;  // Outputs 10\n```\n\nPointers are powerful but require careful memory management!";
    }
    return "C++ is great for system programming! I can help with pointers, classes, STL containers, and memory management.";
  }
  
  if (query.includes('c#') || query.includes('csharp')) {
    return "C# is excellent for .NET development! I can help with classes, LINQ, async/await, and collections.";
  }
  
  if (query.includes('java')) {
    return "Java is platform-independent! I can help with classes, collections, exception handling, and multithreading.";
  }
  
  if (query.includes('react')) {
    if (query.includes('hook') || query.includes('usestate')) {
      return "React Hooks manage state:\n\n```jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}\n```";
    }
    return "React builds interactive UIs! I can help with components, hooks, props, state management, and event handling.";
  }
  
  if (query.includes('hello') || query.includes('hi')) {
    return "Hello! 👋 I'm here to help you learn Python, C++, C#, Java, and React. What would you like to know?";
  }
  
  return "That's an interesting question! I specialize in Python, C++, C#, Java, and React. Could you be more specific about which language or concept you'd like help with?";
};

// Get chat history
router.get('/history', authenticate, async (req, res) => {
  try {
    let chatHistory = await ChatHistory.findOne({ userId: req.userId });
    
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        userId: req.userId,
        messages: [{
          text: "Hello! I'm your AI coding assistant. I can help you with Python, C++, C#, Java, and React. What would you like to learn today?",
          sender: 'ai'
        }]
      });
      await chatHistory.save();
    }
    
    res.json(chatHistory.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message
router.post('/message', authenticate, async (req, res) => {
  try {
    const { text } = req.body;
    
    let chatHistory = await ChatHistory.findOne({ userId: req.userId });
    
    if (!chatHistory) {
      chatHistory = new ChatHistory({ userId: req.userId, messages: [] });
    }
    
    // Add user message
    chatHistory.messages.push({
      text,
      sender: 'user',
      timestamp: new Date()
    });
    
    // Generate AI response
    const aiResponse = generateAIResponse(text);
    chatHistory.messages.push({
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    });
    
    await chatHistory.save();
    
    res.json({
      response: aiResponse,
      aiMessage: chatHistory.messages[chatHistory.messages.length - 1],
      userMessage: chatHistory.messages[chatHistory.messages.length - 2]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


