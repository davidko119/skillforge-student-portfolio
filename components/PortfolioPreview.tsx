
import React, { useState } from 'react';
import { User } from '../types';
import { Github, Linkedin, Mail, ArrowUpRight, Award, X, Maximize2, GraduationCap, Briefcase, Languages as LangIcon, MapPin, Calendar, ArrowLeft } from 'lucide-react';

interface PortfolioPreviewProps {
  user: User;
  onBack?: () => void;
}

const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ user, onBack }) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const config = user.portfolioConfig || { layout: 'STANDARD', theme: 'RED', font: 'INTER' };

  const themeColors: Record<string, { accent: string, text: string, bg: string, border: string, bgSoft: string }> = {
    RED: { accent: 'text-red-500', text: 'text-red-500', bg: 'bg-red-600', border: 'border-red-500/20', bgSoft: 'bg-red-500/10' },
    BLUE: { accent: 'text-blue-500', text: 'text-blue-500', bg: 'bg-blue-600', border: 'border-blue-500/20', bgSoft: 'bg-blue-500/10' },
    PURPLE: { accent: 'text-purple-500', text: 'text-purple-500', bg: 'bg-purple-600', border: 'border-purple-500/20', bgSoft: 'bg-purple-500/10' },
    ORANGE: { accent: 'text-orange-500', text: 'text-orange-500', bg: 'bg-orange-600', border: 'border-orange-500/20', bgSoft: 'bg-orange-500/10' },
    GREEN: { accent: 'text-green-500', text: 'text-green-500', bg: 'bg-green-600', border: 'border-green-500/20', bgSoft: 'bg-green-500/10' },
    NEUTRAL: { accent: 'text-white', text: 'text-white', bg: 'bg-white', border: 'border-white/20', bgSoft: 'bg-white/10' },
  };

  const theme = themeColors[config.theme] || themeColors.RED;
  const fonts: Record<string, string> = { INTER: 'font-inter', JAKARTA: 'font-jakarta', SPACE: 'font-space', PLAYFAIR: 'font-playfair' };
  const fontClass = fonts[config.font] || 'font-inter';

  /* STATE FOR PROJECT OVERLAY */
  const [activeProject, setActiveProject] = useState<any | null>(null);

  /* Helper to close overlay */
  const closeOverlay = () => setActiveProject(null);

  return (
    <div className={`bg-black min-h-screen text-white selection:bg-red-500 selection:text-white ${fontClass} relative`}>

      {/* PLÁVAJÚCE TLAČIDLO NASPÄŤ */}
      {onBack && (
        <button
          onClick={onBack}
          className="fixed top-8 left-8 z-[150] flex items-center gap-3 px-6 py-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/30 transition-all group shadow-2xl active:scale-95"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Naspäť do aplikácie
        </button>
      )}

      {/* HERO SECTION */}
      <div className={`relative px-8 max-w-7xl mx-auto text-center ${config.layout === 'MINIMAL' ? 'pt-48 pb-32' : 'pt-32 pb-24'}`}>
        <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[150px] rounded-full -z-10 opacity-10 ${theme.bg}`} />

        {user.avatarUrl && (
          <div className="mb-10 flex justify-center animate-in fade-in zoom-in duration-1000">
            <div className={`w-40 h-40 md:w-56 md:h-56 rounded-[3.5rem] overflow-hidden border-4 border-white/10 shadow-2xl relative group`}>
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>
        )}

        <h1 className="text-6xl md:text-8xl font-black leading-tight mb-8 tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700 font-jakarta">
          {user.headline || user.name}
        </h1>

        <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-bold leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
          {user.bio}
        </p>

        <div className="flex justify-center gap-8 mt-16 animate-in fade-in slide-in-from-bottom-16 duration-1000">
          {user.socialLinks?.linkedin && (
            <a href={user.socialLinks.linkedin} className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
              <Linkedin size={24} /> <span className="font-bold hidden sm:inline uppercase text-xs tracking-widest">LinkedIn</span>
            </a>
          )}
          {user.socialLinks?.github && (
            <a href={user.socialLinks.github} className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
              <Github size={24} /> <span className="font-bold hidden sm:inline uppercase text-xs tracking-widest">GitHub</span>
            </a>
          )}
          <a href={`mailto:${user.email}`} className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
            <Mail size={24} /> <span className="font-bold hidden sm:inline uppercase text-xs tracking-widest">Kontakt</span>
          </a>
        </div>
      </div>

      {/* SKILLS */}
      <section className="px-8 max-w-5xl mx-auto pb-32 text-center">
        <h3 className="text-sm font-black uppercase tracking-[0.5em] text-zinc-600 mb-12">Expertíza</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {user.skills.map(skill => (
            <span key={skill} className={`px-6 py-3 bg-zinc-900 border border-white/5 rounded-2xl text-lg font-black hover:scale-105 transition-all hover:text-white`}>
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* EXPERIENCE & EDUCATION SECTION */}
      <div className="px-8 max-w-7xl mx-auto py-32 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-20">
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${theme.bgSoft} ${theme.accent}`}><Briefcase size={32} /></div>
            <h2 className="text-4xl font-black font-jakarta">Skúsenosti</h2>
          </div>
          <div className="space-y-12">
            {user.experience?.map((exp, idx) => (
              <div key={exp.id} className="relative pl-8 border-l-2 border-white/5">
                <div className={`absolute top-0 -left-[9px] w-4 h-4 rounded-full ${theme.bg}`} />
                <div className="space-y-2">
                  <span className={`text-xs font-black uppercase tracking-widest ${theme.accent}`}>{exp.startDate} - {exp.current ? 'Súčasnosť' : exp.endDate}</span>
                  <h3 className="text-2xl font-black">{exp.position}</h3>
                  <p className="text-zinc-500 font-bold flex items-center gap-2 text-sm uppercase tracking-tight">
                    {exp.company} <span className="text-zinc-700">•</span> <MapPin size={12} /> {exp.location}
                  </p>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-md">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${theme.bgSoft} ${theme.accent}`}><GraduationCap size={32} /></div>
            <h2 className="text-4xl font-black font-jakarta">Vzdelanie</h2>
          </div>
          <div className="space-y-12">
            {user.education?.map((edu) => (
              <div key={edu.id} className="relative pl-8 border-l-2 border-white/5">
                <div className={`absolute top-0 -left-[9px] w-4 h-4 rounded-full border-2 border-white ${theme.bg}`} />
                <div className="space-y-2">
                  <span className={`text-xs font-black uppercase tracking-widest ${theme.accent}`}>{edu.startYear} - {edu.endYear}</span>
                  <h3 className="text-2xl font-black">{edu.school}</h3>
                  <p className="text-zinc-500 font-bold text-sm uppercase tracking-tight">{edu.degree} v odbore {edu.field}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* LANGUAGES & CERTIFICATES */}
      <section className="py-32 bg-zinc-950 border-t border-white/5">
        <div className="px-8 max-w-7xl mx-auto space-y-32">
          {/* LANGUAGES PILLS */}
          <div className="text-center space-y-12">
            <h3 className="text-sm font-black uppercase tracking-[0.5em] text-zinc-600">Jazykové znalosti</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {user.languages?.map(lang => (
                <div key={lang.id} className="px-8 py-4 bg-black border border-white/5 rounded-[2rem] flex items-center gap-6">
                  <div className={`w-3 h-3 rounded-full ${theme.bg}`} />
                  <div className="text-left">
                    <p className="font-black text-lg leading-none mb-1">{lang.name}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${theme.accent}`}>{lang.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CERTIFICATES */}
          <div className="space-y-16">
            <h2 className="text-4xl font-black text-center font-jakarta">Získané Certifikáty</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {user.certificates.map((cert) => (
                <div key={cert.id} className="group cursor-zoom-in" onClick={() => setLightboxImage(cert.imageUrl)}>
                  <div className="aspect-video relative rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 transition-all group-hover:border-white/30">
                    <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="text-white" size={32} />
                    </div>
                  </div>
                  <div className="mt-6 px-4">
                    <h4 className="font-black text-xl font-jakarta">{cert.title}</h4>
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">{cert.issuer} • {new Date(cert.date).getFullYear()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="px-8 max-w-7xl mx-auto py-32 border-t border-white/5">
        <h2 className="text-5xl font-black tracking-tight font-jakarta mb-24">Vybrané Projekty</h2>
        <div className={`${config.layout === 'GRID' ? 'grid grid-cols-1 md:grid-cols-2 gap-16' : 'space-y-32'}`}>
          {user.projects?.map((project, idx) => (
            <div key={project.id} className={`flex flex-col group ${config.layout === 'GRID' ? '' : `lg:flex-row gap-16 items-center ${idx % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}`}>
              <div className="flex-1 space-y-6">
                <div className="flex gap-2 flex-wrap">
                  {project.tags?.map(t => <span key={t} className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-zinc-400 uppercase tracking-wider">{t}</span>)}
                </div>
                <h3 className="text-3xl font-black font-jakarta group-hover:text-red-500 transition-colors cursor-pointer" onClick={() => setActiveProject(project)}>{project.title}</h3>
                <p className="text-zinc-400 leading-relaxed font-bold line-clamp-3">{project.description}</p>
                <button onClick={() => setActiveProject(project)} className={`inline-flex items-center gap-3 px-8 py-4 ${theme.bg} text-white font-black rounded-full hover:scale-105 transition-all text-xs uppercase tracking-widest`}>
                  Zobraziť Detail <ArrowUpRight size={18} />
                </button>
              </div>
              <div className="flex-1 aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 cursor-pointer" onClick={() => setActiveProject(project)}>
                <img src={project.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-48 text-center px-8 relative overflow-hidden">
        <h2 className="text-6xl md:text-8xl font-black mb-12 tracking-tighter font-jakarta">Napíš mi.</h2>
        <a href={`mailto:${user.email}`} className={`text-3xl md:text-5xl font-black underline decoration-2 underline-offset-8 transition-colors ${theme.text}`}>{user.email}</a>
      </footer>

      {/* PROJECT DETAIL OVERLAY */}
      {activeProject && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl overflow-y-auto animate-in slide-in-from-bottom-20 duration-500">
          <button onClick={closeOverlay} className="fixed top-8 right-8 z-[110] p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"><X size={24} /></button>

          <div className="max-w-5xl mx-auto p-8 pb-32">
            <div className="w-full h-[50vh] rounded-[3rem] overflow-hidden mb-16 relative">
              <img src={activeProject.imageUrl} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-10 left-10 right-10">
                <h2 className="text-5xl md:text-7xl font-black font-jakarta mb-4">{activeProject.title}</h2>
                <div className="flex gap-3">
                  {activeProject.tags?.map((t: string) => <span key={t} className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-black uppercase tracking-widest">{t}</span>)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="md:col-span-2 space-y-8">
                <p className="text-xl md:text-2xl text-zinc-300 font-bold leading-relaxed whitespace-pre-line">{activeProject.detailedDescription || activeProject.description}</p>

                {/* GALLERY GRID */}
                {activeProject.galleryImages && activeProject.galleryImages.length > 0 && (
                  <div className="space-y-6 pt-8">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">Galéria</h3>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                      {activeProject.galleryImages.map((img: string, i: number) => (
                        <div key={i} className="aspect-square rounded-2xl overflow-hidden cursor-zoom-in hover:opacity-80 transition-opacity" onClick={() => setLightboxImage(img)}>
                          <img src={img} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-8">
                <div className="p-8 bg-zinc-900 rounded-3xl border border-white/5 space-y-6">
                  <h3 className="text-xl font-black">O Projekte</h3>
                  <p className="text-zinc-400 font-bold text-sm">{activeProject.description}</p>
                  <a href={activeProject.link} target="_blank" rel="noreferrer" className={`flex w-full items-center justify-center gap-2 py-4 rounded-xl font-black ${theme.bg} text-white uppercase tracking-widest text-xs hover:opacity-90 transition-opacity`}>
                    Navštíviť web <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-8 animate-in fade-in duration-300" onClick={() => setLightboxImage(null)}>
          <button className="absolute top-10 right-10 p-4 text-white hover:text-red-500 transition-colors z-[210]" onClick={() => setLightboxImage(null)}>
            <X size={40} />
          </button>
          <img src={lightboxImage} className="max-w-7xl max-h-[85vh] rounded-xl shadow-2xl object-contain animate-in zoom-in-95 duration-500" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default PortfolioPreview;
