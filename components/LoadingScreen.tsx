
import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import { CheckCircle2, Globe, Star, GraduationCap } from 'lucide-react';

const BENEFITS = [
  {
    title: "Profesionálne Portfólio",
    desc: "Premeň svoje certifikáty a projekty na vizuálne úžasnú prezentáciu.",
    icon: <Star className="text-amber-400" />,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Overenie Zručností",
    desc: "Získaj odznaky za úspešné absolvovanie odborných kvízov.",
    icon: <CheckCircle2 className="text-green-400" />,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Svet Možností",
    desc: "Sleduj Erasmus+ pobyty a stáže v jednom prehľadnom kalendári.",
    icon: <Globe className="text-blue-400" />,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Rast Kariéry",
    desc: "Prepájame študentov s príležitosťami, ktoré menia život.",
    icon: <GraduationCap className="text-purple-400" />,
    image: "https://images.unsplash.com/photo-1523240715632-d128ef3135c3?auto=format&fit=crop&q=80&w=1000"
  }
];

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [benefitIndex, setBenefitIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 30); // Slower progress to show benefits

    const benefitInterval = setInterval(() => {
      setBenefitIndex((prev) => (prev + 1) % BENEFITS.length);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(benefitInterval);
    };
  }, []);

  const currentBenefit = BENEFITS[benefitIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col md:flex-row items-stretch justify-center overflow-hidden font-sans">
      {/* Visual Content Side */}
      <div className="relative flex-1 hidden md:block overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
        {BENEFITS.map((b, i) => (
          <img
            key={i}
            src={b.image}
            alt={b.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === benefitIndex ? 'opacity-60 scale-100' : 'opacity-0 scale-110'
            }`}
          />
        ))}
        
        <div className="absolute bottom-20 left-16 z-20 max-w-md animate-in fade-in slide-in-from-left-8 duration-700">
           <div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                {currentBenefit.icon}
              </div>
              <h3 className="text-3xl font-black font-jakarta mb-3">{currentBenefit.title}</h3>
              <p className="text-zinc-300 leading-relaxed font-bold">{currentBenefit.desc}</p>
           </div>
        </div>
      </div>

      {/* Loading Action Side */}
      <div className="w-full md:w-[500px] flex flex-col items-center justify-center p-12 bg-zinc-950 relative">
        {/* Mobile Background Image (Subtle) */}
        <div className="absolute inset-0 md:hidden opacity-10">
          <img src={currentBenefit.image} className="w-full h-full object-cover" />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
             <Logo className="w-16 h-16 text-black" />
          </div>
          
          <h1 className="text-4xl font-black font-jakarta tracking-tight mb-2 text-white text-center">
            Digitálny študent
          </h1>
          <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] mb-12">
            Vaša cesta k úspechu začína tu
          </p>
          
          {/* Progress Bar Container */}
          <div className="w-full space-y-4 px-10">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">
              <span>Konfigurácia</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-16 text-center md:hidden">
             <h4 className="font-bold text-xl mb-2">{currentBenefit.title}</h4>
             <p className="text-sm text-zinc-500">{currentBenefit.desc}</p>
          </div>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-12 left-0 right-0 px-12 text-center">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest leading-relaxed">
            Certifikáty • Portfólio • Kvízy • Príležitosti
          </p>
        </div>
      </div>

      {/* Background pulses */}
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
};

export default LoadingScreen;
