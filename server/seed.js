import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Module from './models/Module.js';
import Badge from './models/Badge.js';

dotenv.config({ path: './server/.env' });

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
    title: 'Python Intermediate',
    language: 'Python',
    difficulty: 'Intermediate',
    icon: '🐍',
    description: 'Dive deeper into Python with OOP, file handling, and modules.',
    totalLessons: 18,
    lessons: [
      { title: 'Object Oriented Programming', content: 'Learn classes, objects, inheritance and polymorphism in Python.', order: 1 },
      { title: 'File Handling', content: 'Read and write files using Python built-in functions.', order: 2 }
    ],
    quiz: [
      {
        question: 'Which keyword is used to create a class in Python?',
        options: ['class', 'object', 'def', 'type'],
        correctAnswer: 0,
        explanation: 'The class keyword is used to define a class in Python.',
        order: 1
      }
    ]
  },
  {
    title: 'Python Advanced',
    language: 'Python',
    difficulty: 'Advanced',
    icon: '🐍',
    description: 'Master advanced Python concepts including decorators, generators, and async programming.',
    totalLessons: 20,
    lessons: [
      { title: 'Decorators', content: 'Python decorators allow you to modify the behavior of functions.', order: 1 },
      { title: 'Generators', content: 'Generators are functions that return an iterator.', order: 2 }
    ],
    quiz: [
      {
        question: 'What symbol is used to apply a decorator in Python?',
        options: ['#', '@', '$', '&'],
        correctAnswer: 1,
        explanation: 'The @ symbol is used to apply a decorator to a function in Python.',
        order: 1
      }
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
        question: 'What is the entry point of a C++ program?',
        options: ['start()', 'main()', 'begin()', 'init()'],
        correctAnswer: 1,
        explanation: 'Every C++ program must have a main() function as its entry point.',
        order: 2
      }
    ]
  },
  {
    title: 'C++ Object-Oriented Programming',
    language: 'C++',
    difficulty: 'Intermediate',
    icon: '⚙️',
    description: 'Master OOP concepts in C++ including classes, inheritance, and polymorphism.',
    totalLessons: 22,
    lessons: [
      { title: 'Classes and Objects', content: 'Learn how to create and use classes and objects in C++.', order: 1 },
      { title: 'Inheritance', content: 'Inheritance allows a class to inherit properties from another class.', order: 2 }
    ],
    quiz: [
      {
        question: 'Which access specifier allows access from anywhere?',
        options: ['private', 'protected', 'public', 'internal'],
        correctAnswer: 2,
        explanation: 'Public members are accessible from anywhere in the program.',
        order: 1
      }
    ]
  },
  {
    title: 'C++ Advanced',
    language: 'C++',
    difficulty: 'Advanced',
    icon: '⚙️',
    description: 'Advanced C++ including templates, STL, and memory management.',
    totalLessons: 25,
    lessons: [
      { title: 'Templates', content: 'Templates allow you to write generic code in C++.', order: 1 }
    ],
    quiz: [
      {
        question: 'What keyword is used to define a template in C++?',
        options: ['generic', 'template', 'type', 'class'],
        correctAnswer: 1,
        explanation: 'The template keyword is used to define a template in C++.',
        order: 1
      }
    ]
  },
  {
    title: 'C# Fundamentals',
    language: 'C#',
    difficulty: 'Beginner',
    icon: '🔷',
    description: 'Learn C# basics including syntax, data types, and control structures.',
    totalLessons: 16,
    lessons: [
      { title: 'C# Basics', content: 'Introduction to C# programming language and .NET framework.', videoUrl: 'https://www.youtube.com/embed/GhQdlIFylQ8', order: 1 }
    ],
    quiz: [
      {
        question: 'What is the file extension for C# files?',
        options: ['.java', '.cpp', '.cs', '.py'],
        correctAnswer: 2,
        explanation: 'C# files use the .cs file extension.',
        order: 1
      }
    ]
  },
  {
    title: 'C# .NET Development',
    language: 'C#',
    difficulty: 'Intermediate',
    icon: '🔷',
    description: 'Build real applications using C# and the .NET framework.',
    totalLessons: 25,
    lessons: [
      { title: '.NET Framework', content: 'Building .NET applications with C#.', videoUrl: 'https://www.youtube.com/embed/C5cnZ-gMpbo', order: 1 }
    ],
    quiz: [
      {
        question: 'What does LINQ stand for?',
        options: ['Language Integrated Query', 'Linear Query', 'Linked Query', 'List Query'],
        correctAnswer: 0,
        explanation: 'LINQ stands for Language Integrated Query, a feature of C# for querying data.',
        order: 1
      }
    ]
  },
  {
    title: 'Java Basics',
    language: 'Java',
    difficulty: 'Beginner',
    icon: '☕',
    description: 'Learn Java fundamentals including OOP concepts and basic syntax.',
    totalLessons: 14,
    lessons: [
      { title: 'Java Introduction', content: 'Getting started with Java programming.', videoUrl: 'https://www.youtube.com/embed/eIrMbAQW0pE', order: 1 }
    ],
    quiz: [
      {
        question: 'What is the main method signature in Java?',
        options: ['public void main()', 'public static void main(String[] args)', 'static main()', 'void main(String args)'],
        correctAnswer: 1,
        explanation: 'The correct main method signature in Java is public static void main(String[] args).',
        order: 1
      }
    ]
  },
  {
    title: 'Java Spring Framework',
    language: 'Java',
    difficulty: 'Advanced',
    icon: '☕',
    description: 'Build enterprise applications using the Java Spring Framework.',
    totalLessons: 28,
    lessons: [
      { title: 'Spring Basics', content: 'Introduction to the Spring framework for Java.', videoUrl: 'https://www.youtube.com/embed/If1Lw4pL0d4', order: 1 }
    ],
    quiz: [
      {
        question: 'What annotation marks a class as a Spring component?',
        options: ['@Bean', '@Component', '@Service', '@Controller'],
        correctAnswer: 1,
        explanation: '@Component marks a class as a Spring-managed component.',
        order: 1
      }
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
          'const element = <div>Welcome to React</div>;'
        ],
        order: 1
      },
      {
        title: 'Components and Props',
        content: 'Components are reusable pieces of UI. Props are used to pass data between components.',
        examples: [
          'function Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}',
          '<Welcome name="Developer" />'
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
      }
    ]
  },
  {
    title: 'React Advanced Patterns',
    language: 'React',
    difficulty: 'Advanced',
    icon: '⚛️',
    description: 'Master advanced React patterns including custom hooks, context, and performance optimization.',
    totalLessons: 24,
    lessons: [
      { title: 'Custom Hooks', content: 'Custom hooks allow you to extract and reuse stateful logic.', order: 1 },
      { title: 'Context API', content: 'Context provides a way to pass data through the component tree without props.', order: 2 }
    ],
    quiz: [
      {
        question: 'What must a custom hook name start with?',
        options: ['get', 'use', 'hook', 'custom'],
        correctAnswer: 1,
        explanation: 'Custom hooks must start with "use" to follow React conventions.',
        order: 1
      }
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
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Module.deleteMany({});
    await Badge.deleteMany({});
    console.log('✅ Cleared existing data');

    await Module.insertMany(modules);
    console.log(`✅ Inserted ${modules.length} modules`);

    await Badge.insertMany(badges);
    console.log(`✅ Inserted ${badges.length} badges`);

    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (!existingUser) {
      const user = new User({
        name: 'Test Student',
        email: 'test@example.com',
        password: 'password123',
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