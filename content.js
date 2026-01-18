// (function () {
//     let lastUrl = location.href;
//     console.log("Content script injected");

//     const observer = new MutationObserver(() => {
//         if (location.href !== lastUrl) {
//             lastUrl = location.href;
//         }
//     });

//     observer.observe(document.body, {
//         childList: true,
//         subtree: true
//     });
//     const allLists = document.querySelectorAll("ul");
//     console.log(allLists)
//     allLists.forEach((ul) => {
//         ul.querySelectorAll('li[id*="list-view-node"]').forEach((li) => {
//             li.style.position = "relative";
//             const btn = document.createElement("button");
//             btn.textContent = "Copy";
//             btn.style.margin = "6px";
//             btn.style.cursor = "pointer";
//             btn.style.position = "absolute";
//             btn.style.right = "0px";
//             btn.style.top = "0px";

//             btn.addEventListener("click", () => {
//                 const content = li.querySelector('span[class*="Text__StyledText-sc"]');
//                 if (content) {
//                     const titleAttribute = content.querySelector('a').getAttribute('title');
//                     if (titleAttribute) {
//                         const text = titleAttribute;
//                         navigator.clipboard.writeText(text);
//                         alert("Copied to clipboard:");
//                     }
//                 } else {
//                     console.error("No content found in the list item.");
//                 }
//             });
//             li.appendChild(btn);
//         })
//     });
// })();

(function () {
    let lastUrl = location.href;
    console.log("Content script injected");

    // Create toast container
    const createToastContainer = () => {
        if (document.getElementById('commit-toast-container')) return;

        const container = document.createElement('div');
        container.id = 'commit-toast-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    };

    // Show toast notification
    const showToast = (message, type = 'success') => {
        createToastContainer();
        const container = document.getElementById('commit-toast-container');

        const toast = document.createElement('div');
        toast.style.cssText = `
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
            pointer-events: auto;
            animation: slideIn 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 12px;
        `;

        const icon = type === 'success' ? '✓' : '✕';
        toast.innerHTML = `
            <span style="font-size: 18px;">${icon}</span>
            <span>${message}</span>
        `;

        // Add animation keyframes if not exists
        if (!document.getElementById('toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        container.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // Save commit to history
    const saveCommitToHistory = async (commitText) => {
        try {
            const result = await chrome.storage.local.get(['commitHistory']);
            let history = result.commitHistory || [];

            // Add new commit to the beginning, avoid duplicates
            history = [commitText, ...history.filter(c => c !== commitText)];

            // Keep only last 50 commits
            history = history.slice(0, 50);

            await chrome.storage.local.set({ commitHistory: history });
        } catch (error) {
            console.error('Error saving to history:', error);
        }
    };

    // Enhanced copy button styling
    const createCopyButton = () => {
        const btn = document.createElement("button");
        btn.textContent = "Copy";
        btn.style.cssText = `
            margin: 6px;
            cursor: pointer;
            position: absolute;
            right: 0px;
            top: 0px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 600;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        `;

        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#2563eb';
            btn.style.transform = 'translateY(-1px)';
            btn.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.4)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.background = '#3b82f6';
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.3)';
        });

        return btn;
    };

    // const observer = new MutationObserver(() => {
    //     if (location.href !== lastUrl) {
    //         lastUrl = location.href;
    //         initializeCopyButtons();
    //     }
    // });

    // observer.observe(document.body, {
    //     childList: true,
    //     subtree: true
    // });

    const observer = new MutationObserver((mutations) => {
        // Check if any new nodes were added
        const hasNewNodes = mutations.some(m => m.addedNodes.length > 0);
        if (hasNewNodes || location.href !== lastUrl) {
            lastUrl = location.href;
            initializeCopyButtons();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // const initializeCopyButtons = () => {
    //     const allLists = document.querySelectorAll("ul");
    //     allLists.forEach((ul) => {
    //         ul.querySelectorAll('li[id*="list-view-node"]').forEach((li) => {
    //             // Skip if button already exists
    //             if (li.querySelector('.commit-copy-btn')) return;

    //             li.style.position = "relative";
    //             const btn = createCopyButton();
    //             btn.className = 'commit-copy-btn';

    //             btn.addEventListener("click", async () => {
    //                 const content = li.querySelector('span[class*="Text__StyledText-sc"]');
    //                 if (content) {
    //                     const titleAttribute = content.querySelector('a')?.getAttribute('title');
    //                     if (titleAttribute) {
    //                         try {
    //                             await navigator.clipboard.writeText(titleAttribute);
    //                             await saveCommitToHistory(titleAttribute);
    //                             showToast('Commit copied to clipboard!', 'success');
    //                         } catch (error) {
    //                             console.error('Copy failed:', error);
    //                             showToast('Failed to copy commit', 'error');
    //                         }
    //                     }
    //                 } else {
    //                     showToast('No content found', 'error');
    //                 }
    //             });

    //             li.appendChild(btn);
    //         });
    //     });
    // };

    // Initial setup
    const initializeCopyButtons = () => {
        // Select the list items specifically
        const items = document.querySelectorAll('li[id*="list-view-node"]');

        items.forEach((li) => {
            if (li.querySelector('.commit-copy-btn')) return;

            li.style.position = "relative";
            const btn = createCopyButton();
            btn.className = 'commit-copy-btn';

            btn.addEventListener("click", async (e) => {
                e.preventDefault(); // Prevent accidental navigation
                e.stopPropagation();

                const content = li.querySelector('span[class*="Text__StyledText-sc"]');
                const titleAttribute = content?.querySelector('a')?.getAttribute('title');

                if (titleAttribute) {
                    try {
                        await navigator.clipboard.writeText(titleAttribute);
                        await saveCommitToHistory(titleAttribute);
                        showToast('Commit copied!', 'success');
                    } catch (err) {
                        showToast('Copy failed', 'error');
                    }
                }
            });

            li.appendChild(btn);
        });
    };

    const runInsurance = () => {
        let count = 0;
        const interval = setInterval(() => {
            initializeCopyButtons();
            count++;
            if (count > 10) clearInterval(interval); // Stop after 5 seconds
        }, 500);
    };

    runInsurance();
    initializeCopyButtons();
})();