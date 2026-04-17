# ID-START: PY_EXT_002
import os
import json
import time
import urllib.request
import base64

def get_github_archive(token, owner, repo, path):
    """Stáhne aktuální archive.json z GitHubu."""
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    req = urllib.request.Request(url)
    if token:
        req.add_header('Authorization', f'token {token}')
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            content_b64 = data.get('content', '')
            # GitHub encoding uses newlines in b64
            content_json = base64.b64decode(content_b64.replace('\n', '')).decode('utf-8')
            return json.loads(content_json)
    except Exception as e:
        print(f"[PY-EXTRACTOR] Varování: Nepodařilo se stáhnout archiv ({e}).")
        return []

def download_video(url, quality="best"):
    """Simulace stahování a appendování do archivu."""
    print(f"[PY-EXTRACTOR] Zahajuji extrakci (V2): {url}")
    
    # Progress simulation
    for i in range(0, 101, 25):
        print(f"[PROGRESS] {i}%")
        time.sleep(0.3)

    video_id = str(int(time.time()))
    new_entry = {
        "id": video_id,
        "url": url,
        "title": f"Synthesis Media - {video_id}",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "status": "COMPLETED",
        "quality": quality
    }

    # GitHub Sync Logic
    token = os.environ.get('GITHUB_TOKEN')
    owner = "jirisar7-eng"
    repo = "syncore-media"
    archive_path = "repo/downloads/archive.json"

    archive = []
    if token:
        archive = get_github_archive(token, owner, repo, archive_path)
    
    if not isinstance(archive, list):
        archive = []

    archive.append(new_entry)
    
    # Zápis do lokálního logu pro server
    with open("download_log.json", "w") as f:
        json.dump(archive, f, indent=4)

    print(f"[PY-EXTRACTOR] Extrakce {video_id} dokončena. Archiv aktualizován.")
    return new_entry

if __name__ == "__main__":
    import sys
    target_url = sys.argv[1] if len(sys.argv) > 1 else "no-url"
    download_video(target_url)

# ID-END: PY_EXT_002
