/* ID-START: GUI_TSX_003 */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SearchInput } from '../components/SearchInput';
import { PreviewCard } from '../components/PreviewCard';
import { fetchMediaResults, MediaResult } from '../services/SearchEngine';
import { getSession } from '../AuthStore';

export const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const session = getSession();

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    const data = await fetchMediaResults(query);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4">
      <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
        <button 
          onClick={() => window.location.hash = session?.role === 'admin' ? '/hub' : '/'}
          className="text-[10px] uppercase opacity-40 hover:opacity-100"
        >
          ← Zpět
        </button>
        <div className="text-[9px] uppercase tracking-widest text-green-500 font-mono">G-Sync: Active</div>
      </header>

      <div className="max-w-xl mx-auto">
        <SearchInput value={query} onChange={setQuery} onSearch={handleSearch} />

        {loading && <div className="text-center py-10 animate-pulse text-xs uppercase opacity-30">Skenování streamu...</div>}

        <div className="grid grid-cols-1 gap-4 mt-8">
          {results.map((item) => (
            <motion.div 
              key={item.sid}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <PreviewCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
/* ID-END: GUI_TSX_003 */
