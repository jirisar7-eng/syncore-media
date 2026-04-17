/* ID-START: GUI_TSX_003 */
import React from 'react';

export const SearchPage = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4 flex items-center justify-center">
      <div className="text-center p-12 border border-white/10 rounded-3xl bg-white/5">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-green-500 mb-4">
          Search Live
        </h1>
        <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-8">
          Synthesis Core V2 / Stable Build
        </p>
        <button 
          onClick={() => window.location.hash = '/hub'}
          className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all"
        >
          [ Zpět na Hub ]
        </button>
      </div>
    </div>
  );
};
/* ID-END: GUI_TSX_003 */
