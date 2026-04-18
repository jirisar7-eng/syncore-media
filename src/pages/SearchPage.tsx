/* ID-START: GUI_TSX_003 */
import React, { useState } from 'react';
import { Search, Loader2, Rocket, Link2, Download } from 'lucide-react';
import { MediaGallery } from '../components/MediaGallery';
import { GitHubAPI } from '../api/GitHubAPI';

export const SearchPage = () => {
  const [extractUrl, setExtractUrl] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [extractStatus, setExtractStatus] = useState<string | null>(null);
  const [refreshGallery, setRefreshGallery] = useState(0);
  
  const gitApi = new GitHubAPI();

  const handleExtraction = async () => {
    if (!extractUrl) return;
    setExtracting(true);
    setExtractStatus('Iniciuji extrakci...');
    
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: extractUrl })
      });
      
      const data = await response.json();
      if (data.success) {
        setExtractStatus('Zapisuji do archivu...');
        const gitRes = await gitApi.push_to_github(
          "jirisar7-eng",
          "syncore-media",
          'repo/downloads/archive.json',
          JSON.stringify(data.fullArchive, null, 2),
          `Auto-Archive: ${data.metadata.id}`
        );
        
        if (gitRes.success) {
          setExtractStatus('✅ HOTOVO');
          setExtractUrl('');
          setRefreshGallery(Date.now());
        }
      }
    } catch (e) {
      setExtractStatus('❌ CHYBA EXTRAKCE');
    } finally {
      setExtracting(false);
      setTimeout(() => setExtractStatus(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 md:p-10 pb-32 max-w-lg mx-auto flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-black uppercase tracking-tighter">
          Media <span className="text-green-500">Search</span>
        </h1>
        <p className="text-[9px] uppercase tracking-widest text-white/30">Synthesis Streaming Engine X</p>
      </header>

      <section className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4 opacity-50">
            <Download size={16} />
            <h2 className="text-[10px] font-black uppercase tracking-widest">Synthesis Extractor</h2>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
              <input 
                type="text" 
                value={extractUrl}
                onChange={(e) => setExtractUrl(e.target.value)}
                placeholder="Vložte URL média..."
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-mono focus:border-green-500 focus:outline-none transition-all"
              />
            </div>
            <button 
              onClick={handleExtraction}
              disabled={extracting || !extractUrl}
              className="bg-green-500 hover:bg-green-400 disabled:opacity-20 text-black px-4 rounded-xl transition-all"
            >
              {extracting ? <Loader2 className="animate-spin" size={18} /> : <Rocket size={18} />}
            </button>
          </div>

          {extractStatus && (
            <div className="mt-4 text-[9px] font-black uppercase tracking-widest text-green-500 animate-pulse">
                {extractStatus}
            </div>
          )}
      </section>

      <section className="flex flex-col gap-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 px-2">Recent Results</h3>
          <MediaGallery refreshTrigger={refreshGallery} />
      </section>
    </div>
  );
};
/* ID-END: GUI_TSX_003 */
