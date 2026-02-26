# Luminate Online Page Editor - Safari

Browser extension for Safari that adds a pencil icon when viewing Luminate Online pages, providing one-click access to administrative interfaces.

## Status

**Current Version**: 1.12 (Legacy Safari Extension)
**Format**: `.safariextz` (Deprecated)
**Modernization**: 🔄 Converting to Safari WebExtension
**Original Author**: [Noah Cooper](https://github.com/noahcooper)
**Current Maintainer**: [Yeeboo Digital](https://github.com/yeeboo-digital)

---

## ⚠️ Important Notice

The current Safari extension uses the **legacy `.safariextz` format**, which Apple has deprecated. Safari 14+ requires the modern **Safari Web Extension** format.

**Status**:
- ❌ Legacy format (`.safariextz`) - No longer supported by Safari 14+
- 🔄 Safari Web Extension migration - In progress
- 📋 Safari App Extension - Under consideration

---

## Features

When viewing a Luminate Online page, this extension provides one-click access to the corresponding admin interface.

![screenshot](screenshot.png)

Supports 50+ page types including PageBuilder, TeamRaiser, Donation Forms, Surveys, and more.

---

## Installation

### Current Status

**Safari 13 and Earlier**:
- Legacy `.safariextz` file available in this repository
- Double-click `luminateEdit_safari.safariextz` to install
- ⚠️ Not recommended - outdated format

**Safari 14+**:
- Legacy format not supported
- Safari Web Extension version required (in development)
- Installation instructions will be provided after migration

---

## Technical Details

### Legacy Implementation (Deprecated)

```
safari/
├── luminateEdit_safari.safariextz  # Legacy Safari extension package
├── update-manifest.plist           # Update manifest
├── global.html                     # Global page (legacy format)
├── logo16.png                      # 16x16 icon
├── screenshot.png                  # Screenshot
└── src/
    ├── global.html              # Global page source
    └── luminateEdit-safari.js   # Safari-specific logic
```

### Core Logic

The extension uses shared logic from [luminateEdit.js](https://github.com/yeeboo-digital/luminateEdit/blob/main/shared/src/luminateEdit.js) for servlet detection and URL mapping, wrapped in Safari-specific APIs in [luminateEdit-safari.js](https://github.com/yeeboo-digital/luminateEdit/blob/main/safari/src/luminateEdit-safari.js).

---

## Safari Web Extension Migration

### What's Changing

**From**: Legacy Safari Extension (`.safariextz`)
- Used Safari's proprietary extension format
- Global pages and Safari-specific APIs
- Desktop-only

**To**: Safari Web Extension
- Based on standard WebExtensions API
- Compatible with Chrome/Firefox approach
- Supports iOS Safari (iPadOS)
- Requires Xcode for building
- Distributed via Mac App Store (or direct with certificate)

### Migration Challenges

1. **Development Requirements**
   - Requires macOS
   - Requires Xcode
   - Requires Apple Developer account for distribution

2. **API Differences**
   - Safari has some WebExtension API limitations
   - May need Safari-specific polyfills
   - Different manifest requirements

3. **Distribution**
   - Mac App Store submission required (or enterprise cert)
   - App Store review process
   - Additional complexity vs other browsers

### Migration Status

- [ ] Research Safari WebExtension requirements
- [ ] Set up Xcode project
- [ ] Convert to WebExtension format
- [ ] Create Safari App Extension wrapper
- [ ] Test on macOS Safari
- [ ] Test on iOS Safari (if feasible)
- [ ] Submit to Mac App Store (if pursuing)

---

## Development

### Building Legacy Extension (Not Recommended)

The legacy format requires:
- Safari Extension Builder (deprecated)
- macOS with Safari 13 or earlier
- Developer certificate

**Not recommended** - Focus on WebExtension migration instead.

### Building Safari Web Extension (Future)

```bash
# Prerequisites
# - macOS with Xcode installed
# - Apple Developer account

# Convert from Chrome/Firefox to Safari
cd safari-webextension/
xcrun safari-web-extension-converter ../chrome/

# Build in Xcode
open luminateEdit.xcodeproj
# Build and run from Xcode
```

Detailed instructions will be provided after migration.

---

## Testing Locally

### For Legacy Extension (Safari 13-)

1. Enable developer mode in Safari preferences
2. Double-click `.safariextz` file to install
3. Navigate to a Luminate Online site
4. Verify the extension icon appears
5. Click and verify correct admin page opens

### For Safari Web Extension (Future)

1. Build extension in Xcode
2. Run in simulator or on device
3. Enable extension in Safari settings
4. Navigate to Luminate Online site
5. Test functionality

---

## Known Issues

### Legacy Format
- ❌ Not compatible with Safari 14+
- ❌ No longer maintained by Apple
- ❌ Security concerns with outdated format

### WebExtension Migration
- ⏳ In progress
- ⏳ Requires significant refactoring
- ⏳ Distribution process TBD

---

## Contributing

We welcome contributions, especially for Safari Web Extension migration!

See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- Development workflow
- Coding standards
- How to add new servlet support
- Testing guidelines

**Wanted**:
- Safari/macOS developers familiar with WebExtensions
- Xcode project setup
- Safari-specific testing

---

## Browser Compatibility

**Legacy Extension**:
- Safari 12 and earlier (deprecated)

**Safari Web Extension** (Target):
- Safari 14+ (macOS 11+)
- Safari on iOS 15+ (iPadOS)

---

## Alternative: Use Chrome Extension in Safari

Safari 14+ can run some Chrome extensions via the Safari Web Extension converter. As a temporary solution:

1. Use the Chrome version of this extension
2. Convert using `safari-web-extension-converter`
3. Load in Safari

This is experimental and may not work for all features.

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
- [Safari Web Extensions Documentation](https://developer.apple.com/documentation/safariservices/safari_web_extensions)
