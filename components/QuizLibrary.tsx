
import React from 'react';
import { Quiz, User, AppTheme } from '../types';
import { Play, CheckCircle2, Clock, HelpCircle } from 'lucide-react';

interface QuizLibraryProps {
  quizzes: Quiz[];
  user: User;
  onStartQuiz: (quiz: Quiz) => void;
  theme: AppTheme;
}

const QuizLibrary: React.FC<QuizLibraryProps> = ({ quizzes, user, onStartQuiz, theme }) => {
  const isDark = theme === 'MODERN_DARK';
  const headingClass = "font-black font-jakarta tracking-tight";
  const brandColor = isDark ? 'text-blue-500' : 'text-red-600';
  const brandBgAlpha = isDark ? 'bg-blue-500/10' : 'bg-red-600/10';
  const brandButton = isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-black';

  return (
    <div className={`p-8 max-w-6xl mx-auto min-h-screen ${!isDark ? 'bg-white' : ''}`}>
      <header className="mb-12">
        <h2 className={`text-4xl mb-2 ${headingClass}`}>Overenie Zručností</h2>
        <p className={`${isDark ? 'text-zinc-400' : 'text-zinc-500 font-bold'}`}>Vyber si kvíz, otestuj svoje znalosti a získaj odznak do portfólia.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => {
          const isCompleted = quiz.completedBy.includes(user.id);
          return (
            <div 
              key={quiz.id} 
              className={`group border rounded-[2.5rem] p-8 transition-all hover:scale-[1.02] ${
                isCompleted 
                  ? 'border-green-500/20 bg-green-500/[0.02]' 
                  : `${isDark ? 'bg-zinc-950 border-white/10 hover:border-blue-500/30' : 'bg-zinc-50 border-black/5 shadow-sm hover:border-red-600/30'}`
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-green-500/20 text-green-500' : `${brandBgAlpha} ${brandColor}`}`}>
                  {isCompleted ? <CheckCircle2 size={24} /> : <HelpCircle size={24} />}
                </div>
                {isCompleted && (
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    Dokončené
                  </span>
                )}
              </div>
              
              <h3 className={`text-xl font-black mb-2 font-jakarta tracking-tight`}>{quiz.title}</h3>
              <p className={`text-sm mb-6 line-clamp-2 font-bold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{quiz.description}</p>
              
              <div className={`flex items-center gap-4 text-xs mb-8 font-black uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                <div className="flex items-center gap-1.5"><Clock size={14} /> 10 min</div>
                <div className="flex items-center gap-1.5"><HelpCircle size={14} /> {quiz.questions.length} otázok</div>
              </div>

              <button 
                onClick={() => onStartQuiz(quiz)}
                disabled={isCompleted}
                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-all ${
                  isCompleted 
                    ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5' 
                    : `${brandButton} active:scale-95`
                }`}
              >
                {isCompleted ? 'Absolvované' : <><Play size={18} fill="currentColor" /> Spustiť kvíz</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizLibrary;
