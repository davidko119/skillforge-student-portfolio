
import React, { useState, useEffect } from 'react';
import { Opportunity, User, UserPreferences, AppTheme } from '../types';
import { 
  MapPin, Calendar, LayoutGrid, List, X, Globe,
  Filter, Loader2, Search, GraduationCap, ExternalLink,
  Briefcase, Zap, Info, ChevronLeft
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface CalendarViewProps {
  opportunities: Opportunity[];
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  theme: AppTheme;
}

const SEARCH_MESSAGES = [
  "Iniciujem Google Search...",
  "Analyzujem váš profil...",
  "Prehľadávam LinkedIn a Erasmus+ portály...",
  "Overujem aktuálnosť termínov...",
  "Filtrujem stáže a workshopy...",
  "Finálne formátovanie..."
];

const getIconForType = (type: string) => {
  switch (type) {
    case 'Erasmus': return <Globe size={32} />;
    case 'Stáž': return <Briefcase size={32} />;
    case 'Workshop': return <GraduationCap size={32} />;
    default: return <Zap size={32} />;
  }
};

const CalendarView: React.FC<CalendarViewProps> = ({ opportunities: initialOpps, user, setUser, theme }) => {
  const isDark = theme === 'MODERN_DARK';
  const brandColor = isDark ? 'text-blue-500' : 'text-red-600';
  const brandBg = isDark ? 'bg-blue-600' : 'bg-red-600';
  const headingClass = "font-black font-jakarta tracking-tight";

  const [showPrefForm, setShowPrefForm] = useState(!user.preferences);
  const [liveOpps, setLiveOpps] = useState<Opportunity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const fetchLiveOpportunities = async (prefs: UserPreferences) => {
    setIsSearching(true);
    setSearchProgress(0);
    setCurrentMessageIndex(0);

    const progressInterval = setInterval(() => {
      setSearchProgress(prev => prev < 90 ? prev + 1 : prev);
    }, 150);

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % SEARCH_MESSAGES.length);
    }, 2000);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Hľadaj 6 aktuálnych študentských príležitostí (Erasmus+, stáže, workshopy) pre rok 2024/2025.
      Profil študenta: Odbor: ${prefs.fieldOfStudy}, Záujmy: ${prefs.interests.join(', ')}, Lokality: ${prefs.preferredLocations.join(', ')}.
      Stupeň štúdia: ${prefs.degreeLevel}.
      Formátuj každý riadok presne ako: TYP | NÁZOV | LOKALITA | DÁTUM | POPIS | URL
      Povolené TYPY: Erasmus, Stáž, Workshop, Iné. Používaj len tieto názvy.
      Dátum formát: YYYY-MM-DD. Jazyk: Slovenský.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });

      const text = response.text || "";
      const lines = text.split('\n').filter(l => l.includes('|'));
      
      const parsed: Opportunity[] = lines.map((line, idx) => {
        const [type, title, loc, date, desc, url] = line.split('|').map(s => s.trim());
        return {
          id: `live-${idx}-${Date.now()}`,
          type: (['Erasmus', 'Stáž', 'Workshop', 'Súťaž'].includes(type) ? type : 'Iné') as any,
          title: title || 'Názov nedostupný',
          location: loc || 'Online / EÚ',
          date: date || '2025-01-01',
          description: desc || 'Podrobnosti v odkaze.',
          applyLink: url || 'https://google.com',
          tags: prefs.interests
        };
      });

      setLiveOpps(parsed);
      setSearchProgress(100);
      
      // Save results to local for persistency
      localStorage.setItem('skillforge_last_search_results', JSON.stringify(parsed));
    } catch (e) {
      console.error(e);
    } finally {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      setTimeout(() => setIsSearching(false), 500);
    }
  };

  useEffect(() => {
    // Load last search results if available
    const lastResults = localStorage.getItem('skillforge_last_search_results');
    if (lastResults) {
      setLiveOpps(JSON.parse(lastResults));
    } else if (user.preferences) {
      fetchLiveOpportunities(user.preferences);
    }
  }, []);

  const savePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const prefs: UserPreferences = {
      fieldOfStudy: formData.get('fieldOfStudy') as string,
      interests: (formData.get('interests') as string).split(',').map(s => s.trim()),
      preferredLocations: (formData.get('locations') as string).split(',').map(s => s.trim()),
      opportunityTypes: Array.from(formData.getAll('types')) as string[],
      languages: [],
      degreeLevel: formData.get('degreeLevel') as string,
      workPreference: 'ANY'
    };

    const updatedUser = { ...user, preferences: prefs };
    setUser(updatedUser);
    
    const db = JSON.parse(localStorage.getItem('skillforge_database') || '{}');
    db[user.email] = updatedUser;
    localStorage.setItem('skillforge_database', JSON.stringify(db));

    setShowPrefForm(false);
    fetchLiveOpportunities(prefs);
  };

  const toggleSave = (id: string) => {
    const isSaved = user.savedOpportunityIds.includes(id);
    const newSaved = isSaved 
      ? user.savedOpportunityIds.filter(sid => sid !== id) 
      : [...user.savedOpportunityIds, id];
    
    if (!isSaved) {
      const fullOpp = liveOpps.find(o => o.id === id) || initialOpps.find(o => o.id === id);
      if (fullOpp) {
        const savedData = JSON.parse(localStorage.getItem('skillforge_saved_opps') || '[]');
        if (!savedData.find((o: any) => o.id === id)) {
          savedData.push(fullOpp);
          localStorage.setItem('skillforge_saved_opps', JSON.stringify(savedData));
        }
      }
    }

    const updatedUser = { ...user, savedOpportunityIds: newSaved };
    setUser(updatedUser);
    
    const db = JSON.parse(localStorage.getItem('skillforge_database') || '{}');
    db[user.email] = updatedUser;
    localStorage.setItem('skillforge_database', JSON.stringify(db));
  };

  const displayOpps = liveOpps.length > 0 ? liveOpps : initialOpps;

  return (
    <div className={`relative min-h-screen ${!isDark ? 'bg-white' : 'bg-black'}`}>
      <div className={`p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500`}>
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className={`text-3xl md:text-4xl ${headingClass}`}>Možnosti pre teba</h2>
            <p className={`${isDark ? 'text-zinc-500' : 'text-zinc-400 font-bold'}`}>Aktuálne ponuky z celej Európy filtrované AI.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={() => setShowPrefForm(true)}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-black text-white transition-all shadow-lg active:scale-95 ${brandBg}`}
            >
              <Filter size={18} /> Upraviť filter
            </button>
          </div>
        </header>

        {isSearching ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
             <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center relative ${isDark ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
                <Loader2 className={`${brandColor} animate-spin`} size={48} strokeWidth={3} />
                <div className={`absolute -inset-2 rounded-[3rem] border-2 border-dashed ${isDark ? 'border-white/10' : 'border-black/5'} animate-[spin_10s_linear_infinite]`} />
             </div>
             <div className="text-center space-y-4">
                <h3 className="text-2xl font-black font-jakarta tracking-tight">{SEARCH_MESSAGES[currentMessageIndex]}</h3>
                <div className={`w-72 h-3 rounded-full overflow-hidden mx-auto ${isDark ? 'bg-zinc-900 border border-white/5' : 'bg-zinc-100 border border-black/5'}`}>
                  <div className={`h-full ${brandBg} transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)]`} style={{ width: `${searchProgress}%` }} />
                </div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Prehľadávame dôveryhodné zdroje</p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            {displayOpps.map(opp => {
              const isSaved = user.savedOpportunityIds.includes(opp.id);
              return (
                <div key={opp.id} className={`group border rounded-[2.5rem] p-7 transition-all flex flex-col justify-between hover:-translate-y-1 ${isDark ? 'bg-zinc-950 border-white/5 hover:border-blue-500/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'bg-white border-black/5 hover:border-red-600/40 shadow-sm hover:shadow-xl'}`}>
                  <div className="space-y-5">
                    <div className="flex justify-between items-start">
                      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 ${isDark ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-600'}`}>
                        {getIconForType(opp.type)}
                      </div>
                      <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border ${isDark ? 'bg-zinc-900 text-zinc-400 border-white/5' : 'bg-zinc-50 text-zinc-500 border-black/5'}`}>{opp.type}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black leading-tight tracking-tight mb-3 line-clamp-2">{opp.title}</h3>
                      <div className={`flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        <div className="flex items-center gap-1.5"><MapPin size={14} className={brandColor} /> {opp.location}</div>
                        <div className="flex items-center gap-1.5"><Calendar size={14} className={brandColor} /> {opp.date}</div>
                      </div>
                      <p className={`text-sm font-bold leading-relaxed line-clamp-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{opp.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <a href={opp.applyLink} target="_blank" className={`flex-1 py-4 rounded-2xl font-black text-[11px] text-center uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 ${isDark ? 'bg-white text-black' : 'bg-zinc-900 text-white shadow-lg shadow-black/10'}`}>Otvoriť portál</a>
                    <button 
                      onClick={() => toggleSave(opp.id)} 
                      title={isSaved ? "Odobrať z kalendára" : "Uložiť do kalendára"}
                      className={`px-5 py-4 rounded-2xl border-2 transition-all active:scale-95 ${isSaved ? `${brandBg} text-white border-transparent shadow-lg shadow-blue-500/20` : `${isDark ? 'border-white/5 bg-zinc-900 text-zinc-500 hover:text-white hover:border-white/20' : 'border-black/5 bg-zinc-50 text-zinc-300 hover:text-red-500 hover:border-red-500/20'}`}`}
                    >
                      <Calendar size={20} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PERSONALIZATION MODAL */}
      {showPrefForm && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 overflow-y-auto">
           <form onSubmit={savePreferences} className={`relative max-w-2xl w-full border p-8 md:p-14 rounded-[3rem] space-y-10 animate-in zoom-in-95 fade-in duration-300 my-auto ${isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-black/5 shadow-[0_30px_100px_rgba(0,0,0,0.2)]'}`}>
              
              <button 
                type="button" 
                onClick={() => setShowPrefForm(false)} 
                className={`absolute top-8 right-8 p-3 rounded-2xl transition-all ${isDark ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-500' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-400'}`}
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-3">
                 <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl ${isDark ? 'bg-blue-600/10' : 'bg-red-600/10'}`}>
                   <Filter className={brandColor} size={36} />
                 </div>
                 <h3 className={`text-4xl ${headingClass}`}>Personalizácia</h3>
                 <p className="text-zinc-500 text-base font-bold">Pomôž Gemini nájsť to pravé pre teba.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 md:col-span-2">
                  <label className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em] px-1">Odbor štúdia</label>
                  <input name="fieldOfStudy" required defaultValue={user.preferences?.fieldOfStudy || ''} placeholder="napr. Informatika, Psychológia..." className={`w-full rounded-[1.25rem] p-5 border-2 outline-none font-bold text-lg transition-all focus:ring-4 focus:ring-blue-500/10 ${isDark ? 'bg-zinc-900 border-white/5 focus:border-blue-500/50' : 'bg-zinc-50 border-black/5 focus:border-red-600/50'}`} />
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em] px-1">Záujmy (čiarkou)</label>
                  <input name="interests" required defaultValue={user.preferences?.interests.join(', ') || ''} placeholder="AI, Design, Ekológia" className={`w-full rounded-[1.25rem] p-5 border-2 outline-none font-bold transition-all focus:ring-4 focus:ring-blue-500/10 ${isDark ? 'bg-zinc-900 border-white/5 focus:border-blue-500/50' : 'bg-zinc-50 border-black/5 focus:border-red-600/50'}`} />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em] px-1">Lokality</label>
                  <input name="locations" required defaultValue={user.preferences?.preferredLocations.join(', ') || ''} placeholder="Berlín, Praha, Online" className={`w-full rounded-[1.25rem] p-5 border-2 outline-none font-bold transition-all focus:ring-4 focus:ring-blue-500/10 ${isDark ? 'bg-zinc-900 border-white/5 focus:border-blue-500/50' : 'bg-zinc-50 border-black/5 focus:border-red-600/50'}`} />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em] px-1">Stupeň štúdia</label>
                  <select name="degreeLevel" className={`w-full rounded-[1.25rem] p-5 border-2 outline-none font-bold transition-all focus:ring-4 focus:ring-blue-500/10 ${isDark ? 'bg-zinc-900 border-white/5 focus:border-blue-500/50' : 'bg-zinc-50 border-black/5 focus:border-red-600/50'}`}>
                    {['Stredná škola', 'Bakalár', 'Magister / Inžinier', 'Doktorand', 'Iné'].map(opt => (
                      <option key={opt} value={opt} selected={user.preferences?.degreeLevel === opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em] px-1">Typy príležitostí</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Erasmus', 'Stáž', 'Workshop', 'Súťaž'].map(type => (
                      <label key={type} className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${isDark ? 'bg-zinc-900 border-white/5 hover:border-white/20' : 'bg-zinc-50 border-black/5 hover:border-black/20'}`}>
                        <input type="checkbox" name="types" value={type} defaultChecked={user.preferences?.opportunityTypes.includes(type)} className="w-4 h-4 accent-blue-500" />
                        <span className="text-xs font-black uppercase tracking-widest">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="submit" className={`flex-1 py-5 text-white text-base font-black rounded-[1.5rem] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-500/20 ${brandBg}`}>Uložiť a spustiť hľadanie</button>
                <button type="button" onClick={() => setShowPrefForm(false)} className={`px-10 py-5 rounded-[1.5rem] font-black text-base transition-all active:scale-95 ${isDark ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>Zavrieť</button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
