/* ID-START: GUI_COMP_005 */
import { useState, useEffect } from 'react';
import { Play, Calendar, Link as LinkIcon, Database, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { GitHubAPI } from '../api/GitHubAPI';

interface MediaEntry {
    id: string;
    url: string;
    title: string;
    timestamp: string;
    status: string;
    quality: string;
}

interface MediaGalleryProps {
    refreshTrigger: number;
    onCountUpdate?: (count: number) => void;
}

export const MediaGallery = ({ refreshTrigger, onCountUpdate }: MediaGalleryProps) => {
    const [archive, setArchive] = useState<MediaEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const gitApi = new GitHubAPI();

    useEffect(() => {
        const fetchArchive = async () => {
            setLoading(true);
            const content = await gitApi.get_file_content("jirisar7-eng", "syncore-media", "repo/downloads/archive.json");
            if (content) {
                try {
                    const data = JSON.parse(content);
                    const sorted = Array.isArray(data) ? data.reverse() : [];
                    setArchive(sorted);
                    if (onCountUpdate) onCountUpdate(sorted.length);
                } catch (e) {
                    console.error("[GALLERY] Parse error:", e);
                }
            } else {
                setArchive([]);
                if (onCountUpdate) onCountUpdate(0);
            }
            setLoading(false);
        };
        fetchArchive();
    }, [refreshTrigger]);

    if (loading) {
        return (
            <div className="w-full py-20 flex flex-col items-center justify-center gap-4 text-green-500/40">
                <Loader2 className="animate-spin" size={32} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Načítám archív...</span>
            </div>
        );
    }

    if (archive.length === 0) {
        return (
            <div className="w-full py-12 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-white/20">
                <Database size={24} />
                <span className="text-[10px] uppercase tracking-widest font-bold italic">Historie extrakcí je prázdná</span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {archive.map((entry, idx) => (
                <motion.div 
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-[#151515] border border-white/5 p-4 rounded-xl hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.05)] transition-all flex items-center gap-4"
                >
                    <div className="p-3 bg-white/5 rounded-lg text-green-500 group-hover:bg-green-500 group-hover:text-black transition-all">
                        <Play size={18} fill="currentColor" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-white uppercase tracking-tight truncate group-hover:text-green-500 transition-colors">
                            {entry.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5 opacity-40">
                            <div className="flex items-center gap-1 text-[9px] uppercase font-bold tracking-tighter">
                                <Calendar size={10} /> {entry.timestamp}
                            </div>
                            <div className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded font-mono">
                                {entry.quality}
                            </div>
                        </div>
                    </div>

                    <a 
                        href={entry.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
                    >
                        <LinkIcon size={16} />
                    </a>
                </motion.div>
            ))}
        </div>
    );
};
/* ID-END: GUI_COMP_005 */
