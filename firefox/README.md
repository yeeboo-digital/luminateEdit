# Luminate Online Page Editor - Firefox

Browser extension for Firefox that adds a pencil icon to the address bar when viewing Luminate Online pages, providing one-click access to administrative interfaces.

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

### From Firefox Add-ons (Coming Soon)

The extension will be published to Firefox Add-ons after Manifest V3 migration.

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
   npm run build:firefox
   ```

4. **Load in Firefox**

   **Option A: Temporary installation (for testing)**
   - Navigate to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file in the `firefox/` directory (or `dist/firefox/`)
   - Extension will be removed when Firefox restarts

   **Option B: Permanent installation (requires signing)**
   - Build and package: `npm run package:firefox`
   - Submit to Firefox Add-ons for signing
   - Install the signed `.xpi` file

---

## Technical Details

### Current Implementation (Manifest V3)

- **Background Scripts**: MV3 background scripts
- **Action API**: Shows icon on LO pages
- **Permissions**: `tabs`, `activeTab`
- **Browser API**: Uses `browser.*` namespace (WebExtensions)

### Files

```
firefox/
├── manifest.json       # Extension configuration (MV3)
├── background.js       # Compiled background script
├── logo16.png         # 16x16 icon
├── logo48.png         # 48x48 icon
├── logo128.png        # 128x128 icon
├── screenshot.png     # Store screenshot
└── src/
    ├── background.js           # Background script entry point
    └── luminateEdit-firefox.js # Firefox WebExtension wrapper
```

### Core Logic

The extension uses shared logic from [luminateEdit.js](https://github.com/yeeboo-digital/luminateEdit/blob/main/shared/src/luminateEdit.js) for servlet detection and URL mapping, wrapped in WebExtension APIs in the Firefox-specific wrapper.

Compiled into [background.js](https://github.com/yeeboo-digital/luminateEdit/blob/main/firefox/background.js) for runtime.

---

## Firefox-Specific Notes

### WebExtensions API

Firefox uses the standard WebExtensions API with some differences from Chrome:

- **Namespace**: Prefers `browser.*` over `chrome.*` (both work)
- **Promises**: Returns Promises instead of callbacks
- **Compatibility**: Generally compatible with Chrome extensions

### Temporary vs Permanent Installation

**Temporary Installation**:
- Quick testing during development
- Removed on browser restart
- No signing required

**Permanent Installation**:
- Requires signing by Mozilla
- Persists across restarts
- Needed for distribution

---

## Development

### Testing Locally

After loading the extension:

1. Navigate to a Luminate Online site (e.g., `https://example.com/site/PageServer?pagename=home`)
2. Verify the pencil icon appears in the address bar
3. Click the icon
4. Verify the correct admin page opens

### Debugging

- **View logs**: `about:debugging` → This Firefox → Inspect
- **Reload extension**: Click "Reload" button in about:debugging
- **Check permissions**: Ensure extension has access to the site

### Running Tests

```bash
# Run in Firefox for testing
npm run serve:firefox

# This uses web-ext to launch Firefox with the extension loaded
```

### Common Issues

**Icon not appearing**:
- Not on a Luminate Online page (must have `/site/` in URL)
- Extension not enabled
- Servlet not yet supported

**Extension disappears after restart**:
- This is normal for temporary installations
- Reload from `about:debugging` or install permanently

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

**Supported Firefox Versions**:
- Firefox 53+ (current implementation)
- Firefox 109+ (recommended for MV3)
- Firefox ESR (Extended Support Release)

**Testing Checklist**:
- [ ] Firefox (latest stable)
- [ ] Firefox ESR
- [ ] Firefox Developer Edition

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
- [Opera Extension](../opera/README.md)
- [Edge Extension](../edge/README.md)
- [Architecture Documentation](../ARCHITECTURE.md)
