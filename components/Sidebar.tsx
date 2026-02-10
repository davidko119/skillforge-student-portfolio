
import React from 'react';
import { View, User, UserRole, AppTheme } from '../types';
import Logo from './Logo';
import {
  LayoutDashboard,
  UserCircle,
  CalendarDays,
  GraduationCap,
  Hammer,
  LogOut,
  Globe,
  Moon,
  Sun,
  Palette,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  user: User;
  onLogout: () => void;
  theme: AppTheme;
  onToggleTheme: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView, onNavigate, user, onLogout, theme, onToggleTheme, isOpen, setIsOpen
}) => {
  const isDark = theme === 'MODERN_DARK';
  const brandColor = isDark ? 'text-red-500' : 'text-red-600';
  const brandBgAlpha = isDark ? 'bg-red-500/10' : 'bg-red-600/10';
  const brandBorder = isDark ? 'border-red-500/20' : 'border-red-600/20';

  const menuItems = [
    { id: 'DASHBOARD' as View, label: 'Prehľad', icon: LayoutDashboard },
    { id: 'PROFILE' as View, label: 'Nastavenia Portfólia', icon: UserCircle },
    { id: 'PORTFOLIO_PREVIEW' as View, label: 'Verejné Portfólio', icon: Globe },
    { id: 'QUIZZES' as View, label: 'Knižnica Kvízov', icon: GraduationCap },
    { id: 'CALENDAR' as View, label: 'Príležitosti', icon: CalendarDays },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-64 border-r flex flex-col h-full transition-all duration-300 z-[200]
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isDark ? 'border-white/10 bg-zinc-950' : 'border-black/5 bg-zinc-50 shadow-2xl md:shadow-none'}
      `}>
        <div className="p-6 flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <span className="text-lg font-black font-jakarta tracking-tight leading-none">Digitálny<br />študent</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-zinc-500">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 mb-6">
          <button
            onClick={onToggleTheme}
            className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all ${isDark ? 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white' : 'bg-white border-black/5 text-zinc-500 hover:text-black shadow-sm'}`}
          >
            <div className="flex items-center gap-2">
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
              <span className="text-[10px] font-black uppercase tracking-widest">{isDark ? 'Modern Dark' : 'Clean Light'}</span>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${brandBgAlpha}`}>
              <Palette size={12} className={brandColor} />
            </div>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                    ? `${brandBgAlpha} ${brandColor} border ${brandBorder}`
                    : `${isDark ? 'text-zinc-400 hover:text-white hover:bg-white/5' : 'text-zinc-500 hover:text-black hover:bg-black/5'}`
                  }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`font-semibold text-sm`}>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-8 pb-4">
            <p className={`px-3 text-[10px] uppercase tracking-widest font-black mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Creator Mode</p>
            <button
              onClick={() => onNavigate('CREATOR_HUB')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${currentView === 'CREATOR_HUB'
                  ? `${isDark ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-amber-100 text-amber-600 border border-amber-200'}`
                  : `${isDark ? 'text-zinc-400 hover:text-white hover:bg-white/5' : 'text-zinc-500 hover:text-black hover:bg-black/5'}`
                }`}
            >
              <Hammer size={20} strokeWidth={currentView === 'CREATOR_HUB' ? 2.5 : 2} />
              <span className="font-semibold text-sm">Vytvoriť kvíz</span>
            </button>
          </div>
        </nav>

        <div className={`p-4 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <div className="flex items-center gap-3 px-3 py-4 mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase ${isDark ? 'bg-zinc-800' : 'bg-zinc-200 text-zinc-600'}`}>
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className={`text-[10px] uppercase font-bold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{user.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-bold">Odhlásiť sa</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
