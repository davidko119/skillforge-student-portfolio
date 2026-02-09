
import React, { useState } from 'react';
import { Quiz } from '../types';
import { ChevronRight, ArrowLeft, Trophy, X } from 'lucide-react';

interface QuizPlayerProps {
  quiz: Quiz;
  onFinish: () => void;
  onCancel: () => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onFinish, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (idx: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentStep] = idx;
    setSelectedAnswers(newAnswers);
  };

  const next = () => {
    if (currentStep < quiz.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctIndex) score++;
    });
    return score;
  };

  if (isFinished) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center p-8 animate-in zoom-in duration-500">
        <div className="max-w-md w-full bg-zinc-950 border border-white/10 rounded-[3rem] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />
          
          <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
            <Trophy size={40} />
          </div>
          
          <h2 className="text-3xl font-bold font-heading mb-2">Skvelá práca!</h2>
          <p className="text-zinc-500 mb-8">Dokončil si kvíz: <span className="text-white font-medium">{quiz.title}</span></p>
          
          <div className="bg-zinc-900 rounded-3xl p-6 mb-8">
            <p className="text-zinc-500 uppercase text-xs font-bold tracking-widest mb-1">Tvoje skóre</p>
            <p className="text-5xl font-black text-white">{percentage}%</p>
            <p className="text-zinc-500 text-sm mt-2">{score} z {quiz.questions.length} správne</p>
          </div>

          <button 
            onClick={onFinish}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all transform active:scale-95"
          >
            Návrat do knižnice
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentStep];
  const progress = ((currentStep + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-950">
      <div className="max-w-3xl w-full">
        <header className="flex items-center justify-between mb-12">
          <button onClick={onCancel} className="text-zinc-500 hover:text-white flex items-center gap-2 transition-colors">
            <X size={20} /> <span className="text-sm font-medium">Zrušiť</span>
          </button>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Otázka {currentStep + 1} z {quiz.questions.length}
            </span>
            <div className="w-48 h-1 bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </header>

        <div className="animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-zinc-900/50 border border-white/10 rounded-[3rem] p-10 md:p-14">
            {currentQuestion.imageUrl && (
              <img 
                src={currentQuestion.imageUrl} 
                alt="Question visual" 
                className="w-full h-48 object-cover rounded-3xl mb-10 border border-white/5"
              />
            )}
            
            <h3 className="text-2xl md:text-3xl font-bold font-heading mb-10 leading-tight">
              {currentQuestion.text}
            </h3>

            <div className="space-y-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-6 text-left rounded-2xl border transition-all flex items-center justify-between group ${
                    selectedAnswers[currentStep] === idx 
                      ? 'bg-blue-500/10 border-blue-500 text-blue-500' 
                      : 'bg-zinc-900 border-white/5 hover:border-white/20 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="font-medium text-lg">{option}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedAnswers[currentStep] === idx ? 'border-blue-500' : 'border-zinc-700 group-hover:border-zinc-500'
                  }`}>
                    {selectedAnswers[currentStep] === idx && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-12 flex justify-end">
              <button
                disabled={selectedAnswers[currentStep] === undefined}
                onClick={next}
                className="px-10 py-4 bg-white text-black font-bold rounded-2xl flex items-center gap-2 hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
              >
                {currentStep === quiz.questions.length - 1 ? 'Vyhodnotiť' : 'Ďalšia otázka'}
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;
