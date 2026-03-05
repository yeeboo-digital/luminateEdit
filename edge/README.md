# Luminate Online Page Editor - Edge

Browser extension for Microsoft Edge that adds a pencil icon to the toolbar when viewing Luminate Online pages, providing one-click access to administrative interfaces.

## Status

**Current Version**: 2.0.0-alpha.1 (Manifest V3)
**Status**: ✅ MV3 Complete
**Original Author**: [Noah Cooper](https://github.com/noahcooper)
**Current Maintainer**: [Yeeboo Digital](https://github.com/yeeboo-digital)

---

## Features

When viewing a Luminate Online page, a **pencil icon** appears in the toolbar. Clicking it opens the corresponding admin interface in a new tab.

Supports 50+ page types including PageBuilder, TeamRaiser, Donation Forms, Surveys, and more.

---

## Installation

### From Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/yeeboo-digital/luminateEdit.git
   cd luminateEdit
   ```

2. **Load in Edge**
   - Navigate to `edge://extensions/`
   - Enable "Developer mode" (toggle in left sidebar)
   - Click "Load unpacked"
   - Select the `edge/` directory

---

## Technical Details

### Current Implementation (Manifest V3)

- **Background**: Service worker (`background.js`)
- **Action API**: Shows icon on LO pages
- **Permissions**: `tabs`, `declarativeContent`
- **Browser API**: Uses Chrome Extensions API (Edge is Chromium-based)

### Files

```
edge/
├── manifest.json       # Extension configuration (MV3)
├── options.html        # Options page
├── logo16.png         # 16x16 icon
├── logo48.png         # 48x48 icon
├── logo128.png        # 128x128 icon
└── src/
    ├── background.js           # Background script entry point
    └── luminateEdit-edge.js    # Edge-specific wrapper
```

### Core Logic

The extension uses shared logic from [luminateEdit.js](https://github.com/yeeboo-digital/luminateEdit/blob/main/shared/src/luminateEdit.js) for servlet detection and URL mapping, wrapped in Chrome-compatible APIs for Edge.

---

## Edge-Specific Notes

### Chromium-Based

Microsoft Edge is based on Chromium, which means:

- Uses the same Chrome Extensions API
- Compatible with Chrome extension code
- Supports Manifest V3 service workers
- Nearly identical behavior to Chrome

---

## Development

### Testing Locally

After loading the unpacked extension:

1. Navigate to a Luminate Online site (e.g., `https://example.com/site/PageServer?pagename=home`)
2. Verify the pencil icon appears in the toolbar
3. Click the icon
4. Verify the correct admin page opens

### Debugging

- **View logs**: `edge://extensions/` → Click "Inspect views: service worker"
- **Reload extension**: `edge://extensions/` → Click reload button
- **Check permissions**: Ensure extension has access to the site

### Common Issues

**Icon not appearing**:
- Not on a Luminate Online page (must have `/site/` in URL)
- Extension not enabled
- Servlet not yet supported

**Wrong admin page opens**:
- Report an issue with the front-end and expected admin URLs

---

## Browser Compatibility

**Supported Edge Versions**:
- Microsoft Edge 90+ (Chromium-based)

**Note**: Legacy Edge (EdgeHTML-based) is not supported.

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
- [Opera Extension](../opera/README.md)
- [Architecture Documentation](../ARCHITECTURE.md)
