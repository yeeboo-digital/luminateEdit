# Luminate Online Page Editor - Opera

Browser extension for Opera that adds a pencil icon to the address bar when viewing Luminate Online pages, providing one-click access to administrative interfaces.

## Status

**Current Version**: 2.0.0-alpha.1 (Manifest V3)
**Status**: ✅ MV3 Migration Complete
**Original Author**: [Noah Cooper](https://github.com/noahcooper)
**Current Maintainer**: [Yeeboo Digital](https://github.com/yeeboo-digital)

---

## Features

When viewing a Luminate Online page, a **pencil icon** appears in the address bar. Clicking it opens the corresponding admin interface in a new tab.

![screenshot](screenshot.png)

Supports 50+ page types including PageBuilder, TeamRaiser, Donation Forms, Surveys, and more.

---

## Installation

### From Opera Add-ons (Coming Soon)

The extension will be published to Opera Add-ons after Manifest V3 migration.

### From Source (Current Method)

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
   npm run build:opera
   ```

4. **Load in Opera**
   - Navigate to `opera://extensions`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `opera/` directory (or `dist/opera/` if using build)

---

## Technical Details

### Current Implementation (Manifest V3)

- **Background**: Service worker (`background.js`)
- **Action API**: Shows icon on LO pages
- **Permissions**: `tabs`, `declarativeContent`
- **Browser API**: Uses Chrome Extensions API (Opera is Chromium-based)

### Files

```
opera/
├── manifest.json       # Extension configuration (MV3)
├── background.js       # Compiled background script
├── logo16.png         # 16x16 icon
├── logo48.png         # 48x48 icon
├── logo128.png        # 128x128 icon
├── screenshot.png     # Store screenshot
└── src/
    ├── background.js              # Background script entry point
    └── luminateEdit-operaNext.js  # Opera-specific wrapper
```

### Core Logic

The extension uses shared logic from [luminateEdit.js](https://github.com/yeeboo-digital/luminateEdit/blob/main/shared/src/luminateEdit.js) for servlet detection and URL mapping, wrapped in Chrome-compatible APIs in [luminateEdit-operaNext.js](https://github.com/yeeboo-digital/luminateEdit/blob/main/opera/src/luminateEdit-operaNext.js).

Compiled into [background.js](https://github.com/yeeboo-digital/luminateEdit/blob/main/opera/background.js) for runtime.

---

## Opera-Specific Notes

### Chromium-Based

Modern Opera (Opera 15+) is based on Chromium, which means:

- Uses the same Chrome Extensions API
- Compatible with Chrome extension code
- Similar behavior to Chrome/Edge
- Supports most Chrome extensions with minimal changes

### Opera "Next"

The original implementation targeted "Opera Next" (the beta channel). Modern Opera uses the stable release, which follows Chrome's extension model closely.

---

## Development

### Testing Locally

After loading the unpacked extension:

1. Navigate to a Luminate Online site (e.g., `https://example.com/site/PageServer?pagename=home`)
2. Verify the pencil icon appears in the address bar
3. Click the icon
4. Verify the correct admin page opens

### Debugging

- **View logs**: `opera://extensions/` → Click "Inspect views: service worker"
- **Reload extension**: `opera://extensions` → Click reload button
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

**Supported Opera Versions**:
- Opera 15+ (Chromium-based)
- Opera GX
- Opera Beta/Developer

**Note**: Legacy Opera (Presto-based, Opera 12 and earlier) is not supported.

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

- [Chrome Extension](../chrome/README.md)
- [Firefox Extension](../firefox/README.md)
- [Edge Extension](../edge/README.md)
- [Architecture Documentation](../ARCHITECTURE.md)
