# Commit Copier

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue.svg)](https://chrome.google.com/webstore) <!-- Update with actual store link when published -->

A professional Chrome extension that makes copying GitHub commit messages effortless with history tracking and beautiful notifications.

**Repository:** [https://github.com/hilalahmad0101/github-commit-copy](https://github.com/hilalahmad0101/github-commit-copy)

## Features

- **One-Click Copy**: Adds copy buttons directly to GitHub commit lists
- **History Tracking**: Keeps a history of your recently copied commits
- **Toast Notifications**: Beautiful success/error notifications when copying
- **Persistent Storage**: Your commit history is saved locally
- **Clean UI**: Modern, responsive popup interface with gradient design

## Installation

### Option 1: From Chrome Web Store (Coming Soon)
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore)
2. Search for "Commit Copier"
3. Click "Add to Chrome"

### Option 2: Manual Installation (Developer Mode)

#### Prerequisites
- Google Chrome or Chromium-based browser
- Git (optional, for cloning)

#### Setup Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/hilalahmad0101/github-commit-copy.git
   cd github-commit-copy
   ```

   Or download the ZIP file from the repository and extract it.

2. **Load the extension in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" button
   - Select the `github-commit-copy` directory (the one containing `manifest.json`)
   - The extension will appear in your extensions list and be ready to use

3. **Verify installation:**
   - You should see the Commit Copier icon in your Chrome toolbar
   - Visit any GitHub repository's commits page to see the copy buttons

## Usage

1. Navigate to any GitHub repository's commit history page
2. You'll see "Copy" buttons appear next to each commit message
3. Click any "Copy" button to copy the commit message to your clipboard
4. A success notification will appear
5. Open the extension popup to view your copy history
6. Use the "Copy" buttons in the popup to copy from history again
7. Click "Clear History" to remove all saved commits

## Permissions

This extension requires the following permissions:
- **Storage**: To save your commit history locally
- **Clipboard Write**: To copy commit messages to your clipboard

## How It Works

The extension injects a content script into GitHub pages that:
- Detects commit list items on the page
- Adds styled copy buttons to each commit
- Handles the copy operation using the modern Clipboard API
- Saves copied commits to Chrome's local storage
- Displays toast notifications for user feedback

The popup interface provides:
- A list view of recently copied commits
- Individual copy buttons for each history item
- A clear history function

## Development

### Project Structure
```
├── manifest.json      # Extension manifest (v3)
├── popup.html         # Extension popup interface
├── popup.js          # Popup functionality
├── content.js        # Content script for GitHub pages
├── styles.css        # Additional styles
└── icons/            # Extension icons (16x16, 48x48, 128x128)
```

### Building
No build process required - this is a pure JavaScript extension.

### Testing
1. Load the extension in developer mode
2. Visit any GitHub repository's commits page
3. Test the copy functionality
4. Check the popup for history

## Browser Support

- Chrome 88+ (Manifest V3)
- Chromium-based browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify as needed.

## Privacy

This extension only stores commit messages that you explicitly copy. No data is transmitted anywhere - everything stays local in your browser's storage.