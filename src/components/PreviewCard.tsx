/* ID-START: SEA_PREV_001 */
import React from 'react';
import { Play } from 'lucide-react';
import { MediaResult } from '../services/SearchEngine';

export const PreviewCard: React.FC<{ item: MediaResult }> = ({ item }) => {
  return (
    <div className="w-full bg-white/5 rounded-2xl overflow-hidden border border-white/10 backdrop-blur-md mb-4 flex flex-col">
      <div className="relative aspect-video w-full bg-black/40">
        <img 
          src={item.thumbUrl} 
          alt={item.title} 
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] font-mono">
          {item.duration}
        </div>
        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-green-500 rounded text-[9px] text-black font-bold uppercase">
          {item.platform}
        </div>
      </div>
      
      <div className="p-4 flex-1">
        <h3 className="text-sm font-semibold text-white/90 leading-tight mb-4 uppercase tracking-tight">
          {item.title}
        </h3>
        
        <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2">
          <Play size={14} fill="currentColor" />
          Vybrat ke stažení
        </button>
      </div>
    </div>
  );
};
/* ID-END: SEA_PREV_001 */
