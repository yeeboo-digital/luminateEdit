# Luminate Online Page Editor - Chrome

Browser extension for Chrome/Chromium that adds a pencil icon to the address bar when viewing Luminate Online pages, providing one-click access to administrative interfaces.

## Status

**Current Version**: 1.12 (Manifest V2)
**Modernization**: 🔄 Migrating to Manifest V3
**Original Author**: [Noah Cooper](https://github.com/noahcooper)
**Current Maintainer**: [Yeeboo Digital](https://github.com/yeeboo-digital)

---

## Features

When viewing a Luminate Online page, a **pencil icon** appears in the address bar. Clicking it opens the corresponding admin interface in a new tab.

![screenshot](screenshot.png)

Supports 50+ page types including PageBuilder, TeamRaiser, Donation Forms, Surveys, and more.

---

## Installation

### From Chrome Web Store (Legacy)

The current Manifest V2 version is available but will need updating soon:

[Install from Chrome Web Store](https://chrome.google.com/webstore/detail/luminate-online-page-edit/dpkklfhgpnjklakhoelfnbfgihkfgpap)

### From Source (Recommended for Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yeeboo-digital/luminateEdit.git
   cd luminateEdit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build:chrome
   ```

4. **Load in Chrome**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `chrome/` directory (or `dist/chrome/` if using build)

---

## Technical Details

### Current Implementation (Manifest V2)

- **Background Script**: Persistent background page
- **Page Action API**: Shows icon only on LO pages
- **Permissions**: `tabs`

### Files

```
chrome/
├── manifest.json       # Extension configuration (MV2)
├── background.js       # Compiled background script
├── logo16.png         # 16x16 icon
├── logo48.png         # 48x48 icon
├── logo128.png        # 128x128 icon
├── screenshot.png     # Store screenshot
└── src/
    ├── background.js           # Background script entry point
    └── luminateEdit-chrome.js  # Chrome-specific wrapper
```

### Core Logic

The extension uses shared logic from [luminateEdit.js](https://github.com/yeeboo-digital/luminateEdit/blob/main/shared/src/luminateEdit.js) for servlet detection and URL mapping, wrapped in Chrome-specific APIs in [luminateEdit-chrome.js](https://github.com/yeeboo-digital/luminateEdit/blob/main/chrome/src/luminateEdit-chrome.js).

Compiled into [background.js](https://github.com/yeeboo-digital/luminateEdit/blob/main/chrome/background.js) for runtime.

---

## Manifest V3 Migration

⚠️ **Important**: Chrome is deprecating Manifest V2 extensions. This extension is being migrated to MV3.

### Key Changes Required

1. **Service Worker** instead of background page
2. **Action API** instead of Page Action
3. **Updated permissions** model
4. **Modern JavaScript** (ES6 modules)

### Migration Status

- [ ] Update manifest to V3
- [ ] Convert background page to service worker
- [ ] Replace pageAction with action API
- [ ] Update permissions
- [ ] Test thoroughly
- [ ] Publish to Chrome Web Store

See [ARCHITECTURE.md](../ARCHITECTURE.md) for migration details.

---

## Development

### Testing Locally

After loading the unpacked extension:

1. Navigate to a Luminate Online site (e.g., `https://example.com/site/PageServer?pagename=home`)
2. Verify the pencil icon appears in the address bar
3. Click the icon
4. Verify the correct admin page opens

### Debugging

- **View logs**: Right-click extension icon → Inspect background page
- **Reload extension**: `chrome://extensions/` → Click reload button
- **Check permissions**: Ensure extension has access to the site

### Common Issues

**Icon not appearing**:
- Not on a Luminate Online page (must have `/site/` in URL)
- Extension not enabled
- Servlet not yet supported

**Wrong admin page opens**:
- Report an issue with the front-end and expected admin URLs

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- Development workflow
- Coding standards
- How to add new servlet support
- Testing guidelines

---

## Browser Compatibility

This extension is compatible with:
- Google Chrome (v90+)
- Microsoft Edge (v90+)
- Brave Browser
- Other Chromium-based browsers

---

## Support

- **Issues**: [GitHub Issues](https://github.com/yeeboo-digital/luminateEdit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yeeboo-digital/luminateEdit/discussions)
- **Main Documentation**: [Project README](../README.md)

---

## License

MIT License - see [LICENSE](../LICENSE) for details.

**Original Work**: Copyright (c) 2012-2017 Noah Cooper
**Current Maintainer**: Copyright (c) 2026-present Yeeboo Digital

---

## Related

- [Firefox Extension](../firefox/README.md)
- [Opera Extension](../opera/README.md)
- [Safari Extension](../safari/README.md)
- [Architecture Documentation](../ARCHITECTURE.md)
