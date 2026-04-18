/* ID-START: GUI_PAGE_SYSTEM_001 */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, ShieldCheck, Key, Database, Activity, RefreshCcw } from 'lucide-react';
import { getSession } from '../AuthStore';

export const SystemPage = () => {
    const [stats, setStats] = useState({ cpu: 12, ram: '240MB', uptime: '4d 12h', latency: '42ms' });
    const session = getSession();

    useEffect(() => {
        if (!session) window.location.hash = '/login';
    }, [session]);

    const handleKeyRotation = () => {
        window.alert("ROTACE KLÍČŮ: Toto vyžaduje přímý zásah do ENV proměnných na Vercelu.");
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white p-6 pb-24 max-w-lg mx-auto flex flex-col gap-6">
            <header className="mb-4">
                <h1 className="text-2xl font-black uppercase tracking-tighter">
                    System <span className="text-blue-500">Diagnostics</span>
                </h1>
                <p className="text-[9px] uppercase tracking-widest text-white/30">Diagnostika jádra a správa identit</p>
            </header>

            <section className="grid grid-cols-2 gap-4">
                {[
                    { label: 'Cloud Latency', val: stats.latency, icon: <Activity size={14} className="text-green-500" /> },
                    { label: 'Memory Usage', val: stats.ram, icon: <Database size={14} className="text-blue-500" /> },
                    { label: 'Uptime', val: stats.uptime, icon: <Activity size={14} className="text-purple-500" /> },
                    { label: 'CPU Load', val: `${stats.cpu}%`, icon: <Activity size={14} className="text-orange-500" /> },
                ].map((s, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2 opacity-40">
                            {s.icon}
                            <span className="text-[8px] font-black uppercase tracking-widest">{s.label}</span>
                        </div>
                        <div className="text-lg font-black font-mono">{s.val}</div>
                    </div>
                ))}
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Key size={16} className="text-blue-500" />
                    <h2 className="text-[10px] font-black uppercase tracking-widest">Security & Secrets</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
                        <span className="text-[10px] uppercase font-bold text-white/40">GitHub Token</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[9px] font-mono">ACTIVE</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
                        <span className="text-[10px] uppercase font-bold text-white/40">Vercel Secret</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[9px] font-mono">ACTIVE</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleKeyRotation}
                        className="w-full mt-4 py-3 bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCcw size={14} /> Rotovat Klíče
                    </button>
                </div>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4 text-white/40">
                    <ShieldCheck size={16} />
                    <h2 className="text-[10px] font-black uppercase tracking-widest">Admin Authorization</h2>
                </div>
                <div className="text-[10px] opacity-60 uppercase leading-relaxed">
                    Uživatel: <span className="text-white font-bold">{session?.username}</span><br />
                    Role: <span className="text-green-500 font-bold">{session?.role}</span><br />
                    Session ID: <span className="font-mono text-[8px]">{Date.now().toString(36).toUpperCase()}</span>
                </div>
            </section>
        </div>
    );
};
/* ID-END: GUI_PAGE_SYSTEM_001 */
