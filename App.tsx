
import React, { useState, useEffect } from 'react';
import { User, UserRole, View, Quiz, AppTheme } from './types';
import { MOCK_OPPORTUNITIES, MOCK_QUIZZES } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import CalendarView from './components/CalendarView';
import QuizLibrary from './components/QuizLibrary';
import QuizPlayer from './components/QuizPlayer';
import CreatorHub from './components/CreatorHub';
import Auth from './components/Auth';
import PortfolioPreview from './components/PortfolioPreview';
import LandingPage from './components/LandingPage';
import { Menu, X } from 'lucide-react';
import Logo from './components/Logo';
import { getUserByEmail, upsertUser } from './userService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('LANDING');
  const [quizzes, setQuizzes] = useState<Quiz[]>(MOCK_QUIZZES);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('skillforge_theme') as AppTheme) || 'MODERN_DARK';
  });
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  const toggleTheme = () => {
    const newTheme = theme === 'MODERN_DARK' ? 'ELEGANT_LIGHT' : 'MODERN_DARK';
    setTheme(newTheme);
    localStorage.setItem('skillforge_theme', newTheme);
  };

  useEffect(() => {
    const bootstrap = async () => {
      const params = new URLSearchParams(window.location.search);
      const sharedUserId = params.get('userId');
      const viewParam = params.get('view');

      try {
        // Portfolio share mode – load user by email from Appwrite
        if (viewParam === 'portfolio' && sharedUserId) {
          const doc = await getUserByEmail(sharedUserId);
          if (doc) {
            const loadedUser = doc as unknown as User;
            setUser(loadedUser);
            setCurrentView('PORTFOLIO_PREVIEW');
            setIsLoadingUser(false);
            return;
          }
        }

        const sessionEmail = localStorage.getItem('skillforge_active_session');
        if (sessionEmail) {
          const doc = await getUserByEmail(sessionEmail);
          if (doc) {
            const loadedUser = doc as unknown as User;
            setUser(loadedUser);
            setCurrentView('DASHBOARD');
          }
        }
      } catch (e) {
        console.error('Failed to load user from Appwrite', e);
      } finally {
        setIsLoadingUser(false);
      }
    };

    bootstrap();
  }, []);

  const handleLogin = async (u: User) => {
    try {
      const savedDoc = await upsertUser(u);
      const savedUser = {
        ...u,
        id: (savedDoc as any).appUserId ?? u.id,
      } as User;

      setUser(savedUser);
      localStorage.setItem('skillforge_active_session', savedUser.email);
      setCurrentView('DASHBOARD');
    } catch (e) {
      console.error('Failed to login / save user to Appwrite', e);
      alert('Prihlasovanie zlyhalo. Skúste to prosím znova.');
    }
  };

  const handleUpdateUser = async (updatedUser: User | null) => {
    if (!updatedUser) return;
    setUser(updatedUser);
    try {
      await upsertUser(updatedUser);
    } catch (e) {
      console.error('Failed to update user in Appwrite', e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('skillforge_active_session');
    window.history.pushState({}, '', window.location.pathname);
    setCurrentView('LANDING');
  };

  const renderView = () => {
    if (isLoadingUser) {
      return <div className="w-full h-full flex items-center justify-center text-sm">Načítavam používateľa...</div>;
    }
    if (!user && currentView !== 'LANDING' && currentView !== 'AUTH') {
      return <LandingPage onStart={() => setCurrentView('AUTH')} theme={theme} />;
    }

    switch (currentView) {
      case 'LANDING': return <LandingPage onStart={() => setCurrentView('AUTH')} theme={theme} />;
      case 'AUTH': return <Auth onLogin={handleLogin} />;
      case 'DASHBOARD': return <Dashboard user={user!} opportunities={MOCK_OPPORTUNITIES} onNavigate={setCurrentView} theme={theme} />;
      case 'PROFILE': return <Profile user={user!} setUser={handleUpdateUser as any} theme={theme} />;
      case 'CALENDAR': return <CalendarView opportunities={MOCK_OPPORTUNITIES} user={user!} setUser={handleUpdateUser as any} theme={theme} />;
      case 'QUIZZES': return <QuizLibrary quizzes={quizzes} user={user!} onStartQuiz={(q) => { setActiveQuiz(q); setCurrentView('QUIZ_PLAYER'); }} theme={theme} />;
      case 'QUIZ_PLAYER': return activeQuiz ? <QuizPlayer quiz={activeQuiz} onFinish={() => setCurrentView('QUIZZES')} onCancel={() => setCurrentView('QUIZZES')} /> : null;
      case 'CREATOR_HUB': return <CreatorHub user={user!} onAddQuiz={(q) => setQuizzes([...quizzes, q])} />;
      case 'PORTFOLIO_PREVIEW': return <PortfolioPreview user={user!} onBack={localStorage.getItem('skillforge_active_session') ? () => setCurrentView('PROFILE') : undefined} />;
      default: return <LandingPage onStart={() => setCurrentView('AUTH')} theme={theme} />;
    }
  };

  const isNavigationHidden = ['LANDING', 'AUTH', 'QUIZ_PLAYER', 'PORTFOLIO_PREVIEW'].includes(currentView);

  return (
    <div className={`flex flex-col md:flex-row h-screen overflow-hidden transition-colors duration-500 ${theme === 'MODERN_DARK' ? 'bg-black text-white' : 'bg-white text-black font-inter'}`}>
      {user && !isNavigationHidden && (
        <>
          {/* Mobile Nav Bar */}
          <div className={`md:hidden flex items-center justify-between p-4 border-b ${theme === 'MODERN_DARK' ? 'bg-zinc-950 border-white/10' : 'bg-zinc-50 border-black/5'}`}>
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="text-sm font-black font-jakarta tracking-tight">Digitálny študent</span>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="p-2">
              <Menu size={24} />
            </button>
          </div>

          <Sidebar 
            currentView={currentView} 
            onNavigate={(v) => { setCurrentView(v); setSidebarOpen(false); }} 
            user={user}
            onLogout={handleLogout}
            theme={theme}
            onToggleTheme={toggleTheme}
            isOpen={isSidebarOpen}
            setIsOpen={setSidebarOpen}
          />
        </>
      )}
      <main className="flex-1 overflow-y-auto relative">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
