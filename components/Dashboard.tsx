
import React, { useMemo } from 'react';
import { User, Opportunity, View, AppTheme } from '../types';
import { ArrowUpRight, Trophy, Briefcase, Sparkles, Calendar as CalendarIcon, MapPin, Globe, GraduationCap, Zap } from 'lucide-react';

interface DashboardProps {
  user: User;
  opportunities: Opportunity[];
  onNavigate: (view: View) => void;
  theme: AppTheme;
}

const getIconForType = (type: string) => {
  switch (type) {
    case 'Erasmus': return <Globe size={20} />;
    case 'Stáž': return <Briefcase size={20} />;
    case 'Workshop': return <GraduationCap size={20} />;
    default: return <Zap size={20} />;
  }
};

const Dashboard: React.FC<DashboardProps> = ({ user, opportunities, onNavigate, theme }) => {
  const isDark = theme === 'MODERN_DARK';
  
  // Combine initial mocks with dynamically saved opportunities from AI search
  const savedOpps = useMemo(() => {
    const savedData: Opportunity[] = JSON.parse(localStorage.getItem('skillforge_saved_opps') || '[]');
    // Filter and merge
    const merged = [...opportunities, ...savedData];
    return merged.filter(o => user.savedOpportunityIds.includes(o.id));
  }, [user.savedOpportunityIds, opportunities]);
  
  const headingClass = "font-black font-jakarta tracking-tight";
  const brandColor = isDark ? 'text-blue-500' : 'text-red-600';
  const brandBg = isDark ? 'bg-blue-600' : 'bg-red-600';
  const brandGradient = isDark ? 'from-blue-600 to-indigo-700' : 'from-red-600 to-rose-700';

  return (
    <div className={`p-6 md:p-8 max-w-6xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-700 ${!isDark ? 'bg-white' : ''}`}>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className={`text-3xl md:text-4xl mb-2 ${headingClass}`}>Ahoj, {user.name.split(' ')[0]} 👋</h1>
          <p className={`${isDark ? 'text-zinc-400' : 'text-zinc-500 font-bold'} text-sm md:text-base`}>Dnes je skvelý deň na posilnenie tvojich zručností.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className={`${isDark ? 'bg-zinc-900/50 border-white/10' : 'bg-zinc-50 border-black/5 shadow-sm'} border p-3 md:p-4 rounded-2xl flex items-center gap-4 flex-1 md:flex-none`}>
            <div className={`${isDark ? 'bg-blue-500/20 text-blue-500' : 'bg-red-500/10 text-red-600'} p-2 rounded-lg`}>
              <Trophy size={20} />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-black leading-none">{user.certificates.length}</p>
              <p className={`text-[10px] uppercase font-black ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Certifikáty</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className={`bg-gradient-to-br ${brandGradient} p-6 md:p-8 rounded-[2rem] relative overflow-hidden group cursor-pointer shadow-xl shadow-red-500/10 md:col-span-2`} 
          onClick={() => onNavigate('PROFILE')}
        >
          <div className="relative z-10 h-full flex flex-col justify-between min-h-[160px]">
            <h3 className={`text-2xl md:text-3xl font-black leading-tight text-white`}>Zdokonal svoje<br/>Portfólio</h3>
            <div className="flex items-center gap-2 text-white/80 font-bold text-sm">
              Prejsť na profil <ArrowUpRight size={16} />
            </div>
          </div>
          <Sparkles className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 group-hover:scale-110 transition-transform duration-500" />
        </div>

        <div className={`${isDark ? 'bg-zinc-900 border-white/5' : 'bg-zinc-50 border-black/5 shadow-sm'} border rounded-[2rem] p-6 md:p-8`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-xl ${headingClass}`}>Uložené príležitosti</h3>
            <button onClick={() => onNavigate('CALENDAR')} className={`text-sm hover:underline font-black ${brandColor}`}>Všetky</button>
          </div>
          <div className="space-y-4">
            {savedOpps.length > 0 ? (
              savedOpps.slice(0, 3).map((opp) => (
                <div key={opp.id} className={`p-4 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`${isDark ? 'bg-zinc-800 text-blue-400' : 'bg-zinc-100 text-red-500'} p-2 rounded-xl`}>
                      {getIconForType(opp.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm line-clamp-1">{opp.title}</h4>
                      <div className={`flex items-center gap-2 text-[10px] font-bold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        <MapPin size={10} /> {opp.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-zinc-500 text-sm font-bold">
                Zatiaľ nemáš uložené žiadne udalosti.
              </div>
            )}
          </div>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl ${headingClass}`}>Navrhované pre teba</h3>
          <button onClick={() => onNavigate('CALENDAR')} className={`text-sm font-black ${brandColor}`}>Zobraziť viac</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.slice(0, 2).map((opp) => (
            <div key={opp.id} className={`group p-6 rounded-3xl border transition-all flex justify-between items-center ${isDark ? 'bg-zinc-950 border-white/5 hover:border-blue-500/30' : 'bg-white border-black/5 hover:border-red-600/30 shadow-sm'}`}>
               <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-zinc-900 text-zinc-600' : 'bg-zinc-50 text-zinc-400'}`}>
                    {getIconForType(opp.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold truncate">{opp.title}</h4>
                    <p className={`text-xs font-bold truncate ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{opp.type} • {opp.location}</p>
                  </div>
               </div>
               <button onClick={() => onNavigate('CALENDAR')} className={`p-2 rounded-xl transition-colors shrink-0 ml-2 ${isDark ? 'bg-zinc-900 group-hover:bg-blue-600 text-white' : 'bg-zinc-100 group-hover:bg-red-600 text-zinc-600 group-hover:text-white'}`}>
                  <ArrowUpRight size={18} />
               </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
