import User from '../models/User.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import Badge from '../models/Badge.js';

export const seedDemoData = async () => {
    try {
        console.log("Checking demo data requirements...");

        let demoUser = await User.findOne({ email: 'demo@codelearn.com' });
        if (!demoUser) {
            demoUser = new User({
                name: 'Demo User',
                email: 'demo@codelearn.com',
                password: 'password123'  // Note: user requested demo123 but bcrypt hashes it during save
            });
            demoUser.password = 'demo123'; // pre-save hook handles the hash
            await demoUser.save();
            console.log('✅ Created demo user account');
        }

        const count = await Module.countDocuments();
        if (count === 0) {
            console.log('Database empty, instantly seeding default modules...');

            const badges = [
                { name: "First Step", description: "Complete your first lesson", icon: "🌱", requirement: "1 lesson", points: 10 },
                { name: "Python Rookie", description: "Complete all Python Beginner lessons", icon: "🐍", requirement: "Python Beginner 100%", points: 50 },
                { name: "Python Master", description: "Complete all Python Advanced lessons", icon: "👑", requirement: "Python Advanced 100%", points: 100 },
                { name: "React Developer", description: "Complete all React lessons", icon: "⚛️", requirement: "Any React Module 100%", points: 100 },
                { name: "Code Warrior", description: "Complete 5 modules", icon: "⚔️", requirement: "5 Modules", points: 200 },
                { name: "Streak Master", description: "7 day learning streak", icon: "🔥", requirement: "7 Days", points: 150 },
                { name: "Perfect Score", description: "Score 100% on any module", icon: "⭐", requirement: "100%", points: 75 },
            ];
            await Badge.insertMany(badges);

            const mods = [
                { title: "Python Beginner", language: "python", difficulty: "beginner", description: "Learn Python basics including types and functions.", lessonCount: 2, icon: "🐍" },
                { title: "Python Advanced", language: "python", difficulty: "advanced", description: "Advanced architectures.", lessonCount: 1, icon: "🐍" },
                { title: "React Fundamentals", language: "javascript", difficulty: "intermediate", description: "Learn React Hooks.", lessonCount: 1, icon: "⚛️" },
                { title: "C++ Core", language: "cpp", difficulty: "beginner", description: "Learn C++ basics.", lessonCount: 1, icon: "💻" },
                { title: "Algorithm Data Structures", language: "java", difficulty: "intermediate", description: "Core maps and graphs natively built.", lessonCount: 1, icon: "☕" },
                { title: "Web Basics HTML", language: "javascript", difficulty: "beginner", description: "Static DOM builds.", lessonCount: 1, icon: "🌐" },
                { title: "C# Gaming Basics", language: "csharp", difficulty: "intermediate", description: "DotNet objects.", lessonCount: 1, icon: "🎯" },
                { title: "Advanced Javascript", language: "javascript", difficulty: "advanced", description: "Async workers API.", lessonCount: 1, icon: "JS" }
            ];
            const createdMods = await Module.insertMany(mods);

            const lessons = [];
            for (let m of createdMods) {
                lessons.push({
                    moduleId: m._id,
                    title: "Introduction to " + m.title,
                    content: "## Welcome \n This is a fully populated demo lesson pre-loaded from cloud architecture instantly. \n\n ### Getting Started \n Follow the exercises inside the IDE securely to progress.",
                    codeExample: "print('Hello Learning Journey!')",
                    language: m.language,
                    order: 1
                });
                if (m.title === "Python Beginner") {
                    lessons.push({
                        moduleId: m._id,
                        title: "Control Flow Python",
                        content: "## Conditions \n Learn about explicit loops and conditions natively.",
                        codeExample: "for i in range(5):\n  print(i)",
                        language: "python",
                        order: 2
                    })
                }
            }
            await Lesson.insertMany(lessons);
            console.log('✅ Seeded demo modules and active badges seamlessly!');
        }
    } catch (e) {
        console.error("Seeder error:", e);
    }
};
