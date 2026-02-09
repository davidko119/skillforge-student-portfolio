
import React, { useState, useRef } from 'react';
import { User, Certificate, Project, PortfolioConfig, AppTheme, Education, Experience, Language } from '../types';
import { 
  Plus, Trash2, ExternalLink, X, Upload, Camera, 
  Palette, Check, QrCode, Download, Copy,
  Layout, Type, Paintbrush, Monitor, Layers, Columns,
  GraduationCap, Briefcase, Languages as LangIcon, Calendar
} from 'lucide-react';

interface ProfileProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  theme: AppTheme;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser, theme }) => {
  const isDark = theme === 'MODERN_DARK';
  const brandColor = isDark ? 'text-blue-500' : 'text-red-600';
  const brandBg = isDark ? 'bg-blue-600' : 'bg-red-600';
  const brandBgAlpha = isDark ? 'bg-blue-600/10' : 'bg-red-600/10';
  const brandFocus = isDark ? 'focus:border-blue-500/30' : 'focus:border-red-500/30';
  const headingClass = "font-black font-jakarta tracking-tight";

  const [newCert, setNewCert] = useState<Partial<Certificate>>({ title: '', issuer: '', date: '', imageUrl: '' });
  const [newEdu, setNewEdu] = useState<Partial<Education>>({ school: '', degree: '', field: '', startYear: '', endYear: '' });
  const [newExp, setNewExp] = useState<Partial<Experience>>({ company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' });
  const [newLang, setNewLang] = useState<Partial<Language>>({ name: '', level: 'B2' });
  const [newSkill, setNewSkill] = useState('');
  
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const currentConfig: PortfolioConfig = user.portfolioConfig || { layout: 'STANDARD', theme: 'BLUE', font: 'INTER' };
  const shareableUrl = `${window.location.origin}${window.location.pathname}?view=portfolio&userId=${encodeURIComponent(user.email)}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(shareableUrl)}&bgcolor=ffffff&color=000000&margin=2`;

  const updateUserInfo = (updates: Partial<User>) => setUser({ ...user, ...updates });
  const updatePortfolioConfig = (configUpdates: Partial<PortfolioConfig>) => updateUserInfo({ portfolioConfig: { ...currentConfig, ...configUpdates } });

  const copyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addItem = (listKey: keyof User, item: any, resetFn: () => void, modalId: string) => {
    const list = (user[listKey] as any[]) || [];
    updateUserInfo({ [listKey]: [...list, { ...item, id: Math.random().toString(36).substr(2, 9) }] });
    resetFn();
    (document.getElementById(modalId) as any)?.close();
  };

  const removeItem = (listKey: keyof User, id: string) => {
    const list = (user[listKey] as any[]) || [];
    updateUserInfo({ [listKey]: list.filter(i => i.id !== id) });
  };

  const addSkill = () => {
    if (newSkill.trim() && !user.skills.includes(newSkill.trim())) {
      updateUserInfo({ skills: [...user.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  return (
    <div className={`p-6 md:p-8 max-w-5xl mx-auto space-y-8 md:space-y-12 pb-32 animate-in fade-in duration-500`}>
      
      {/* QR & PORTFOLIO HEADER */}
      <section className={`${isDark ? 'bg-zinc-950 border-blue-500/20' : 'bg-white border-red-600/10 shadow-xl shadow-red-500/5'} border-2 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-10`}>
        <div className="bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-xl shrink-0 group relative overflow-hidden border border-zinc-100">
          <img src={qrImageUrl} alt="Portfolio QR" className="w-40 h-40 md:w-48 md:h-48" />
        </div>
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div>
            <h3 className={`text-2xl md:text-3xl flex items-center justify-center md:justify-start gap-3 ${headingClass}`}>
              <QrCode className={brandColor} /> Tvoje Online Portfólio
            </h3>
            <p className={`${isDark ? 'text-zinc-500' : 'text-zinc-400 font-bold'} mt-2 text-sm md:text-base`}>Všetky tvoje úspechy na jednej adrese.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button onClick={copyLink} className={`px-6 py-3 border-2 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 ${copied ? 'bg-green-600 border-green-500 text-white' : `${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-black/5 text-black hover:bg-black/5'}`}`}>
              {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? 'Skopírované!' : 'Kopírovať Link'}
            </button>
          </div>
        </div>
      </section>

      {/* APPEARANCE EDITOR */}
      <section className={`${isDark ? 'bg-zinc-950 border-white/5' : 'bg-zinc-50 border-black/5 shadow-sm'} border p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] space-y-10`}>
        <div className="flex items-center gap-4 mb-2">
          <div className={`p-3 rounded-2xl ${brandBgAlpha} ${brandColor}`}><Palette size={24} /></div>
          <div>
            <h3 className={`text-2xl ${headingClass}`}>Editor Vzhľadu</h3>
            <p className="text-zinc-500 text-sm font-bold">Zmeň štýl svojho verejného profilu.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] flex items-center gap-2"><Layout size={12} /> Rozloženie</label>
              <div className="grid grid-cols-1 gap-2">
                {['STANDARD', 'GRID', 'MINIMAL'].map(l => (
                  <button key={l} onClick={() => updatePortfolioConfig({ layout: l as any })} className={`p-4 rounded-xl border-2 transition-all text-sm font-bold ${currentConfig.layout === l ? (isDark ? 'bg-white text-black' : 'bg-zinc-900 text-white') : 'text-zinc-500'}`}>{l}</button>
                ))}
              </div>
           </div>
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] flex items-center gap-2"><Paintbrush size={12} /> Farba</label>
              <div className="flex flex-wrap gap-3">
                {['BLUE', 'PURPLE', 'ORANGE', 'GREEN', 'NEUTRAL'].map(t => (
                  <button key={t} onClick={() => updatePortfolioConfig({ theme: t as any })} className={`w-10 h-10 rounded-full border-2 ${currentConfig.theme === t ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: t === 'BLUE' ? '#3b82f6' : t === 'PURPLE' ? '#a855f7' : t === 'ORANGE' ? '#f97316' : t === 'GREEN' ? '#22c55e' : '#71717a' }} />
                ))}
              </div>
           </div>
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] flex items-center gap-2"><Type size={12} /> Písmo</label>
              <div className="grid grid-cols-1 gap-2">
                {['INTER', 'JAKARTA', 'SPACE', 'PLAYFAIR'].map(f => (
                  <button key={f} onClick={() => updatePortfolioConfig({ font: f as any })} className={`p-4 rounded-xl border-2 transition-all text-sm font-bold ${currentConfig.font === f ? (isDark ? 'bg-white text-black' : 'bg-zinc-900 text-white') : 'text-zinc-500'}`}>{f}</button>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* CORE INFO */}
      <div className={`${isDark ? 'bg-zinc-950 border-white/5' : 'bg-zinc-50 border-black/5 shadow-sm'} border p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] flex flex-col md:flex-row items-center gap-8 md:gap-10`}>
        <div className="relative">
          <div className={`w-32 h-32 md:w-44 md:h-44 rounded-3xl border-4 flex items-center justify-center overflow-hidden ${isDark ? 'bg-zinc-800 border-white/10' : 'bg-white border-black/5'}`}>
            {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover" /> : <span className="text-4xl text-zinc-500">{user.name.charAt(0)}</span>}
          </div>
          <button onClick={() => avatarInputRef.current?.click()} className={`absolute -bottom-2 -right-2 p-3 rounded-xl ${brandBg} text-white shadow-xl`}><Camera size={20} /></button>
          <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => updateUserInfo({ avatarUrl: reader.result as string });
              reader.readAsDataURL(file);
            }
          }} />
        </div>
        <div className="flex-1 w-full space-y-4">
          <input type="text" className={`bg-transparent text-3xl md:text-5xl font-black outline-none w-full border-b-2 border-transparent focus:border-blue-500/30 pb-2`} value={user.name} onChange={(e) => updateUserInfo({ name: e.target.value })} />
          <textarea className="bg-transparent text-lg outline-none w-full h-24 resize-none font-bold text-zinc-500" value={user.bio} placeholder="Tvoj bio..." onChange={(e) => updateUserInfo({ bio: e.target.value })} />
        </div>
      </div>

      {/* SKILLS */}
      <section className="space-y-6">
        <h3 className={`text-2xl ${headingClass}`}>Zručnosti</h3>
        <div className="flex flex-wrap gap-3">
          {user.skills.map(s => (
            <div key={s} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl font-bold">
              {s} <button onClick={() => updateUserInfo({ skills: user.skills.filter(sk => sk !== s) })} className="text-zinc-600 hover:text-red-500"><X size={14} /></button>
            </div>
          ))}
          <div className="flex gap-2">
            <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addSkill()} placeholder="Pridať skill..." className="bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500" />
            <button onClick={addSkill} className={`p-2 rounded-xl ${brandBg} text-white`}><Plus size={20} /></button>
          </div>
        </div>
      </section>

      {/* EDUCATION & EXPERIENCE & LANGUAGES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* EDUCATION */}
        <section className="space-y-4">
           <div className="flex justify-between items-center">
             <h3 className={`text-xl flex items-center gap-2 ${headingClass}`}><GraduationCap size={20} className={brandColor} /> Vzdelanie</h3>
             <button onClick={() => (document.getElementById('edu-modal') as any).showModal()} className={`${brandColor} font-black text-xs uppercase`}>+ Pridať</button>
           </div>
           <div className="space-y-4">
              {user.education?.map(edu => (
                <div key={edu.id} className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl flex justify-between items-start">
                  <div>
                    <p className="font-bold">{edu.school}</p>
                    <p className="text-xs text-zinc-500">{edu.degree} • {edu.field}</p>
                    <p className="text-[10px] text-zinc-600 font-bold">{edu.startYear} - {edu.endYear}</p>
                  </div>
                  <button onClick={() => removeItem('education', edu.id)} className="text-red-500"><Trash2 size={14} /></button>
                </div>
              ))}
           </div>
        </section>

        {/* EXPERIENCE */}
        <section className="space-y-4">
           <div className="flex justify-between items-center">
             <h3 className={`text-xl flex items-center gap-2 ${headingClass}`}><Briefcase size={20} className={brandColor} /> Skúsenosti</h3>
             <button onClick={() => (document.getElementById('exp-modal') as any).showModal()} className={`${brandColor} font-black text-xs uppercase`}>+ Pridať</button>
           </div>
           <div className="space-y-4">
              {user.experience?.map(exp => (
                <div key={exp.id} className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl flex justify-between items-start">
                  <div>
                    <p className="font-bold">{exp.position}</p>
                    <p className="text-xs text-zinc-500">{exp.company} • {exp.location}</p>
                    <p className="text-[10px] text-zinc-600 font-bold">{exp.startDate} - {exp.current ? 'Súčasnosť' : exp.endDate}</p>
                  </div>
                  <button onClick={() => removeItem('experience', exp.id)} className="text-red-500"><Trash2 size={14} /></button>
                </div>
              ))}
           </div>
        </section>
      </div>

      {/* LANGUAGES */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className={`text-xl flex items-center gap-2 ${headingClass}`}><LangIcon size={20} className={brandColor} /> Jazyky</h3>
          <button onClick={() => (document.getElementById('lang-modal') as any).showModal()} className={`${brandColor} font-black text-xs uppercase`}>+ Pridať</button>
        </div>
        <div className="flex flex-wrap gap-4">
          {user.languages?.map(lang => (
            <div key={lang.id} className="px-4 py-3 bg-zinc-900 border border-white/5 rounded-2xl flex items-center gap-4">
              <div>
                <p className="font-bold text-sm">{lang.name}</p>
                <p className="text-[10px] font-black text-zinc-500 uppercase">{lang.level}</p>
              </div>
              <button onClick={() => removeItem('languages', lang.id)} className="text-red-500"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </section>

      {/* MODALS */}
      <dialog id="edu-modal" className="bg-zinc-950 border border-white/10 p-8 rounded-[2rem] text-white w-full max-w-md outline-none backdrop:backdrop-blur-md">
        <h3 className="text-xl font-black mb-6">Pridať vzdelanie</h3>
        <div className="space-y-4">
          <input placeholder="Škola" className="w-full bg-zinc-900 p-4 rounded-xl outline-none" onChange={e => setNewEdu({...newEdu, school: e.target.value})} />
          <input placeholder="Titul (napr. Bc.)" className="w-full bg-zinc-900 p-4 rounded-xl outline-none" onChange={e => setNewEdu({...newEdu, degree: e.target.value})} />
          <input placeholder="Odbor" className="w-full bg-zinc-900 p-4 rounded-xl outline-none" onChange={e => setNewEdu({...newEdu, field: e.target.value})} />
          <div className="flex gap-4">
            <input placeholder="Od (rok)" className="flex-1 bg-zinc-900 p-4 rounded-xl outline-none" onChange={e => setNewEdu({...newEdu, startYear: e.target.value})} />
            <input placeholder="Do (rok)" className="flex-1 bg-zinc-900 p-4 rounded-xl outline-none" onChange={e => setNewEdu({...newEdu, endYear: e.target.value})} />
          </div>
          <button onClick={() => addItem('education', newEdu, () => setNewEdu({}), 'edu-modal')} className={`w-full py-4 rounded-xl font-black ${brandBg}`}>Uložiť</button>
          <button onClick={() => (document.getElementById('edu-modal') as any).close()} className="w-full py-4 text-zinc-500 font-bold">Zrušiť</button>
        </div>
      </dialog>

      <dialog id="exp-modal" className="bg-zinc-950 border border-white/10 p-8 rounded-[2rem] text-white w-full max-w-md outline-none backdrop:backdrop-blur-md">
        <h3 className="text-xl font-black mb-6">Pridať skúsenosť</h3>
        <div className="space-y-4">
          <input placeholder="Pozícia" className="w-full bg-zinc-900 p-4 rounded-xl outline-none" onChange={e => setNewExp({...newExp, position: e.target.value})} />
          <input placeholder="Firma" className="w-full bg-zinc-900 p-4 rounded-xl outline-none" onChange={e => setNewExp({...newExp, company: e.target.value})} />
          <input placeholder="Mesto / Krajina" className="w-full bg-zinc-900 p-4 rounded-xl outline-none" onChange={e => setNewExp({...newExp, location: e.target.value})} />
          <div className="flex gap-4">
            <input placeholder="Od" type="month" className="flex-1 bg-zinc-900 p-4 rounded-xl outline-none" onChange={e => setNewExp({...newExp, startDate: e.target.value})} />
            <input placeholder="Do" type="month" className="flex-1 bg-zinc-900 p-4 rounded-xl outline-none" onChange={e => setNewExp({...newExp, endDate: e.target.value})} />
          </div>
          <label className="flex items-center gap-2 px-2 text-sm font-bold text-zinc-400">
            <input type="checkbox" onChange={e => setNewExp({...newExp, current: e.target.checked})} /> Aktuálne tu pracujem
          </label>
          <button onClick={() => addItem('experience', newExp, () => setNewExp({}), 'exp-modal')} className={`w-full py-4 rounded-xl font-black ${brandBg}`}>Uložiť</button>
          <button onClick={() => (document.getElementById('exp-modal') as any).close()} className="w-full py-4 text-zinc-500 font-bold">Zrušiť</button>
        </div>
      </dialog>

      <dialog id="lang-modal" className="bg-zinc-950 border border-white/10 p-8 rounded-[2rem] text-white w-full max-w-sm outline-none backdrop:backdrop-blur-md">
        <h3 className="text-xl font-black mb-6">Pridať jazyk</h3>
        <div className="space-y-4">
          <input placeholder="Názov jazyka" className="w-full bg-zinc-900 p-4 rounded-xl outline-none" onChange={e => setNewLang({...newLang, name: e.target.value})} />
          <select className="w-full bg-zinc-900 p-4 rounded-xl outline-none" onChange={e => setNewLang({...newLang, level: e.target.value as any})}>
            {['Rodný jazyk', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button onClick={() => addItem('languages', newLang, () => setNewLang({}), 'lang-modal')} className={`w-full py-4 rounded-xl font-black ${brandBg}`}>Uložiť</button>
          <button onClick={() => (document.getElementById('lang-modal') as any).close()} className="w-full py-4 text-zinc-500 font-bold">Zrušiť</button>
        </div>
      </dialog>
    </div>
  );
};

export default Profile;
