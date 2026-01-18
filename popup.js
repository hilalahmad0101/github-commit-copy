// Load and display commit history
async function loadHistory() {
    const container = document.getElementById('history-container');
    const clearBtn = document.getElementById('clear-btn');

    try {
        const result = await chrome.storage.local.get(['commitHistory']);
        const history = result.commitHistory || [];

        if (history.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h2>No commits yet</h2>
                    <p>Copy commits to see them here</p>
                </div>
            `;
            clearBtn.style.display = 'none';
            return;
        }

        clearBtn.style.display = 'block';
        container.innerHTML = history.map((commit, index) => `
            <div class="commit-item">
                <div class="commit-text" title="${commit}">${commit}</div>
                <button class="copy-btn" data-index="${index}">Copy</button>
            </div>
        `).join('');

        // Add click handlers to copy buttons
        container.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const index = parseInt(e.target.dataset.index);
                const commitText = history[index];

                try {
                    await navigator.clipboard.writeText(commitText);
                    btn.textContent = '✓ Copied';
                    btn.style.background = '#10b981';

                    setTimeout(() => {
                        btn.textContent = 'Copy';
                        btn.style.background = '#3b82f6';
                    }, 2000);
                } catch (error) {
                    console.error('Copy failed:', error);
                    btn.textContent = '✕ Failed';
                    btn.style.background = '#ef4444';

                    setTimeout(() => {
                        btn.textContent = 'Copy';
                        btn.style.background = '#3b82f6';
                    }, 2000);
                }
            });
        });

    } catch (error) {
        console.error('Error loading history:', error);
        container.innerHTML = `
            <div class="empty-state">
                <h2>Error loading history</h2>
                <p>Please try again</p>
            </div>
        `;
    }
}

// Clear history
document.getElementById('clear-btn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all commit history?')) {
        await chrome.storage.local.set({ commitHistory: [] });
        loadHistory();
    }
});

// Load history on popup open
loadHistory();

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.commitHistory) {
        loadHistory();
    }
});