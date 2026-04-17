/* ID-START: GUI_TSX_003 */
import React from 'react';
import { motion } from 'motion/react';

export const SearchPage = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-xl"
      >
        <h1 className="text-3xl font-black uppercase tracking-tighter text-green-500 mb-4 italic">
          Search <span className="text-white">Under Construction</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-10">
          System Recovery Mode / Synthesis Core V2
        </p>
        <button 
          onClick={() => window.location.hash = '/hub'}
          className="px-10 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all active:scale-95"
        >
          [ RETURN TO HUB ]
        </button>
      </motion.div>
    </div>
  );
};
/* ID-END: GUI_TSX_003 */
