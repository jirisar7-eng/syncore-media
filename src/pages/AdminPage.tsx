/* ID-START: GUI_ADMIN_001 */
import { useState, useEffect } from 'react';
import { Github, ChevronLeft, Rocket, Loader2, CheckCircle2, RefreshCcw } from 'lucide-react';
import { GitHubAPI } from '../api/GitHubAPI';
import { getSession } from '../AuthStore';
import { RepoPreview } from '../components/RepoPreview';

export const AdminPage = () => {
    const [pushing, setPushing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [refreshTime, setRefreshTime] = useState(Date.now());
    const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0, file: '' });
    const session = getSession();
    const gitApi = new GitHubAPI();

    useEffect(() => {
        if (!session || session.role !== 'admin') {
            window.location.hash = '/hub';
        }
    }, [session]);

    const handlePush = async () => {
        setPushing(true);
        setResult(null);
        
        try {
            // 1. Fetch manifest
            const dneRes = await fetch('/api/files/read?path=dne.json');
            const { content } = await dneRes.json();
            const dne = JSON.parse(content);
            const manifest = dne.system_state.manifest || [];

            // 2. Run Sync
            const res = await gitApi.sync_full_project(
                "jirisar7-eng",
                "syncore-media",
                manifest,
                (current, total, file) => {
                    setSyncProgress({ current, total, file });
                }
            );

            if (res.success) {
                setRefreshTime(Date.now());
            }
            setResult(res);
        } catch (e: any) {
            setResult({ success: false, error: e.message });
        } finally {
            setPushing(false);
            setSyncProgress({ current: 0, total: 0, file: '' });
        }
    };

    if (!session) return null;

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white p-6 max-w-lg mx-auto flex flex-col gap-8">
            <header className="flex items-center gap-4 border-b border-white/5 pb-6">
                <button onClick={() => window.location.hash = '/hub'} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <ChevronLeft size={18} />
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter">Admin Panel <span className="text-green-500">Git</span></h1>
            </header>

            <main className="flex-1 flex flex-col gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-white/5 rounded-xl text-green-500">
                            <Github size={32} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white">GitHub Integration</h3>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest">jirisar7-eng / syncore-media</p>
                        </div>
                    </div>

                    <button 
                        onClick={handlePush}
                        disabled={pushing}
                        className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-black p-5 rounded-xl text-xs uppercase tracking-widest flex flex-col items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-green-500/20 group"
                    >
                        <div className="flex items-center gap-3">
                            {pushing ? <Loader2 className="animate-spin" size={18} /> : <Rocket size={18} className="group-hover:animate-bounce" />}
                            🚀 FULL SYSTEM SYNC
                        </div>
                        
                        {pushing && syncProgress.total > 0 && (
                            <div className="w-full space-y-1.5 mt-1">
                                <div className="flex justify-between text-[7px] text-black/40 font-bold">
                                    <span className="truncate max-w-[150px]">{syncProgress.file}</span>
                                    <span>{syncProgress.current} / {syncProgress.total}</span>
                                </div>
                                <div className="h-0.5 bg-black/10 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-black transition-all duration-300"
                                        style={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </button>

                    {result && (
                        <div className={`mt-6 p-4 rounded-lg font-mono border ${result.success ? 'bg-green-500/10 border-green-500/20 text-green-500 text-[10px]' : 'bg-red-500/20 border-red-500/50 text-red-500 text-[10px] break-all'}`}>
                            {result.success ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 font-black uppercase tracking-widest"><CheckCircle2 size={12}/> 🔥 SYSTEM SYNCED</div>
                                    <p className="font-bold underline">Projekt kompletně zálohován.</p>
                                    <p className="opacity-70 mt-2">Aktualizováno: {result.synced} | Přeskočeno: {result.skipped}</p>
                                    <a href={`https://github.com/jirisar7-eng/syncore-media`} target="_blank" rel="noreferrer" className="underline block mt-1 text-green-400 font-bold uppercase tracking-widest">[ Open Repository ]</a>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <div className="uppercase tracking-widest font-black">SYNC ERRORS DETECTED</div>
                                    <div className="text-[8px] opacity-80 mt-2 flex flex-col gap-1">
                                        {result.errors?.map((err: string, i: number) => <div key={i}>{err}</div>) || result.error}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Remote Explorer</h3>
                        <button 
                            onClick={() => setRefreshTime(Date.now())}
                            className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-green-500 hover:text-green-400 transition-colors"
                        >
                            <RefreshCcw size={12} />
                            REFRESH REPO
                        </button>
                    </div>
                    
                    <RepoPreview owner="jirisar7-eng" repo="syncore-media" refreshTrigger={refreshTime} />
                </div>
            </main>

            <footer className="text-center opacity-20 text-[9px] uppercase tracking-[0.4em] pb-10">
                Synthesis Git Sync Engine
            </footer>
        </div>
    );
};
/* ID-END: GUI_ADMIN_001 */
