
import React, { useState } from 'react';
import { User, Quiz, QuizQuestion } from '../types';
import { Plus, Trash2, Save, ImagePlus, ChevronRight } from 'lucide-react';

interface CreatorHubProps {
  user: User;
  onAddQuiz: (quiz: Quiz) => void;
}

const CreatorHub: React.FC<CreatorHubProps> = ({ user, onAddQuiz }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Partial<QuizQuestion>[]>([
    { id: '1', text: '', options: ['', ''], correctIndex: 0 }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { 
      id: Date.now().toString(), 
      text: '', 
      options: ['', ''], 
      correctIndex: 0 
    }]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, field: keyof QuizQuestion, value: any) => {
    const newQuestions = [...questions];
    newQuestions[idx] = { ...newQuestions[idx], [field]: value };
    setQuestions(newQuestions);
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const newQuestions = [...questions];
    const newOptions = [...(newQuestions[qIdx].options || [])];
    newOptions[oIdx] = value;
    newQuestions[qIdx].options = newOptions;
    setQuestions(newQuestions);
  };

  const addOption = (qIdx: number) => {
    const newQuestions = [...questions];
    newQuestions[qIdx].options = [...(newQuestions[qIdx].options || []), ''];
    setQuestions(newQuestions);
  };

  const handlePublish = () => {
    if (title && questions.every(q => q.text && q.options?.length && q.options.every(o => o))) {
      const quiz: Quiz = {
        id: `quiz-${Date.now()}`,
        title,
        description,
        creatorId: user.id,
        questions: questions as QuizQuestion[],
        completedBy: []
      };
      onAddQuiz(quiz);
    } else {
      alert('Prosím vyplň všetky polia pred zverejnením.');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pb-32">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold font-heading mb-2">Editor Kvízov</h2>
          <p className="text-zinc-400">Vytvor pútavý kvíz a pomôž ostatným overiť ich skilly.</p>
        </div>
        <button 
          onClick={handlePublish}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-blue-600/20"
        >
          <Save size={18} /> Zverejniť kvíz
        </button>
      </header>

      <div className="space-y-8">
        <section className="bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-10 space-y-6">
          <div>
            <label className="text-xs uppercase font-bold text-zinc-500 block mb-3">Názov Kvízu</label>
            <input 
              type="text" 
              placeholder="napr. Pokročilý TypeScript"
              className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-xl font-bold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-zinc-500 block mb-3">Popis</label>
            <textarea 
              placeholder="O čom je tento kvíz?"
              className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-zinc-400"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </section>

        {questions.map((q, qIdx) => (
          <div key={q.id} className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-10 space-y-8 group animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-start">
              <span className="text-3xl font-black text-zinc-800 leading-none">0{qIdx + 1}</span>
              <button 
                onClick={() => removeQuestion(qIdx)}
                className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-xs uppercase font-bold text-zinc-500 block">Znenie Otázky</label>
              <input 
                type="text" 
                className="w-full bg-transparent border-b-2 border-white/10 py-3 text-xl font-medium focus:border-blue-500 outline-none transition-colors"
                placeholder="Sem napíš otázku..."
                value={q.text}
                onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)}
              />
              
              <div className="flex gap-4 items-center">
                 <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full text-xs font-bold hover:bg-zinc-700 transition-all">
                  <ImagePlus size={14} /> {q.imageUrl ? 'Zmeniť obrázok' : 'Pridať obrázok (URL)'}
                  <input 
                    type="text" 
                    className="hidden" 
                    onChange={() => {
                      const url = prompt('Vlož URL obrázka:');
                      if(url) updateQuestion(qIdx, 'imageUrl', url);
                    }}
                  />
                </label>
                {q.imageUrl && <span className="text-[10px] text-green-500 font-bold uppercase">Pridané</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options?.map((option, oIdx) => (
                <div key={oIdx} className="flex items-center gap-3 group/opt">
                  <button 
                    onClick={() => updateQuestion(qIdx, 'correctIndex', oIdx)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      q.correctIndex === oIdx ? 'border-green-500 bg-green-500/10' : 'border-zinc-700'
                    }`}
                  >
                    {q.correctIndex === oIdx && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                  </button>
                  <input 
                    type="text" 
                    className={`flex-1 bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-sm ${
                       q.correctIndex === oIdx ? 'ring-1 ring-green-500/50' : ''
                    }`}
                    placeholder={`Možnosť ${oIdx + 1}`}
                    value={option}
                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                  />
                </div>
              ))}
              <button 
                onClick={() => addOption(qIdx)}
                className="flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-bold py-2"
              >
                <Plus size={14} /> Pridať možnosť
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={addQuestion}
          className="w-full py-10 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-zinc-500 hover:text-blue-500 hover:border-blue-500/20 hover:bg-blue-500/[0.02] transition-all group"
        >
          <div className="p-4 bg-zinc-900 rounded-2xl mb-4 group-hover:bg-blue-500/10 transition-colors">
            <Plus size={32} />
          </div>
          <span className="font-bold">Pridať ďalšiu otázku</span>
        </button>
      </div>
    </div>
  );
};

export default CreatorHub;
