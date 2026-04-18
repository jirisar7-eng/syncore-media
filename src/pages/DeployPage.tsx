/* ID-START: GUI_PAGE_DEPLOY_001 */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Rocket, Loader2, CheckCircle2, ShieldAlert, Github, Server } from 'lucide-react';
import { GitHubAPI } from '../api/GitHubAPI';
import { VercelAPI } from '../api/VercelAPI';
import { SystemAPI } from '../api/SystemAPI';
import { getSession } from '../AuthStore';
import { RepoPreview } from '../components/RepoPreview';

export const DeployPage = () => {
  const [pushing, setPushing] = useState(false);
  const [gitStatus, setGitStatus] = useState<string | null>(null);
  const [vercelStatus, setVercelStatus] = useState<string | null>(null);
  const [gitError, setGitError] = useState<string | null>(null);
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0, file: '' });

  const session = getSession();
  const gitApi = new GitHubAPI();
  const vercelApi = new VercelAPI();
  const systemApi = new SystemAPI();

  useEffect(() => {
    if (!session) window.location.hash = '/login';
  }, [session]);

  const handleFullSync = async () => {
    setPushing(true);
    setGitStatus('Inicializace... (Bypass Active)');
    setGitError(null);
    try {
      const dneRes = await fetch('/api/files/read?path=dne.json');
      const { content } = await dneRes.json();
      const dne = JSON.parse(content);
      const manifest = dne.system_state.manifest || [];

      const res = await gitApi.sync_full_project(
        "jirisar7-eng",
        "syncore-media",
        manifest,
        (current, total, file) => {
          setSyncProgress({ current, total, file });
          setGitStatus(`Syncing [${current}/${total}]`);
        }
      );

      if (res.success) {
        setGitStatus('✅ GITHUB UPDATED');
        setVercelStatus('🚀 TRIGGERING BUILD...');
        const vRes = await vercelApi.trigger_deployment();
        setVercelStatus(vRes.success ? '✅ VERCEL DEPLOY TRIGGERED' : `⚠️ VERCEL FAIL: ${vRes.error}`);
      } else {
        setGitError('CHYBA PŘENOSU');
      }
    } catch (e: any) {
      setGitError(e.message);
    } finally {
      setPushing(false);
      setTimeout(() => { setGitStatus(null); setVercelStatus(null); }, 8000);
    }
  };

  const handleForceTotalDeploy = async () => {
    if (!window.confirm("NUCLEAR STRIKE: Přepsat celou dálkovou instanci?")) return;
    setPushing(true);
    setGitStatus('🔥 TOTAL OVERWRITE ACTIVE');
    try {
        const res = await systemApi.force_mass_upload(
            "jirisar7-eng",
            "syncore-media",
            (current, total, file) => {
                setSyncProgress({ current, total, file });
                setGitStatus(`FORCE [${current}/${total}]`);
            }
        );
        if (res.success) setGitStatus('✨ TOTAL SYSTEM SYNCED');
        else setGitError(res.error || 'FORCE_FAIL');
    } catch (e: any) {
        setGitError(e.message);
    } finally {
        setPushing(false);
        setTimeout(() => setGitStatus(null), 8000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 pb-24 max-w-lg mx-auto flex flex-col gap-6">
      <header className="mb-4">
        <h1 className="text-2xl font-black uppercase tracking-tighter">
          Deployment <span className="text-green-500">Center</span>
        </h1>
        <p className="text-[9px] uppercase tracking-widest text-white/30">Správa dálkových serverů a GIT synchronizace</p>
      </header>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
            <Github size={16} className="text-white/40" />
            <h2 className="text-[10px] font-black uppercase tracking-widest">Git Operations</h2>
        </div>

        <button 
          onClick={handleFullSync}
          disabled={pushing}
          className="w-full bg-white/10 hover:bg-white/20 p-5 rounded-xl flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
            {pushing && !gitStatus?.includes('FORCE') ? <Loader2 size={16} className="animate-spin text-green-500" /> : <Rocket size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1" />}
            <span className="text-[11px] font-black uppercase tracking-widest">Full System Sync</span>
          </div>
          <div className="text-[9px] font-bold text-green-500 opacity-50">Standard</div>
        </button>

        <button 
          onClick={handleForceTotalDeploy}
          disabled={pushing}
          className="w-full bg-red-600/10 border border-red-600/20 hover:bg-red-600/20 p-5 rounded-xl flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
            {pushing && gitStatus?.includes('FORCE') ? <Loader2 size={16} className="animate-spin text-red-500" /> : <ShieldAlert size={16} className="text-red-500 group-hover:animate-pulse" />}
            <span className="text-[11px] font-black uppercase tracking-widest text-red-500">Force Total Deploy</span>
          </div>
          <div className="text-[9px] font-bold text-red-500 opacity-50 uppercase tracking-widest animate-pulse">Nuclear</div>
        </button>

        {(gitStatus || vercelStatus || gitError) && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border mt-2 ${gitError ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}
            >
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest">{gitError ? 'Chyba' : 'Status'}</span>
                    {pushing && <Loader2 size={12} className="animate-spin opacity-50" />}
                </div>
                <p className="text-[10px] font-mono break-all opacity-80 uppercase leading-relaxed">
                    {gitError || gitStatus}
                    <br />
                    {vercelStatus}
                </p>
                {pushing && syncProgress.total > 0 && (
                    <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            className={`h-full ${gitStatus?.includes('FORCE') ? 'bg-red-500' : 'bg-green-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
                        />
                    </div>
                )}
            </motion.div>
        )}
      </section>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
            <Server size={16} className="text-white/40" />
            <h2 className="text-[10px] font-black uppercase tracking-widest">Active Repository Preview</h2>
        </div>
        <RepoPreview owner="jirisar7-eng" repo="syncore-media" />
      </section>

      <footer className="text-center opacity-10 text-[8px] uppercase tracking-[0.6em] mt-auto">
        Synergy Cloud Engine X
      </footer>
    </div>
  );
};
/* ID-END: GUI_PAGE_DEPLOY_001 */
