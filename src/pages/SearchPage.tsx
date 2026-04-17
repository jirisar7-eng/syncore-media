/* ID-START: GUI_TSX_003 */
import React from 'react';

export const SearchPage = () => (
  <div className="p-10 bg-[#0f0f0f] text-white min-h-screen">
    <h1 className="text-3xl font-black text-green-500 uppercase">Search Ready</h1>
    <button 
      onClick={() => window.location.href='/'}
      className="mt-4 px-4 py-2 border border-white/10 rounded hover:bg-white/5 uppercase text-xs font-bold"
    >
      Zpět
    </button>
  </div>
);
/* ID-END: GUI_TSX_003 */
