
import React, { useState } from 'react';
import Logo from './Logo';
import { ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';

interface AuthProps {
  onAuth: (params: { mode: 'login' | 'register'; email: string; password: string; name?: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('student@skillforge.sk');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth({
      mode: isLogin ? 'login' : 'register',
      email,
      password,
      name: isLogin ? undefined : name,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden font-inter">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[150px] rounded-full" />

      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            <Logo className="w-16 h-16 text-black" />
          </div>
          <h1 className="text-4xl font-black font-jakarta tracking-tight mb-3 text-white">Digitálny študent</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Platforma pre budúce talenty.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-950 border border-white/10 rounded-[2.5rem] p-10 space-y-6 shadow-2xl">
          <div className="flex bg-zinc-900 p-1.5 rounded-2xl mb-4">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              Prihlásiť sa
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              Registrácia
            </button>
          </div>

          {!isLogin && (
            <div>
              <label className="text-xs uppercase font-bold text-zinc-500 block mb-2 px-1">Celé meno</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-5 py-4 pl-12 outline-none focus:ring-2 focus:ring-red-500 text-white transition-all font-bold"
                  placeholder="Ján Novák"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs uppercase font-bold text-zinc-500 block mb-2 px-1">E-mail</label>
            <div className="relative">
              <input
                type="email"
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-5 py-4 pl-12 outline-none focus:ring-2 focus:ring-red-500 text-white transition-all font-bold"
                placeholder="meno@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-zinc-500 block mb-2 px-1">Heslo</label>
            <div className="relative">
              <input
                type="password"
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-5 py-4 pl-12 outline-none focus:ring-2 focus:ring-red-500 text-white transition-all font-bold"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all transform active:scale-95 shadow-lg group uppercase text-xs tracking-widest"
          >
            {isLogin ? 'Vstúpiť do platformy' : 'Vytvoriť účet'}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-center text-[10px] text-zinc-600 uppercase font-black tracking-[0.2em] pt-4 cursor-pointer hover:text-white transition-colors">
            {isLogin ? 'Zabudli ste heslo?' : 'Máte už účet? Prihláste sa vyššie.'}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
