/* ID-START: GUI_HUB_001 */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Settings, BarChart3, ShieldCheck, LogOut, Rocket, Loader2, CheckCircle2, Download, Link2 } from 'lucide-react';
import { HubCard } from '../components/ui/HubCard';
import { getSession, UserContext } from '../AuthStore';
import { GsyncButton } from '../components/GsyncButton';
import { GitHubAPI } from '../api/GitHubAPI';
import { VercelAPI } from '../api/VercelAPI';
import { SystemAPI } from '../api/SystemAPI';
import { RepoPreview } from '../components/RepoPreview';
import { MediaGallery } from '../components/MediaGallery';

export const HubPage = () => {
  const [session, setSession] = useState<UserContext | null>(null);
  const [pushing, setPushing] = useState(false);
  const [gitStatus, setGitStatus] = useState<string | null>(null);
  const [gitError, setGitError] = useState<string | null>(null);
  const [extractUrl, setExtractUrl] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [extractStatus, setExtractStatus] = useState<string | null>(null);
  const [refreshGallery, setRefreshGallery] = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0, file: '' });
  const [vercelStatus, setVercelStatus] = useState<string | null>(null);
  const gitApi = new GitHubAPI();
  const vercelApi = new VercelAPI();
  const systemApi = new SystemAPI();

  useEffect(() => {
    const s = getSession();
    if (!s) window.location.hash = '/login';
    setSession(s);
  }, []);

  const handleFullSync = async () => {
    setPushing(true);
    setGitStatus('Inicializace Full Sync...');
    setGitError(null);
    try {
      // 1. Fetch manifest from dne.json
      const dneRes = await fetch('/api/files/read?path=dne.json');
      const { content } = await dneRes.json();
      const dne = JSON.parse(content);
      const manifest = dne.system_state.manifest || [];

      // 2. Run sync
      const res = await gitApi.sync_full_project(
        "jirisar7-eng",
        "syncore-media",
        manifest,
        (current, total, file) => {
          setSyncProgress({ current, total, file });
          setGitStatus(`Sync [${current}/${total}]`);
        }
      );

      if (res.success) {
        setGitStatus('✅ PROJEKT ZÁLOHOVÁN');
        
        // OKAMŽITĚ POTÉ trigger Vercel
        setVercelStatus('🚀 SPOUŠTÍM VERCEL BUILD...');
        const vRes = await vercelApi.trigger_deployment();
        
        if (vRes.success) {
            setVercelStatus('✅ VERCEL BUILD TRIGGERED: Success');
        } else {
            setVercelStatus(`⚠️ VERCEL ERROR: ${vRes.error}`);
        }

        setTimeout(() => {
            setGitStatus(null);
            setVercelStatus(null);
            setSyncProgress({ current: 0, total: 0, file: '' });
        }, 8000);
      } else {
        setGitError(`${res.synced} OK, ${res.errors.length} ERROR`);
        setGitStatus(null);
      }
    } catch (e: any) {
      setGitError(e.message || 'CRITICAL_SYNC_FAIL');
      setGitStatus(null);
    } finally {
      setPushing(false);
    }
  };

  const handleForceTotalDeploy = async () => {
    if (!window.confirm("VAROVÁNÍ: Spouštíte TOTAL FORCE DEPLOY. Projekt bude kompletně přepsán na dálku. Pokračovat?")) return;
    
    setPushing(true);
    setGitStatus('🚀 NUCLEAR STRIKE ACTIVE...');
    setGitError(null);

    try {
        const res = await systemApi.force_mass_upload(
            "jirisar7-eng",
            "syncore-media",
            (current, total, file) => {
                setSyncProgress({ current, total, file });
                setGitStatus(`FORCE SYNC [${current}/${total}]`);
            }
        );

        if (res.success) {
            setGitStatus('🔥 TOTAL PROJECT OVERWRITTEN');
            setVercelStatus('✅ VERCEL DEPLOYMENT TRIGGERED');
        } else {
            setGitError(res.error || 'FORCE_DEPLOY_FAILED');
            setGitStatus(null);
        }
    } catch (e: any) {
        setGitError(e.message || 'CRITICAL_SYSTEM_FAIL');
        setGitStatus(null);
    } finally {
        setPushing(false);
        setTimeout(() => {
            setGitStatus(null);
            setVercelStatus(null);
        }, 8000);
    }
  };

  const handleExtraction = async () => {
    if (!extractUrl) return;
    setExtracting(true);
    setExtractStatus('Inicializace extraktoru...');
    setExtractProgress(10);
    
    // Progress simulation
    const timer = setInterval(() => {
      setExtractProgress(prev => (prev < 90 ? prev + 5 : prev));
    }, 1000);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: extractUrl })
      });
      
      const data = await response.json();
      clearInterval(timer);
      setExtractProgress(100);

      if (data.success) {
        setExtractStatus('STAHUJI DATA NA GITHUB...');
        
        // Push full updated archive to GitHub
        const archivePath = 'repo/downloads/archive.json';
        const archiveContent = JSON.stringify(data.fullArchive, null, 2);
        
        const gitRes = await gitApi.push_to_github(
          "jirisar7-eng",
          "syncore-media",
          archivePath,
          archiveContent,
          `Archive Update: Added event ${data.metadata.id}`
        );
        
        if (gitRes.success) {
          setExtractStatus('✅ ARCHIVOVÁNO NA GITHUB');
          setExtractUrl('');
          setRefreshGallery(Date.now());
        } else {
          setExtractStatus('⚠️ CHYBA SYNCHRONIZACE ARCHIVU');
        }
      } else {
        setExtractStatus(`❌ CHYBA: ${data.error}`);
      }
    } catch (e) {
      clearInterval(timer);
      setExtractStatus('❌ KRITICKÁ CHYBA SPOJENÍ');
    } finally {
      setExtracting(false);
      setTimeout(() => {
        setExtractStatus(null);
        setExtractProgress(0);
      }, 5000);
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 md:p-10 max-w-lg mx-auto flex flex-col gap-8">
      <header className="flex justify-between items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2">
            SynCore <span className="text-green-500">Command</span>
          </h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
            <ShieldCheck size={12} className="text-green-500" /> Uživatel: {session.username} | G-Sync: Online
          </p>
        </motion.div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleForceTotalDeploy}
            disabled={pushing}
            className="px-4 py-3 bg-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all border border-red-500 shadow-lg shadow-red-500/20 active:scale-95 disabled:opacity-50"
          >
            🚀 FORCE TOTAL DEPLOY
          </button>
          
          <button 
            onClick={() => { localStorage.clear(); window.location.hash = '/login'; }}
            className="p-3 bg-white/5 rounded-full hover:text-red-500 transition-colors border border-white/5 shadow-lg shadow-black/50"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {gitError && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-red-500/10 border-2 border-red-500 p-6 rounded-2xl text-center shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-pulse mb-4"
        >
          <h2 className="text-2xl font-black text-red-500 uppercase tracking-tighter mb-2">KRITICKÁ CHYBA PUSH</h2>
          <p className="text-xs font-mono text-white/80 uppercase tracking-widest">{gitError}</p>
          <p className="text-[9px] text-red-500/50 uppercase mt-4 font-bold">Prověř existenci repozitáře jirisar7-eng/syncore-media</p>
          <button 
            onClick={() => setGitError(null)}
            className="mt-6 px-6 py-2 bg-red-500 text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-400"
          >
            ROZUMÍM
          </button>
        </motion.div>
      )}

      <section className="flex flex-col gap-4">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <Download className="text-green-500" size={20} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Synthesis Extractor</h2>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
              <input 
                type="text" 
                value={extractUrl}
                onChange={(e) => setExtractUrl(e.target.value)}
                placeholder="Vložte URL média (YT, FB, IG)..."
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-mono focus:border-green-500 focus:outline-none transition-all placeholder:opacity-20"
              />
            </div>
            <button 
              onClick={handleExtraction}
              disabled={extracting || !extractUrl}
              className="bg-green-500 hover:bg-green-400 disabled:opacity-20 text-black px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-green-500/20"
            >
              {extracting ? <Loader2 className="animate-spin" size={18} /> : <Rocket size={18} />}
            </button>
          </div>

          {extractStatus && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-green-500">
                <span>{extractStatus}</span>
                <span>{extractProgress}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${extractProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Media Archive</h3>
            <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest">
              Celkem staženo: {totalDownloads}
            </div>
          </div>
          <MediaGallery refreshTrigger={refreshGallery} onCountUpdate={setTotalDownloads} />
        </section>

        <HubCard 
          icon={<Search size={24} />}
          title="VYHLEDÁVAČ"
          description="Přístup k Synthesis Streaming Engine. YT, FB, TikTok."
          status="Active"
          onClick={() => window.location.hash = '/search'}
        />

        <HubCard 
          icon={<Settings size={24} />}
          title="ADMIN PANEL"
          description="Správa GIT API, audit logy a synchronizace jádra."
          status="Ready"
          onClick={() => window.location.hash = '/admin'}
        />

        <HubCard 
          icon={<BarChart3 size={24} />}
          title="STATISTIKY"
          description="Přehledy stahování a datových toků projektu."
          status="Syncing"
          onClick={() => {}}
        />

        <button 
          onClick={handleFullSync}
          disabled={pushing}
          className="w-full bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col items-center justify-center gap-3 transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50 group"
        >
          <div className="flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em]">
            {pushing ? <Loader2 size={16} className="animate-spin text-green-500" /> : <Rocket size={16} className="text-green-500 group-hover:animate-bounce" />}
            {gitStatus || '🚀 FULL SYSTEM SYNC'}
          </div>
          
          {pushing && syncProgress.total > 0 && (
            <div className="w-full space-y-2 mt-2">
                <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase">
                    <span className="truncate max-w-[150px]">{syncProgress.file}</span>
                    <span>{syncProgress.current} / {syncProgress.total}</span>
                </div>
                <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
                    />
                </div>
            </div>
          )}

          {vercelStatus && (
            <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[9px] font-black uppercase text-green-500 italic mt-1"
            >
                {vercelStatus}
            </motion.div>
          )}
        </button>
      </section>

      <section className="flex flex-col gap-4 mt-4">
        <div className="flex items-center gap-3 px-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
            AKTIVNÍ REPOZITÁŘ: <span className="text-white">jirisar7-eng/syncore-media</span>
          </h2>
        </div>
        <RepoPreview owner="jirisar7-eng" repo="syncore-media" />
      </section>

      <footer className="mt-auto pt-10">
        <a 
          href="https://github.com/jirisar7-eng/syncore-media" 
          target="_blank" 
          rel="noreferrer"
          className="block w-full text-center py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] text-green-500 font-black uppercase tracking-[0.3em] mb-6 hover:bg-green-500 hover:text-black transition-all shadow-lg shadow-green-500/10"
        >
          [ OTEVŘÍT GITHUB PROJEKT ]
        </a>
        <GsyncButton state={{ system_state: { last_tick: Date.now(), status: 'HUB_ACTIVE', manifest: [] }}} />
        <p className="text-center text-[9px] uppercase tracking-[0.5em] opacity-20 mt-6">
          Synthesis Command Center V2
        </p>
      </footer>
    </div>
  );
};
/* ID-END: GUI_HUB_001 */
