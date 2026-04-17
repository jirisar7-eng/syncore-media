/* ID-START: GUI_COMP_001 */
import React from 'react';
import { Download, Youtube, Facebook, Music } from 'lucide-react';
import { MediaResult } from '../services/SearchEngine';

export const MediaCard: React.FC<{ item: MediaResult }> = ({ item }) => {
  const getIcon = () => {
    switch (item.platform) {
      case 'YouTube': return <Youtube size={14} />;
      case 'Facebook': return <Facebook size={14} />;
      default: return <Music size={14} />;
    }
  };

  return (
    <div className="w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden mb-4 flex flex-col sm:flex-row shadow-2xl transition-all hover:border-green-500/30">
      <div className="w-full sm:w-48 aspect-video sm:aspect-auto relative bg-black/50">
        <img 
          src={item.thumbUrl} 
          alt={item.title} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2 bg-green-500 text-black px-2 py-0.5 rounded text-[9px] font-black uppercase flex items-center gap-1">
          {getIcon()} {item.platform}
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded text-[10px] font-mono">
          {item.duration}
        </div>
      </div>
      
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-white text-sm font-bold leading-snug line-clamp-2 uppercase tracking-tight mb-2">
            {item.title}
          </h3>
          <p className="text-[10px] text-white/30 truncate mb-4">SviD: {item.sid}</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 hover:bg-green-400 text-black text-[11px] font-black uppercase tracking-widest rounded-md transition-all active:scale-95 shadow-lg shadow-green-500/10">
          <Download size={14} />
          STÁHNOUT (STREAM)
        </button>
      </div>
    </div>
  );
};
/* ID-END: GUI_COMP_001 */
