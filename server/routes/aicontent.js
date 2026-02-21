import express from 'express';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import Module from '../models/Module.js';

const router = express.Router();

// Generate AI content based on user progress and preferences
router.post('/generate', authenticate, async (req, res) => {
  try {
    const { topic, language, difficulty, contentType } = req.body;
    const userId = req.userId;

    // Get user progress to personalize content
    const user = await User.findById(userId);
    const userProgress = await Progress.find({ userId }).populate('moduleId');

    // Determine user's skill level based on progress
    const completedModules = userProgress.filter(p => p.isCompleted).length;
    const avgProgress = userProgress.length > 0
      ? userProgress.reduce((sum, p) => sum + p.progressPercentage, 0) / userProgress.length
      : 0;

    let skillLevel = 'Beginner';
    if (completedModules > 5 || avgProgress > 70) {
      skillLevel = 'Advanced';
    } else if (completedModules > 2 || avgProgress > 40) {
      skillLevel = 'Intermediate';
    }

    // Generate content based on type
    const content = generateContent({
      topic: topic || 'general programming',
      language: language || 'Python',
      difficulty: difficulty || skillLevel,
      contentType: contentType || 'lesson',
      userProgress: completedModules
    });

    res.json({
      content,
      skillLevel,
      personalized: true,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function generateContent({ topic, language, difficulty, contentType, userProgress }) {
  const languageTemplates = {
    Python: {
      lesson: `# ${topic} in Python\n\nPython is perfect for ${topic}. Here's a comprehensive lesson:\n\n## Introduction\n\n${topic} is a fundamental concept in Python programming. Let's explore how to implement it.\n\n## Basic Example\n\n\`\`\`python\ndef ${topic.toLowerCase().replace(/\s+/g, '_')}():\n    """${topic} implementation"""\n    # Your code here\n    pass\n\`\`\`\n\n## Key Concepts\n\n1. Understanding the basics\n2. Practical applications\n3. Best practices\n\n## Practice Exercise\n\nTry implementing ${topic} in your own project!`,
      example: `# ${topic} Example\n\n\`\`\`python\n# ${difficulty} level example\n\ndef example():\n    """${topic} demonstration"""\n    result = process_${topic.toLowerCase().replace(/\s+/g, '_')}()\n    return result\n\n# Usage\nif __name__ == "__main__":\n    example()\n\`\`\``,
      exercise: `# ${topic} Exercise\n\n## Challenge\n\nCreate a ${language} program that demonstrates ${topic}.\n\n## Requirements\n\n- Use proper ${language} syntax\n- Include error handling\n- Add comments explaining your code\n\n## Solution Template\n\n\`\`\`python\n# Your solution here\n\`\`\``
    },
    React: {
      lesson: `# ${topic} in React\n\nReact makes ${topic} easy to implement. Here's how:\n\n## Introduction\n\n${topic} is essential for building modern React applications.\n\n## Component Example\n\n\`\`\`jsx\nimport React from 'react';\n\nfunction ${topic.replace(/\s+/g, '')}Component() {\n  return (\n    <div>\n      <h1>${topic}</h1>\n      {/* Your implementation */}\n    </div>\n  );\n}\n\`\`\``,
      example: `# ${topic} React Example\n\n\`\`\`jsx\nfunction Example() {\n  const [state, setState] = useState(null);\n  \n  return <div>${topic} implementation</div>;\n}\n\`\`\``,
      exercise: `# ${topic} Exercise\n\nCreate a React component that implements ${topic}.\n\n## Requirements\n- Use functional components\n- Implement state management\n- Add proper styling`
    },
    'C++': {
      lesson: `// ${topic} in C++\n\n${topic} is a core concept in C++ programming.\n\n## Implementation\n\n\`\`\`cpp\n#include <iostream>\nusing namespace std;\n\nclass ${topic.replace(/\s+/g, '')} {\npublic:\n    void implement() {\n        // ${topic} implementation\n    }\n};\n\`\`\``,
      example: `// ${topic} Example\n\n\`\`\`cpp\n// ${difficulty} level example\nint main() {\n    // Your code here\n    return 0;\n}\n\`\`\``,
      exercise: `// ${topic} Exercise\n\nImplement ${topic} in C++ with proper memory management.`
    },
    'C#': {
      lesson: `// ${topic} in C#\n\n${topic} in C# is straightforward with the .NET framework.\n\n\`\`\`csharp\npublic class ${topic.replace(/\s+/g, '')}\n{\n    public void Implement()\n    {\n        // Implementation\n    }\n}\n\`\`\``,
      example: `// ${topic} Example\n\n\`\`\`csharp\npublic class Example\n{\n    // Your code\n}\n\`\`\``,
      exercise: `// ${topic} Exercise\n\nCreate a C# class that implements ${topic}.`
    },
    Java: {
      lesson: `// ${topic} in Java\n\n${topic} is fundamental in Java programming.\n\n\`\`\`java\npublic class ${topic.replace(/\s+/g, '')} {\n    public void implement() {\n        // Implementation\n    }\n}\n\`\`\``,
      example: `// ${topic} Example\n\n\`\`\`java\npublic class Example {\n    // Your code\n}\n\`\`\``,
      exercise: `// ${topic} Exercise\n\nImplement ${topic} following Java best practices.`
    }
  };

  const template = languageTemplates[language] || languageTemplates.Python;
  return template[contentType] || template.lesson;
}

export default router;

