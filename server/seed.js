import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Module from './models/Module.js';
import Badge from './models/Badge.js';

dotenv.config();

const modules = [
  {
    title: 'Python Fundamentals',
    language: 'Python',
    difficulty: 'Beginner',
    icon: '🐍',
    description: 'Master the fundamentals of Python programming including variables, data types, functions, and control structures.',
    totalLessons: 15,
    lessons: [
      {
        title: 'Introduction to Python',
        content: 'Python is a high-level, interpreted programming language known for its simplicity and readability. It supports multiple programming paradigms including procedural, object-oriented, and functional programming.',
        examples: [
          'print("Hello, World!")',
          '# Python uses indentation for code blocks\nif True:\n    print("This is Python")'
        ],
        order: 1
      },
      {
        title: 'Variables and Data Types',
        content: 'Python has dynamic typing. Variables can hold different types: integers, floats, strings, booleans, lists, dictionaries, and more.',
        examples: [
          'x = 10  # Integer\nname = "Python"  # String\nis_active = True  # Boolean',
          'numbers = [1, 2, 3, 4, 5]  # List\nperson = {"name": "John", "age": 30}  # Dictionary'
        ],
        order: 2
      },
      {
        title: 'Functions',
        content: 'Functions in Python are defined using the def keyword. They can take parameters and return values.',
        videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
        examples: [
          'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))',
          'def add(a, b):\n    return a + b\n\nresult = add(5, 3)  # Returns 8'
        ],
        order: 3
      }
    ],
    quiz: [
      {
        question: 'What keyword is used to define a function in Python?',
        options: ['function', 'def', 'func', 'define'],
        correctAnswer: 1,
        explanation: 'In Python, functions are defined using the "def" keyword followed by the function name and parameters.',
        order: 1
      },
      {
        question: 'Which of the following is a valid Python variable name?',
        options: ['2variable', 'my-variable', 'my_variable', 'my variable'],
        correctAnswer: 2,
        explanation: 'Python variable names can contain letters, numbers, and underscores, but cannot start with a number or contain hyphens.',
        order: 2
      },
      {
        question: 'What is the output of: print(type(5))?',
        options: ['<class "int">', '<class "str">', '<class "float">', '5'],
        correctAnswer: 0,
        explanation: 'The type() function returns the type of an object. For the integer 5, it returns <class "int">.',
        order: 3
      },
      {
        question: 'How do you create a list in Python?',
        options: ['list = {}', 'list = []', 'list = ()', 'list = <>'],
        correctAnswer: 1,
        explanation: 'Lists in Python are created using square brackets []. Curly braces {} are for dictionaries, and parentheses () are for tuples.',
        order: 4
      },
      {
        question: 'What does the len() function do?',
        options: ['Returns the length of a string or list', 'Converts to lowercase', 'Rounds a number', 'Imports a module'],
        correctAnswer: 0,
        explanation: 'The len() function returns the number of items in an object, such as the length of a string, list, or dictionary.',
        order: 5
      }
    ]
  },
  {
    title: 'Python Advanced',
    language: 'Python',
    difficulty: 'Advanced',
    icon: '🐍',
    totalLessons: 20,
    lessons: [
      { title: 'Advanced OOP', content: 'Object-oriented programming', order: 1 },
      { title: 'Decorators', content: 'Python decorators', order: 2 }
    ]
  },
  {
    title: 'C++ Basics',
    language: 'C++',
    difficulty: 'Beginner',
    icon: '⚙️',
    description: 'Learn the fundamentals of C++ programming including syntax, data types, and basic operations.',
    totalLessons: 18,
    lessons: [
      {
        title: 'C++ Introduction',
        content: 'C++ is a powerful, general-purpose programming language. It supports both procedural and object-oriented programming paradigms.',
        videoUrl: 'https://www.youtube.com/embed/vLnPwxZdW4Y',
        examples: [
          '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!";\n    return 0;\n}'
        ],
        order: 1
      },
      {
        title: 'Variables and Types',
        content: 'C++ has strong typing. Common types include int, float, double, char, bool, and string.',
        examples: [
          'int age = 25;\nfloat price = 19.99;\nchar grade = \'A\';\nbool isActive = true;'
        ],
        order: 2
      }
    ],
    quiz: [
      {
        question: 'What header file is needed for input/output in C++?',
        options: ['<stdio.h>', '<iostream>', '<input.h>', '<io.h>'],
        correctAnswer: 1,
        explanation: '<iostream> is the standard header file for input/output operations in C++.',
        order: 1
      },
      {
        question: 'What is the correct way to declare a variable in C++?',
        options: ['variable x = 5;', 'var x = 5;', 'int x = 5;', 'x = 5;'],
        correctAnswer: 2,
        explanation: 'In C++, you must specify the data type when declaring a variable, e.g., int x = 5;',
        order: 2
      },
      {
        question: 'What does the "using namespace std;" statement do?',
        options: ['Imports a library', 'Allows use of standard library without std:: prefix', 'Defines a new namespace', 'Declares a variable'],
        correctAnswer: 1,
        explanation: 'It allows you to use standard library functions and objects without the std:: prefix.',
        order: 3
      },
      {
        question: 'What is the entry point of a C++ program?',
        options: ['start()', 'main()', 'begin()', 'init()'],
        correctAnswer: 1,
        explanation: 'Every C++ program must have a main() function as its entry point.',
        order: 4
      },
      {
        question: 'What operator is used for output in C++?',
        options: ['print', 'cout', 'output', 'display'],
        correctAnswer: 1,
        explanation: 'cout (console output) is used with the << operator to output data in C++.',
        order: 5
      }
    ]
  },
  {
    title: 'C++ Object-Oriented Programming',
    language: 'C++',
    difficulty: 'Intermediate',
    icon: '⚙️',
    totalLessons: 22,
    lessons: [
      { title: 'Classes and Objects', content: 'OOP in C++', order: 1 }
    ]
  },
  {
    title: 'C# Fundamentals',
    language: 'C#',
    difficulty: 'Beginner',
    icon: '🔷',
    totalLessons: 16,
    lessons: [
      { title: 'C# Basics', content: 'Introduction to C#', videoUrl: 'https://www.youtube.com/embed/GhQdlIFylQ8', order: 1 }
    ]
  },
  {
    title: 'C# .NET Development',
    language: 'C#',
    difficulty: 'Intermediate',
    icon: '🔷',
    totalLessons: 25,
    lessons: [
      { title: '.NET Framework', content: 'Building .NET apps', videoUrl: 'https://www.youtube.com/embed/C5cnZ-gMpbo', order: 1 }
    ]
  },
  {
    title: 'Java Basics',
    language: 'Java',
    difficulty: 'Beginner',
    icon: '☕',
    totalLessons: 14,
    lessons: [
      { title: 'Java Introduction', content: 'Getting started', videoUrl: 'https://www.youtube.com/embed/eIrMbAQW0pE', order: 1 }
    ]
  },
  {
    title: 'Java Spring Framework',
    language: 'Java',
    difficulty: 'Advanced',
    icon: '☕',
    totalLessons: 28,
    lessons: [
      { title: 'Spring Basics', content: 'Spring framework intro', videoUrl: 'https://www.youtube.com/embed/If1Lw4pL0d4', order: 1 }
    ]
  },
  {
    title: 'React Fundamentals',
    language: 'React',
    difficulty: 'Beginner',
    icon: '⚛️',
    description: 'Learn React from scratch - components, JSX, props, state, and hooks.',
    totalLessons: 20,
    lessons: [
      {
        title: 'React Introduction',
        content: 'React is a JavaScript library for building user interfaces. It uses a component-based architecture and virtual DOM for efficient rendering.',
        videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
        examples: [
          'import React from "react";\n\nfunction App() {\n  return <h1>Hello, React!</h1>;\n}',
          '// JSX allows you to write HTML-like syntax in JavaScript\nconst element = <div>Welcome to React</div>;'
        ],
        order: 1
      },
      {
        title: 'Components',
        content: 'Components are reusable pieces of UI. They can be functional (using functions) or class-based (using classes).',
        examples: [
          'function Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}',
          '// Using the component\n<Welcome name="Developer" />'
        ],
        order: 2
      }
    ],
    quiz: [
      {
        question: 'What is JSX in React?',
        options: ['A JavaScript framework', 'A syntax extension for JavaScript', 'A CSS preprocessor', 'A database'],
        correctAnswer: 1,
        explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript files.',
        order: 1
      },
      {
        question: 'What hook is used to manage state in functional components?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 1,
        explanation: 'useState is the hook used to add state to functional components in React.',
        order: 2
      },
      {
        question: 'How do you pass data to a component?',
        options: ['Using state', 'Using props', 'Using context', 'Using refs'],
        correctAnswer: 1,
        explanation: 'Props (short for properties) are used to pass data from parent components to child components.',
        order: 3
      },
      {
        question: 'What does useEffect hook do?',
        options: ['Manages component state', 'Handles side effects', 'Creates new components', 'Imports modules'],
        correctAnswer: 1,
        explanation: 'useEffect is used to perform side effects in functional components, such as data fetching or DOM manipulation.',
        order: 4
      },
      {
        question: 'What is the virtual DOM?',
        options: ['A real DOM element', 'A JavaScript representation of the DOM', 'A CSS framework', 'A database'],
        correctAnswer: 1,
        explanation: 'The virtual DOM is a JavaScript representation of the real DOM that React uses to optimize updates.',
        order: 5
      }
    ]
  },
  {
    title: 'React Advanced Patterns',
    language: 'React',
    difficulty: 'Advanced',
    icon: '⚛️',
    totalLessons: 24,
    lessons: [
      { title: 'Advanced Hooks', content: 'Custom hooks', order: 1 }
    ]
  }
];

