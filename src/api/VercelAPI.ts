/* ID-START: VER_API_001 */
export interface VercelDeployResponse {
    success: boolean;
    deploymentId?: string;
    url?: string;
    error?: string;
}

export class VercelAPI {
    private token: string | null = import.meta.env.VITE_VERCEL_TOKEN || null;
    private projectId: string | null = import.meta.env.VITE_VERCEL_PROJECT_ID || null;

    private async fetchViaProxy(url: string, method: string = "POST", body?: any) {
        return fetch("/api/vercel/proxy", {
            method: "POST",
            mode: 'cors',
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, method, body })
        });
    }

    async trigger_deployment(): Promise<VercelDeployResponse> {
        if (!this.token || !this.projectId) {
            console.error("[VERCEL] Missing configuration:", { token: !!this.token, projectId: !!this.projectId });
            return { success: false, error: "MISSING_CONFIG" };
        }

        console.log(`[VERCEL] Triggering deployment for project: ${this.projectId}`);

        try {
            // Triggering a deployment on Vercel via REST API
            // Note: In a real scenario, we might want to create a deployment from the GitHub repo
            const res = await this.fetchViaProxy(`https://api.vercel.com/v13/deployments`, "POST", {
                name: this.projectId,
                gitSource: {
                    type: "github",
                    repoId: "jirisar7-eng/syncore-media", // Assuming repo matches
                    ref: "main"
                }
            });

            const data = await res.json();
            console.log("[VERCEL] API Response:", data);

            if (res.ok) {
                return {
                    success: true,
                    deploymentId: data.id,
                    url: data.url
                };
            } else {
                return {
                    success: false,
                    error: data.error?.message || "DEPLOY_TRIGGER_FAILED"
                };
            }
        } catch (e: any) {
            console.error("[VERCEL] Internal Error:", e);
            return { success: false, error: e.message || "NETWORK_ERROR" };
        }
    }
}
/* ID-END: VER_API_001 */
// Force sync F-99-PROD
