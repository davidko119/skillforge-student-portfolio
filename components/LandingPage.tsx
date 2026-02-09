
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { 
  ArrowRight, Star, Globe, Award, 
  Linkedin, Github, Twitter, Mail, Check, Sparkles, Activity, ChevronDown, Zap
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  theme?: string;
}

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0 group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-8 flex justify-between items-center text-left transition-all"
      >
        <span className="text-xl font-bold text-zinc-300 group-hover:text-white transition-colors">{question}</span>
        <div className={`p-2 rounded-full transition-all ${isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-white/5 text-zinc-500'}`}>
          <ChevronDown size={20} />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl font-bold">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon, delay }: { title: string, desc: string, icon: React.ReactNode, delay: string }) => (
  <div className={`group relative p-10 bg-zinc-950 border border-white/5 rounded-[2.5rem] hover:bg-zinc-900/50 transition-all duration-700 animate-in fade-in slide-in-from-bottom-10 ${delay}`}>
    <div className="absolute -inset-px bg-gradient-to-br from-blue-600/20 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="relative z-10">
      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all duration-500 text-zinc-400">
        {icon}
      </div>
      <h3 className="text-2xl font-black font-jakarta mb-4 group-hover:text-white transition-colors tracking-tight">{title}</h3>
      <p className="text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors font-bold">{desc}</p>
    </div>
    {/* Glow shadow effect */}
    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#030303] min-h-screen text-white selection:bg-blue-500 selection:text-white font-inter overflow-x-hidden">
      {/* Background Lighting Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[180px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${scrolled ? 'bg-black/60 backdrop-blur-2xl border-white/10 h-20' : 'bg-transparent border-transparent h-28'}`}>
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-transform hover:scale-110">
              <Logo className="w-8 h-8 text-black" />
            </div>
            <span className="text-xl font-black font-jakarta tracking-tighter leading-none">Digitálny<br/>študent</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            <a href="#features" className="hover:text-blue-500 transition-colors">Vlastnosti</a>
            <a href="#preview" className="hover:text-blue-500 transition-colors">Ukážka</a>
            <a href="#pricing" className="hover:text-blue-500 transition-colors">Cenník</a>
            <a href="#faq" className="hover:text-blue-500 transition-colors">Otázky</a>
          </div>
          <button 
            onClick={onStart}
            className="px-8 py-3 bg-white text-black font-black rounded-full hover:bg-blue-600 hover:text-white hover:scale-105 transition-all text-[11px] uppercase tracking-widest shadow-xl"
          >
            Vstúpiť
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-64 pb-32 px-8">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] animate-in fade-in slide-in-from-top-4 duration-1000">
             Next-Gen Student Hub
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black font-jakarta tracking-tighter leading-[0.85] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Buduj budúcnosť. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500">Buď digitálny.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-500 max-w-3xl mx-auto font-black leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
            Jediná platforma pre študentov na Slovensku, ktorá prepojí tvoj talent so svetovými príležitosťami.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <button 
              onClick={onStart}
              className="px-12 py-6 bg-blue-600 text-white font-black rounded-[2.5rem] hover:scale-105 hover:shadow-[0_0_60px_rgba(37,99,235,0.5)] transition-all text-xl flex items-center gap-3 group uppercase tracking-widest"
            >
              Vytvoriť profil <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-24 space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Možnosti</p>
          <h2 className="text-5xl md:text-7xl font-black font-jakarta tracking-tighter">Všetko na <span className="text-zinc-500">jednom mieste.</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard title="Workflow Automation" desc="Sledujeme tvoje pokroky a automaticky aktualizujeme tvoje verejné portfólio." icon={<Activity />} delay="[animation-delay:0ms]" />
          <FeatureCard title="AI Opportunity Finder" desc="Naša AI ti poradí, ktoré stáže a projekty sú pre teba tie pravé." icon={<Sparkles />} delay="[animation-delay:150ms]" />
          <FeatureCard title="Erasmus Hub" desc="Získaj prístup k exkluzívnym výmenným pobytom a grantom." icon={<Globe />} delay="[animation-delay:300ms]" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-48 px-8 relative overflow-hidden bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center space-y-16">
           <h2 className="text-6xl md:text-9xl font-black font-jakarta tracking-tighter leading-none">Začni svoju <br /> <span className="text-blue-500">cestu dnes.</span></h2>
           <button 
             onClick={onStart}
             className="px-16 py-8 bg-white text-black font-black rounded-full text-2xl hover:scale-105 transition-all shadow-2xl flex items-center gap-4 mx-auto uppercase tracking-widest"
           >
             Vstúpiť <Logo className="w-8 h-8 text-black" />
           </button>

           <div className="pt-48 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Logo className="w-8 h-8 text-black" />
                </div>
                <span className="text-lg font-black font-jakarta tracking-tight">Digitálny študent</span>
              </div>
              
              <div className="flex gap-6">
                {[Linkedin, Twitter, Github, Mail].map((Icon, i) => (
                  <a key={i} href="#" className="p-3 bg-white/5 rounded-2xl text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
           </div>
           
           <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em] pt-12">
             &copy; {new Date().getFullYear()} Digitálny študent • Platforma pre budúcnosť
           </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