const badges = [
  {
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🌱',
    criteria: { type: 'lessons_completed', value: 1 },
    pointsReward: 50
  },
  {
    name: 'Code Warrior',
    description: 'Complete 10 coding challenges',
    icon: '⚔️',
    criteria: { type: 'lessons_completed', value: 10 },
    pointsReward: 200
  },
  {
    name: 'Perfect Score',
    description: 'Get 100% on a quiz',
    icon: '💯',
    criteria: { type: 'points', value: 1000 },
    pointsReward: 300
  },
  {
    name: 'Week Warrior',
    description: 'Practice 7 days in a row',
    icon: '🔥',
    criteria: { type: 'streak', value: 7 },
    pointsReward: 500
  },
  {
    name: 'Master Coder',
    description: 'Complete all advanced modules',
    icon: '👑',
    criteria: { type: 'modules_completed', value: 5 },
    pointsReward: 1000
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codelearnhub');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Module.deleteMany({});
    await Badge.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert modules
    await Module.insertMany(modules);
    console.log(`✅ Inserted ${modules.length} modules`);

    // Insert badges
    await Badge.insertMany(badges);
    console.log(`✅ Inserted ${badges.length} badges`);

    // Create default user
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (!existingUser) {
      const user = new User({
        name: 'Test Student',
        email: 'test@example.com',
        password: 'password123', // Will be hashed by pre-save hook
        role: 'student',
        points: 100,
        level: 2
      });
      await user.save();
      console.log('✅ Created default user: test@example.com / password123');
    } else {
      console.log('ℹ️  Default user already exists');
    }

    console.log('🎉 Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();


