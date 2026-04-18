/* ID-START: SEA_ENG_002 */
export const initSearch = () => {
    const input = document.getElementById('search-input') as HTMLInputElement;
    const results = document.getElementById('results');

    if (!input || !results) return;

    input.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value;
        if (query.length > 2) {
            renderMockResults(query, results);
        } else {
            results.innerHTML = '';
        }
    });
};

const renderMockResults = (query: string, container: HTMLElement) => {
    container.innerHTML = `
        <div class="card">
            <div class="thumb" style="background: url('https://picsum.photos/seed/${query}1/400/225') center/cover;"></div>
            <div class="info">
                <h3>${query} - Testovací Song 1 (YouTube)</h3>
                <button class="stream-btn">STÁHNOUT (STREAM)</button>
            </div>
        </div>
        <div class="card">
            <div class="thumb" style="background: url('https://picsum.photos/seed/${query}2/400/225') center/cover;"></div>
            <div class="info">
                <h3>${query} - Remix Edition (TikTok)</h3>
                <button class="stream-btn">STÁHNOUT (STREAM)</button>
            </div>
        </div>
    `;
};
/* ID-END: SEA_ENG_002 */
