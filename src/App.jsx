import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import About from './pages/About';
import Features from './pages/Features';
import AIContent from './pages/AIContent';
import Personalized from './pages/Personalized';
import IDE from './pages/IDE';
import Chatbot from './pages/Chatbot';
import Gamification from './pages/Gamification';
import Modules from './pages/Modules';
import ModuleDetails from './pages/ModuleDetails';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/ai-content" element={<AIContent />} />
              <Route path="/personalized" element={<Personalized />} />
              <Route path="/ide" element={<IDE />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/gamification" element={<Gamification />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/modules/:id" element={<ModuleDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

