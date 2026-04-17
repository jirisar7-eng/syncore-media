/* ID-START: GIT_API_001 */
export interface GitHubPushResponse {
    success: boolean;
    sha?: string;
    url?: string;
    error?: string;
}

export class GitHubAPI {
    private token: string | null = import.meta.env.VITE_GITHUB_TOKEN || null;

    private b64EncodeUnicode(str: string) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(_match, p1) {
                return String.fromCharCode(Number('0x' + p1));
            }));
    }

    private computeHash(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash.toString();
    }

    async sync_full_project(
        owner: string, 
        repo: string, 
        fileList: string[], 
        onProgress: (current: number, total: number, fileName: string) => void
    ): Promise<{ success: boolean; synced: number; skipped: number; errors: string[] }> {
        let synced = 0;
        let skipped = 0;
        const errors: string[] = [];

        for (let i = 0; i < fileList.length; i++) {
            const filePath = fileList[i];
            onProgress(i + 1, fileList.length, filePath);

            try {
                // 1. Get local content via our server API
                const localRes = await fetch(`/api/files/read?path=${encodeURIComponent(filePath)}`);
                if (!localRes.ok) throw new Error(`Nepodařilo se přečíst lokální soubor: ${filePath}`);
                const { content } = await localRes.json();

                // 2. Check hash to avoid redundant pushes
                const currentHash = this.computeHash(content);
                const lastHash = localStorage.getItem(`gsync_hash_${filePath}`);

                if (currentHash === lastHash) {
                    console.log(`[GITHUB-SYNC] Soubor ${filePath} beze změny, přeskakuji.`);
                    skipped++;
                    continue;
                }

                // 3. Push to GitHub
                const pushRes = await this.push_to_github(
                    owner, 
                    repo, 
                    filePath.startsWith("/") ? filePath.slice(1) : filePath, 
                    content, 
                    `Full System Sync: Updated ${filePath}`
                );

                if (pushRes.success) {
                    localStorage.setItem(`gsync_hash_${filePath}`, currentHash);
                    synced++;
                } else {
                    errors.push(`${filePath}: ${pushRes.error}`);
                }
            } catch (err: any) {
                console.error(`[GITHUB-SYNC] Chyba u ${filePath}:`, err);
                errors.push(`${filePath}: ${err.message}`);
            }
        }

        return { success: errors.length === 0, synced, skipped, errors };
    }

    async push_to_github(owner: string, repo: string, path: string, content: string, message: string): Promise<GitHubPushResponse> {
        if (!this.token) {
            return { success: false, error: "MISSING_TOKEN" };
        }

        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        
        try {
            // 1. Try to get the current file SHA (needed for updates)
            let sha: string | undefined = undefined;
            const getRes = await fetch(url, {
                headers: { 'Authorization': `token ${this.token}` }
            });
            
            if (getRes.ok) {
                const data = await getRes.json();
                sha = data.sha;
            }

            // 2. Perform the PUT (Create or Update)
            const putRes = await fetch(url, {
                method: 'PUT',
                headers: { 
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message,
                    content: this.b64EncodeUnicode(content), // Use UTF-8 safe encoder
                    sha: sha 
                })
            });

            const result = await putRes.json();
            console.log(`[GITHUB] API Response from ${owner}/${repo}:`, result);

            if (putRes.ok) {
                return {
                    success: true,
                    sha: result.content.sha,
                    url: result.content.html_url
                };
            } else {
                let diagnosticMsg = `G-SYNC ERROR: ${putRes.status} - ${putRes.statusText || 'Error'}`;
                if (putRes.status === 403) diagnosticMsg += "\nTOKEN NEMÁ PRÁVO ZAPISOVAT (Zkontrolujte 'repo' scope).";
                if (putRes.status === 404) diagnosticMsg += "\nREPOZITÁŘ NENALEZEN (Možná překlep nebo soukromý repo).";
                
                // Using alert for immediate diagnostic as requested
                window.alert(diagnosticMsg);

                // Return full JSON as error string for debugging if it fails
                return { 
                    success: false, 
                    error: JSON.stringify(result, null, 2) || "PUSH_FAILED" 
                };
            }
        } catch (e) {
            console.error("[GITHUB] Internal Error during push:", e);
            if (e instanceof Error) return { success: false, error: e.message };
            return { success: false, error: "NETWORK_ERROR" };
        }
    }

    async get_repo_contents(owner: string, repo: string): Promise<any[]> {
        if (!this.token) return [];
        
        try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
                headers: { 'Authorization': `token ${this.token}` }
            });
            
            console.log(`[GITHUB] Content status for ${owner}/${repo}:`, res.status);
            
            if (res.status === 404) {
                // Not an error in our flow, just means repo is empty/new
                return [];
            }

            if (!res.ok) return [];
            
            return await res.json();
        } catch (e) {
            console.error("[GITHUB] Unexpected error fetching contents:", e);
            return [];
        }
    }

    async get_file_content(owner: string, repo: string, path: string): Promise<string | null> {
        if (!this.token) return null;
        try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
                headers: { 'Authorization': `token ${this.token}` }
            });
            if (res.status === 404) return null;
            if (!res.ok) return null;
            const data = await res.json();
            // Decode base64 (UTF-8 safe)
            return decodeURIComponent(atob(data.content).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } catch (e) {
            console.error("[GITHUB] Failed to fetch file content:", e);
            return null;
        }
    }

    async get_last_commit(owner: string, repo: string): Promise<any> {
        if (!this.token) return null;
        
        try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, {
                headers: { 'Authorization': `token ${this.token}` }
            });
            
            if (!res.ok) return null;
            
            const [commit] = await res.json();
            if (!commit) return null;

            return {
                author: commit.commit.author.name,
                date: new Date(commit.commit.author.date).toLocaleString(),
                message: commit.commit.message
            };
        } catch (e) {
            console.error("[GITHUB] Failed to fetch last commit:", e);
            return null;
        }
    }
}
/* ID-END: GIT_API_001 */
