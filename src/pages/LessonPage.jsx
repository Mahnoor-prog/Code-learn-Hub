import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { API_URL } from '../config.js';
import { useAuth } from '../context/AuthContext';

const normalizeLessonContent = (payload) => {
    if (!payload) return { content: '', codeExample: '', exercise: '' };
    if (typeof payload === 'string') return { content: payload, codeExample: '', exercise: '' };
    return {
        content: typeof payload.content === 'string'
            ? payload.content
            : payload.explanation || payload.introduction || payload.summary || '',
        codeExample: typeof payload.codeExample === 'string' ? payload.codeExample : '',
        exercise: payload.exercise || ''
    };
};

const normalizeQuizData = (quiz) => {
    if (!Array.isArray(quiz)) return [];
    return quiz
        .map((q) => {
            const options = Array.isArray(q?.options) ? q.options.slice(0, 4) : [];
            const correctAnswer = Number(q?.correctAnswer);
            return {
                question: q?.question || q?.questionText || '',
                options,
                correctAnswer: Number.isInteger(correctAnswer) ? correctAnswer : 0
            };
        })
        .filter((q) => q.question && q.options.length === 4)
        .slice(0, 5);
};

const LessonQuiz = ({ quizData, onComplete }) => {
    const [answers, setAnswers] = useState({});

    const handleSelect = (qIndex, optionIndex) => {
        setAnswers({ ...answers, [qIndex]: optionIndex });
    };

    const handleSubmit = () => {
        if (Object.keys(answers).length < quizData.length) {
            alert("Please answer all questions before submitting.");
            return;
        }
        
        let score = 0;
        quizData.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) score++;
        });

        onComplete(score, quizData.length);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <h2 className="text-3xl font-bold text-cyan-glow mb-2">Lesson Quiz</h2>
            <p className="text-gray-400 mb-8">You must score at least 3/5 to unlock the next lesson.</p>
            
            {quizData.map((q, qIndex) => (
                <div key={qIndex} className="glass p-6 rounded-xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                    <p className="text-xl text-white mb-6 font-semibold"><span className="text-cyan-glow mr-2">Q{qIndex + 1}.</span>{q.question}</p>
                    <div className="space-y-3">
                        {q.options.map((opt, oIndex) => {
                            const isSelected = answers[qIndex] === oIndex;
                            return (
                                <button
                                    key={oIndex}
                                    onClick={() => handleSelect(qIndex, oIndex)}
                                    className={`w-full text-left px-5 py-4 rounded-lg border transition-all ${
                                        isSelected 
                                        ? 'bg-gradient-to-r from-indigo-primary/50 to-neon-purple/50 border-cyan-glow text-white shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                                        : 'glass border-white/20 text-gray-300 hover:border-indigo-400 hover:bg-white/5'
                                    }`}
                                >
                                    <span className="font-bold text-indigo-400 mr-3">{String.fromCharCode(65 + oIndex)}.</span> 
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
            <div className="flex justify-end pt-6">
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    className="px-10 py-4 bg-gradient-to-r from-neon-purple to-cyan-glow rounded-full font-bold text-white shadow-glow-cyan transition-all text-lg"
                >
                    Submit Answers
                </motion.button>
            </div>
        </div>
    );
};

const LessonPage = () => {
    const { user } = useAuth();
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [activeLessonId, setActiveLessonId] = useState(null);
    const [activeLessonContent, setActiveLessonContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingContent, setLoadingContent] = useState(false);
    const [extProgress, setExtProgress] = useState(0); // 0 to 100
    const [showBadge, setShowBadge] = useState(false);
    
    const [viewMode, setViewMode] = useState('lesson'); // 'lesson' | 'quiz'
    const [mustReviewLesson, setMustReviewLesson] = useState(false);
    const [lessonStartTs, setLessonStartTs] = useState(Date.now());
    const [adaptiveFeedback, setAdaptiveFeedback] = useState(null);
    const [extraPracticeLessons, setExtraPracticeLessons] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        loadLessons();
        fetchProgress();
    }, [moduleId]);

    // Dynamic page title
    useEffect(() => {
        const lesson = lessons.find(l => l._id === activeLessonId);
        if (lesson?.title) {
            document.title = `${lesson.title} — Code Learn Hub`;
        } else {
            document.title = 'Lessons — Code Learn Hub';
        }
        return () => { document.title = 'Code Learn Hub'; };
    }, [activeLessonId, lessons]);

    useEffect(() => {
        if (!activeLessonId || !lessons.length) return;
        const activeLesson = lessons.find(l => l._id === activeLessonId);
        if (!activeLesson) return;

        setViewMode('lesson'); // Reset to lesson mode when switching lessons
        setLessonStartTs(Date.now());
        setAdaptiveFeedback(null);
        setExtraPracticeLessons([]);

        const fetchContent = async () => {
            const cacheKey = `lesson_${moduleId}_${activeLesson.order}`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const normalizedCachedLesson = normalizeLessonContent(JSON.parse(cached));
                setActiveLessonContent(normalizedCachedLesson);
                return;
            }

            setLoadingContent(true);
            try {
                const response = await fetch(`${API_URL}/modules/${moduleId}/lessons/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lessonNumber: activeLesson.order,
                        language: activeLesson.language,
                        level: activeLesson.level
                    })
                });
                const data = await response.json();
                const normalizedLesson = normalizeLessonContent(data);
                localStorage.setItem(cacheKey, JSON.stringify(normalizedLesson));
                setActiveLessonContent(normalizedLesson);
            } catch (err) {
                console.error(err);
                setActiveLessonContent({ content: "Failed to load AI content. Please try again." });
            } finally {
                setLoadingContent(false);
            }
        };

        fetchContent();
    }, [activeLessonId, lessons, moduleId]);

    useEffect(() => {
        // Re-run highlighting whenever active lesson content changes and we are in lesson mode
        if (viewMode === 'lesson') {
            setTimeout(() => {
                document.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }, 100);
        }
    }, [activeLessonContent, viewMode]);

    const loadLessons = async () => {
        try {
            const response = await fetch(`${API_URL}/modules/${moduleId}/lessons`);
            if (!response.ok) throw new Error('Failed to load lessons');
            const data = await response.json();
            setLessons(data);
            if (data.length > 0) {
                setActiveLessonId(data[0]._id);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProgress = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ moduleId, lessonId: null }) 
            });
            if (res.ok) {
                const data = await res.json();
                setExtProgress(data.progressPercentage || 0);
            }
        } catch (e) { }
    };

    const handleTakeQuiz = () => {
        if (mustReviewLesson) {
            alert('Please re-read the lesson and then click "I Re-read, Retry Quiz".');
            return;
        }

        const quizData = normalizeQuizData(activeLessonContent?.quiz);
        if (quizData.length > 0) {
            setActiveLessonContent((prev) => ({ ...prev, quiz: quizData }));
            setViewMode('quiz');
            return;
        }

        generateQuizForActiveLesson();
    };

    const submitPerformanceAttempt = async (score, total, passed) => {
        const token = localStorage.getItem('token');
        if (!token || !activeLesson) return null;
        try {
            const timeSpentSeconds = Math.max(0, Math.floor((Date.now() - lessonStartTs) / 1000));
            const currentIndex = lessons.findIndex((l) => l._id === activeLessonId);
            const isModuleFinalLesson = currentIndex === lessons.length - 1;
            const response = await fetch(`${API_URL}/performance/lesson-attempt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    moduleId,
                    lessonId: activeLessonId,
                    lessonTitle: activeLesson.title,
                    language: activeLesson.language,
                    level: activeLesson.level,
                    score,
                    totalQuestions: total,
                    passed,
                    timeSpentSeconds,
                    isModuleFinalLesson
                })
            });
            if (!response.ok) return null;
            return await response.json();
        } catch {
            return null;
        }
    };

    const handleQuizComplete = async (score, total) => {
        const perfResponse = await submitPerformanceAttempt(score, total, score >= 3);
        const adaptive = perfResponse?.adaptive;
        if (adaptive) {
            setAdaptiveFeedback(adaptive);
            if (Array.isArray(adaptive.extraPracticeLessons) && adaptive.extraPracticeLessons.length) {
                setExtraPracticeLessons(adaptive.extraPracticeLessons);
            }
            if (adaptive.fastLearnerMessage) {
                alert(adaptive.fastLearnerMessage);
            }
            if (adaptive.encouragementTriggered) {
                alert('We noticed multiple retries. Your AI coach sent encouragement in Chatbot with easier suggestions.');
            }
        }

        if (score >= 3) {
            setMustReviewLesson(false);
            handlePass(adaptive?.nextModuleSuggestion || '');
        } else {
            setMustReviewLesson(true);
            alert(`You scored ${score}/${total}. Please re-read the lesson and try again`);
            setViewMode('lesson');
            window.scrollTo(0, 0);
        }
    };

    const generateQuizForActiveLesson = async () => {
        if (!activeLesson) return;
        const cacheKey = `quiz_${moduleId}_${activeLesson.order}`;
        const cachedQuiz = localStorage.getItem(cacheKey);
        if (cachedQuiz) {
            const normalizedCachedQuiz = normalizeQuizData(JSON.parse(cachedQuiz));
            if (normalizedCachedQuiz.length === 5) {
                setActiveLessonContent((prev) => ({ ...(prev || {}), quiz: normalizedCachedQuiz }));
                setViewMode('quiz');
                return;
            }
        }

        setLoadingContent(true);
        try {
            const response = await fetch(`${API_URL}/modules/${moduleId}/lessons/${activeLesson.order}/quiz`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: activeLesson.language,
                    level: activeLesson.level
                })
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                const msg = data?.message || 'Failed to generate quiz';
                throw new Error(msg);
            }
            const normalizedQuiz = normalizeQuizData(data.quiz);
            if (normalizedQuiz.length !== 5) throw new Error('Invalid quiz generated');
            localStorage.setItem(cacheKey, JSON.stringify(normalizedQuiz));
            setActiveLessonContent((prev) => ({ ...(prev || {}), quiz: normalizedQuiz }));
            setViewMode('quiz');
        } catch (err) {
            console.error(err);
            alert(`Quiz generation failed: ${err?.message || 'Please try again.'}`);
        } finally {
            setLoadingContent(false);
        }
    };

    const handlePass = async (nextModuleSuggestion = '') => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please log in to save your progress!");
            return;
        }
        
        // Show Badge Popup
        setShowBadge(true);
        setTimeout(() => setShowBadge(false), 3000);

        try {
            const res = await fetch(`${API_URL}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ moduleId, lessonId: activeLessonId })
            });
            if (res.ok) {
                const data = await res.json();
                setExtProgress(data.progressPercentage);

                try {
                    await fetch(`${API_URL}/badges/check`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } catch (e) { }

                // Move to next lesson if possible
                setTimeout(() => {
                    const currentIndex = lessons.findIndex(l => l._id === activeLessonId);
                    if (currentIndex < lessons.length - 1) {
                        setActiveLessonId(lessons[currentIndex + 1]._id);
                    } else {
                        if (nextModuleSuggestion) {
                            alert(`Module completed! Outstanding work!\n\n${nextModuleSuggestion}`);
                        } else {
                            alert("Module completed! Outstanding work!");
                        }
                        navigate('/modules');
                    }
                }, 1500); // Wait a bit so they see the badge animation
            }
        } catch (error) {
            console.error('Failed to mark complete', error);
        }
    };

    if (loading) return (
        <div className="flex min-h-screen pt-16 bg-[#0a0a1a] relative">
            {/* Sidebar Skeleton */}
            <div className="hidden lg:block fixed lg:static top-16 left-0 h-[calc(100vh-64px)] z-40 border-r border-white/10 glass p-4 w-72 lg:w-1/4">
                <div className="animate-pulse">
                    <div className="h-6 w-40 bg-white/10 rounded mb-6"></div>
                    <div className="h-2 w-full bg-white/10 rounded mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-12 w-full bg-white/10 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Main Content Skeleton */}
            <div className="flex-1 lg:w-3/4 p-4 md:p-8">
                <div className="max-w-4xl mx-auto animate-pulse">
                    <div className="h-12 w-3/4 bg-white/10 rounded mb-8 mt-4"></div>
                    <div className="space-y-4">
                        <div className="h-4 w-full bg-white/10 rounded"></div>
                        <div className="h-4 w-full bg-white/10 rounded"></div>
                        <div className="h-4 w-5/6 bg-white/10 rounded"></div>
                    </div>
                    <div className="mt-8 h-64 w-full bg-white/10 rounded-xl"></div>
                </div>
            </div>
        </div>
    );
    if (!lessons.length) return <div className="text-center mt-32 text-red-500">No lessons available for this module yet.</div>;

    const activeLesson = lessons.find(l => l._id === activeLessonId) || lessons[0];

    return (
        <div className="flex min-h-screen pt-16 bg-[#0a0a1a] relative">
            <AnimatePresence>
                {showBadge && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -50 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-gradient-to-br from-indigo-primary to-neon-purple p-8 rounded-2xl shadow-[0_0_50px_rgba(138,43,226,0.5)] border border-cyan-glow flex flex-col items-center">
                            <span className="text-6xl mb-4">🏆</span>
                            <h2 className="text-3xl font-bold text-white mb-2">Lesson Completed!</h2>
                            <p className="text-cyan-glow text-lg">+10% Progress</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar — fixed on mobile, static on desktop */}
            <div className={`
                fixed lg:static top-16 left-0 h-[calc(100vh-64px)] z-40
                border-r border-white/10 glass p-4 overflow-y-auto
                transition-transform duration-300 ease-in-out
                w-72 lg:w-1/4
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow to-neon-purple">Course Contents</h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 rounded text-gray-400 hover:text-white"
                    >✕</button>
                </div>

                <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-1">Module Progress: {extProgress}%</div>
                    <div className="w-full bg-dark-blue-gray rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-primary to-cyan-glow transition-all" style={{ width: `${extProgress}%` }} />
                    </div>
                </div>

                <ul className="space-y-2">
                    {lessons.map((lesson, index) => {
                        const isLockedByProgress = index > (extProgress / 10);
                        const isLockedByPlan = user?.plan === 'free' && index >= 3;
                        const isLocked = isLockedByProgress || isLockedByPlan;
                        const isActive = activeLessonId === lesson._id;

                        return (
                            <li key={lesson._id}>
                                <button
                                    onClick={() => !isLocked && setActiveLessonId(lesson._id)}
                                    disabled={isLocked}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex justify-between items-center ${
                                        isActive
                                        ? 'bg-gradient-to-r from-indigo-primary/40 to-neon-purple/40 border border-cyan-glow/50 text-white shadow-[0_0_10px_rgba(0,255,255,0.2)]'
                                        : isLocked
                                            ? 'text-gray-600 cursor-not-allowed'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <div>
                                        <span className={`text-sm mr-2 ${isActive ? 'text-cyan-glow' : isLocked ? 'text-gray-600' : 'text-indigo-400'}`}>
                                            {index + 1}.
                                        </span> 
                                        {lesson.title}
                                    </div>
                                    {isLocked && <span title={isLockedByPlan ? "Upgrade to Pro to unlock" : "Complete previous lessons to unlock"}>🔒</span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 lg:w-3/4 p-4 md:p-8 overflow-y-auto relative" style={{ maxHeight: 'calc(100vh - 64px)' }}>
                {/* Mobile sidebar toggle */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2 glass border border-white/20 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
                >
                    ☰ <span>Lessons</span>
                </button>
                <motion.div
                    key={activeLesson._id + viewMode}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-extrabold text-white">{activeLesson.title}</h1>
                        <span className="px-3 py-1 bg-white/10 text-cyan-glow text-sm rounded-full border border-cyan-glow/30">
                            {activeLesson.language}
                        </span>
                    </div>

                    {loadingContent ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-indigo-primary border-t-cyan-glow rounded-full animate-spin mb-4"></div>
                            <p className="text-cyan-glow animate-pulse">Generating AI Lesson & Quiz...</p>
                        </div>
                    ) : viewMode === 'lesson' ? (
                        <div className="prose prose-invert max-w-none">
                            <div className="text-lg text-gray-300 leading-relaxed mb-8 whitespace-pre-wrap">
                                {activeLessonContent?.content || activeLesson.content}
                            </div>

                            {(activeLessonContent?.codeExample || activeLesson.codeExample) && (
                                <div className="my-8 rounded-xl overflow-hidden glass border border-white/20 relative group shadow-[0_0_20px_rgba(138,43,226,0.15)]">
                                    <div className="bg-[#1e1e2e] px-4 py-2 text-xs text-gray-400 border-b border-white/10 flex justify-between items-center">
                                        <span>Example Code</span>
                                        <span className="text-indigo-400">{activeLesson.language}</span>
                                    </div>
                                    <pre className="m-0 p-4 bg-[#282c34]">
                                        <code className={`language-${activeLesson.language.toLowerCase()}`}>
                                            {activeLessonContent?.codeExample || activeLesson.codeExample}
                                        </code>
                                    </pre>
                                </div>
                            )}

                            {(activeLessonContent?.exercise || activeLesson.exercise) && (
                                <div className="mt-12 p-6 rounded-custom bg-gradient-to-br from-indigo-primary/20 to-neon-purple/20 border border-neon-purple/30">
                                    <h3 className="text-2xl font-bold mb-4 flex items-center text-neon-purple">
                                        <span className="mr-2">🚀</span> Practice Exercise
                                    </h3>
                                    <div className="text-gray-300 whitespace-pre-wrap">
                                        {typeof (activeLessonContent?.exercise || activeLesson.exercise) === 'string' 
                                            ? (activeLessonContent?.exercise || activeLesson.exercise) 
                                            : JSON.stringify(activeLessonContent?.exercise || activeLesson.exercise, null, 2)}
                                    </div>
                                </div>
                            )}

                            {extraPracticeLessons.length > 0 && (
                                <div className="mt-12 p-6 rounded-custom bg-gradient-to-br from-cyan-glow/10 to-indigo-primary/10 border border-cyan-glow/30">
                                    <h3 className="text-2xl font-bold mb-4 text-cyan-glow">AI Extra Practice (Weak Topic Support)</h3>
                                    <div className="space-y-4">
                                        {extraPracticeLessons.map((lesson, idx) => (
                                            <div key={`${lesson.title}-${idx}`} className="p-4 rounded-lg bg-dark-blue-gray border border-white/10">
                                                <div className="font-semibold text-white mb-2">{lesson.title || `Practice ${idx + 1}`}</div>
                                                <div className="text-gray-300 whitespace-pre-wrap">{lesson.content || ''}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {adaptiveFeedback?.fastLearnerMessage && (
                                <div className="mt-8 p-4 rounded-lg border border-green-400/40 bg-green-500/10 text-green-200">
                                    {adaptiveFeedback.fastLearnerMessage}
                                </div>
                            )}

                            <div className="mt-16 flex justify-end pb-8">
                                <div className="flex gap-3">
                                    {mustReviewLesson && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setMustReviewLesson(false);
                                                handleTakeQuiz();
                                            }}
                                            className="px-8 py-3 glass border border-cyan-glow/40 rounded-full font-bold text-cyan-glow transition-all"
                                        >
                                            I Re-read, Retry Quiz
                                        </motion.button>
                                    )}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleTakeQuiz}
                                        className="px-8 py-3 bg-gradient-to-r from-indigo-primary to-cyan-glow rounded-full font-bold text-white shadow-glow-cyan transition-all"
                                    >
                                        Take Quiz to Complete
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <LessonQuiz 
                            quizData={activeLessonContent.quiz} 
                            onComplete={handleQuizComplete} 
                        />
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default LessonPage;

