/* ID-START: GUI_TSX_001 */
import { motion } from 'motion/react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="text-center"
      >
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-2">
          SynCore <span className="text-green-500">Media</span>
        </h1>
        <p className="text-sm uppercase tracking-[0.4em] opacity-40 mb-12">
          Powered by Synthesis Studio
        </p>
        
        <button 
          onClick={() => window.location.hash = '/login'}
          className="border border-white/20 px-12 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-sm"
        >
          VSTOUPIT
        </button>
      </motion.div>

      <footer className="absolute bottom-10 opacity-20 text-[10px] uppercase tracking-widest flex gap-4">
        <a href="#" className="hover:opacity-100">Pravidla</a>
        <span>|</span>
        <a href="#" className="hover:opacity-100">Podmínky</a>
      </footer>
    </div>
  );
};
/* ID-END: GUI_TSX_001 */
