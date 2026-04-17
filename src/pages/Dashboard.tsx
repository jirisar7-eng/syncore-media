/* ID-START: GUI_DASH_001 */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Activity, LogOut, ChevronLeft } from 'lucide-react';
import { GsyncButton } from '../components/GsyncButton';
import { SearchInput } from '../components/SearchInput';
import { MediaCard } from '../components/MediaCard';
import { fetchMediaResults, MediaResult } from '../services/SearchEngine';
import { getSession, UserContext } from '../AuthStore';

export const Dashboard = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<MediaResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState<UserContext | null>(null);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);

    useEffect(() => {
        setSession(getSession());
        fetch('/dne.json').then(r => r.json()).then(d => setAuditLogs(d.audit_log.slice(-3).reverse()));
    }, []);

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        setResults(await fetchMediaResults(query));
        setLoading(false);
    };

    if (!session) return null;

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white p-4 max-w-2xl mx-auto flex flex-col gap-6">
            <header className="flex justify-between items-center py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <button onClick={() => window.location.hash = '/hub'} className="p-2 bg-white/5 rounded-lg mr-2 hover:bg-white/10 transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-green-500/20">
                        <User size={20} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest">{session.username}</h4>
                        <p className="text-[9px] text-green-500 opacity-70 uppercase tracking-tighter">Status: {session.role}</p>
                    </div>
                </div>
                <button onClick={() => { localStorage.clear(); window.location.hash = '/login'; }} className="p-2 hover:text-red-500 transition-colors opacity-40 hover:opacity-100">
                    <LogOut size={18} />
                </button>
            </header>

            <section><SearchInput value={query} onChange={setQuery} onSearch={handleSearch} /></section>

            <main className="flex-1">
                {loading ? <div className="text-center py-20 animate-pulse text-[10px] uppercase opacity-40">Synchronizace streamu...</div> : 
                 <div className="space-y-4">{results.map(item => <MediaCard key={item.sid} item={item} />)}</div>}
            </main>

            <footer className="space-y-4 pt-6 border-t border-white/5 pb-8">
                <div className="bg-black/40 rounded-lg p-4 border border-white/5 font-mono text-[9px]">
                    <div className="flex items-center gap-2 mb-3 text-white/40 uppercase tracking-widest px-1">
                        <Activity size={12} /> System Audit (S-Live)
                    </div>
                    {auditLogs.map((log, i) => (
                        <div key={i} className="flex gap-3 mb-2 opacity-50 hover:opacity-100 transition-opacity">
                            <span className="text-green-500">[{log.sid}]</span>
                            <span className="truncate">{log.desc}</span>
                        </div>
                    ))}
                </div>
                <GsyncButton state={{ system_state: { last_tick: Date.now(), status: 'DASHBOARD_LIVE', manifest: [] }}} />
            </footer>
        </div>
    );
};
/* ID-END: GUI_DASH_001 */
