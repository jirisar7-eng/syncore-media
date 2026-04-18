/* ID-START: GUI_HUB_001 */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Rocket, Settings, ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react';
import { getSession, UserContext } from '../AuthStore';

export const HubPage = () => {
  const [session, setSession] = useState<UserContext | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) window.location.hash = '/login';
    setSession(s);
  }, []);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 md:p-10 pb-32 max-w-lg mx-auto flex flex-col gap-10">
      <header className="flex justify-between items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-black uppercase tracking-tighter leading-tight mb-2">
            Vítej v <span className="text-green-500">SynCore</span>
          </h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
            <ShieldCheck size={12} className="text-green-500" /> Jádro aktivní | Uživatel: {session.username}
          </p>
        </motion.div>
        
        <button 
          onClick={() => { localStorage.clear(); window.location.hash = '/login'; }}
          className="p-3 bg-white/5 rounded-full hover:text-red-500 transition-colors border border-white/5"
        >
          <LogOut size={18} />
        </button>
      </header>

      <section className="flex flex-col gap-6">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-4">Systémový Status</h2>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/60">G-Sync Streaming Engine 2.1</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/60">Vercel Build Pipeline Online</span>
                </div>
            </div>
            
            <button 
                onClick={() => window.location.hash = '/deploy'}
                className="mt-8 w-full py-4 bg-white/10 border border-white/5 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
                🚀 Do velitelského centra
            </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div 
                onClick={() => window.location.hash = '/search'}
                className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-green-500/5 transition-all text-center"
            >
                <Search size={32} className="text-green-500" />
                <span className="text-[9px] font-black uppercase tracking-widest">Hledat Média</span>
            </div>
            <div 
                onClick={() => window.location.hash = '/system'}
                className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-blue-500/5 transition-all text-center"
            >
                <Settings size={32} className="text-blue-500" />
                <span className="text-[9px] font-black uppercase tracking-widest">Diagnostika</span>
            </div>
        </div>
      </section>

      <footer className="mt-auto opacity-10 text-[9px] uppercase tracking-[0.5em] text-center">
        Synthesis Core V2 | Stable Release
      </footer>
    </div>
  );
};
/* ID-END: GUI_HUB_001 */
// Force sync F-99-PROD
