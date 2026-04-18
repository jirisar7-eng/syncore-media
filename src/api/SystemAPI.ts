/* ID-START: SYS_API_001 */
import { GitHubAPI } from './GitHubAPI';
import { VercelAPI } from './VercelAPI';

declare global {
  interface Window {
    force_mass_upload: () => Promise<void>;
  }
}

export class SystemAPI {
    private gitApi = new GitHubAPI();
    private vercelApi = new VercelAPI();

    constructor() {
        // Globalization for emergency rewire
        window.force_mass_upload = async () => {
            console.log("!!! FORCE UPLOAD STARTING !!!");
            window.alert("Nahrávání zahájeno!");
            const res = await this.force_mass_upload("jirisar7-eng", "syncore-media", (curr, tot) => {
                const prog = Math.floor((curr / tot) * 100);
                const bar = document.getElementById('upload-bar') as HTMLProgressElement;
                if (bar) bar.value = prog;
            });
            if (!res.success) {
                const log = document.getElementById('direct-error-log');
                if (log) log.innerText = `FATAL ERROR: ${res.error}`;
            }
        };
    }

    async force_mass_upload(
        owner: string, 
        repo: string, 
        onProgress: (current: number, total: number, fileName: string) => void
    ): Promise<{ success: boolean; error?: string }> {
        try {
            // 1. Scan filesystem
            const listRes = await fetch('/api/files/list');
            if (!listRes.ok) throw new Error("Nepodařilo se získat seznam souborů.");
            const { files } = await listRes.json();

            // 2. Update manifest in dne.json
            console.log("[SYSTEM] Updating manifest with found files:", files.length);
            const dneReadRes = await fetch('/api/files/read?path=dne.json');
            const { content: dneContent } = await dneReadRes.json();
            const dneData = JSON.parse(dneContent);
            
            dneData.system_state.manifest = files;
            dneData.system_state.last_tick = Date.now();
            dneData.system_state.status = "FORCE_DEPLOY_ACTIVE";

            // 3. Sync project
            // We use the existing GitHubAPI but with "TOTAL_PROJECT_OVERWRITE_V1" intent
            const syncRes = await this.gitApi.sync_full_project(
                owner, 
                repo, 
                files,
                onProgress
            );

            if (!syncRes.success) {
                console.error("[SYSTEM] Sync failed during force upload:", syncRes.errors);
                // 409 Secret Handling logic could be here if we parsed syncRes.errors
            }

            // 4. Trigger Vercel
            const vercelRes = await this.vercelApi.trigger_deployment();
            
            return { 
                success: syncRes.success && vercelRes.success,
                error: !syncRes.success ? "SYNC_FAILED" : (!vercelRes.success ? "VERCEL_FAILED" : undefined)
            };

        } catch (e: any) {
            console.error("[SYSTEM] Critical failure in force_mass_upload:", e);
            return { success: false, error: e.message };
        }
    }
}
/* ID-END: SYS_API_001 */
