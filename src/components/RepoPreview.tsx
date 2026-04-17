/* ID-START: GUI_COMP_003 */
import React, { useEffect, useState } from 'react';
import { Folder, FileText, Clock, User, Loader2 } from 'lucide-react';
import { GitHubAPI } from '../api/GitHubAPI';

interface RepoPreviewProps {
    owner: string;
    repo: string;
    refreshTrigger?: number;
}

export const RepoPreview: React.FC<RepoPreviewProps> = ({ owner, repo, refreshTrigger }) => {
    const [contents, setContents] = useState<any[]>([]);
    const [lastCommit, setLastCommit] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const gitApi = new GitHubAPI();

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        console.log(`[REPO-PREVIEW] Syncing with ${owner}/${repo}...`);
        try {
            const [files, commit] = await Promise.all([
                gitApi.get_repo_contents(owner, repo),
                gitApi.get_last_commit(owner, repo)
            ]);
            
            setContents(files || []);
            setLastCommit(commit);
            
            // If no files and no error, it might be 404 (empty)
            if (!files || files.length === 0) {
                console.log("[REPO-PREVIEW] Repository is empty or not yet initialized.");
            }
        } catch (e) {
            console.error("[REPO-PREVIEW] Critical fetch error:", e);
            setError("CHYBA KOMUNIKACE S GITHUBEM");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [owner, repo, refreshTrigger]);

    if (loading) {
        return (
            <div className="w-full py-12 flex flex-col items-center justify-center gap-4 bg-white/5 rounded-2xl border border-white/10 italic text-[10px] uppercase tracking-[0.3em] opacity-30">
                <Loader2 className="animate-spin text-green-500" size={32} />
                Synchronizuji repozitář...
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Internal Error: 404</div>
                <div className="text-xs font-bold text-white uppercase tracking-tighter">{error}</div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6">
            {lastCommit && (
                <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-xl flex items-center justify-between backdrop-blur-md">
                    <div>
                        <div className="text-[10px] uppercase tracking-widest text-green-500 font-black mb-1">Live Manifest</div>
                        <div className="text-xs font-bold text-white truncate max-w-[180px]">{lastCommit.message}</div>
                    </div>
                    <div className="text-right flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[10px] text-white/60 uppercase tracking-tighter justify-end font-medium">
                            <User size={12} className="text-green-500" /> {lastCommit.author}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-tighter justify-end font-mono">
                            <Clock size={12} /> {lastCommit.date}
                        </div>
                    </div>
                </div>
            )}

            {contents.length === 0 ? (
                <div className="w-full py-12 flex flex-col items-center justify-center gap-4 bg-white/5 rounded-2xl border border-white/10 italic text-[10px] uppercase tracking-[0.3em] opacity-40 text-center px-4">
                    Repozitář je zatím prázdný.<br />
                    Zkuste provést první PUSH pro inicializaci.
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide py-2 px-1">
                    {contents.map((item, i) => (
                        <div 
                            key={i} 
                            className="group relative bg-[#1a1a1a] border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:-translate-y-1 cursor-default text-center"
                        >
                            <div className={`p-3 rounded-full bg-white/5 group-hover:bg-green-500/10 transition-colors ${item.type === 'dir' ? 'text-green-500' : 'text-white/40 group-hover:text-green-400'}`}>
                                {item.type === 'dir' ? <Folder size={24} /> : <FileText size={24} />}
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-green-500 transition-colors truncate max-w-[120px]">
                                    {item.name}
                                </div>
                                <div className="text-[8px] text-white/20 font-mono tracking-tighter uppercase">
                                    {item.type === 'dir' ? 'Directory' : 'Structure'}
                                </div>
                            </div>
                            
                            {/* Hover Overlay Detail */}
                            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 group-hover:ring-green-500/30 transition-all pointer-events-none" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
/* ID-END: GUI_COMP_003 */
