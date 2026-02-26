# Luminate Online Page Editor

A browser extension that streamlines editing workflows for [Luminate Online](https://www.blackbaud.com/online-marketing/luminate-online) website administrators by providing one-click access to page administration interfaces.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Status: Active Modernization 🚧

This extension is currently being modernized for 2026:
- ✅ Documentation updates
- 🔄 Migrating to Manifest V3
- 🔄 Modern build system implementation
- 🔄 Testing infrastructure
- 📋 Browser store republication planned

**Original Version**: 1.12 (November 2017)
**Maintained By**: [Yeeboo Digital](https://github.com/yeeboo-digital)
**Original Author**: [Noah Cooper](https://github.com/noahcooper)

---

## Features

When viewing a Luminate Online page, this extension displays a **pencil icon** in your browser toolbar. Clicking the icon opens a new tab directly to the administrative interface for that specific page—eliminating the need to manually navigate through the admin panel.

### Supported Page Types

The extension recognizes and provides edit links for 50+ Luminate Online page types, including:

- **PageBuilder** pages
- **TeamRaiser** events (registration, participant center, personal pages, team pages)
- **Donation Forms** (Donation2, Classic)
- **Action Alerts** and Advocacy pages
- **Events** (Calendar, Ticketing)
- **eCommerce** stores and products
- **Surveys**
- **Email** (Ecards, Tell-a-Friend)
- **Personal Fundraising** (Tributes/Champions)
- **Content** (News/Articles, Photo Albums)
- **Administrative** (API config, Image Library, Receipt Manager)
- And many more...

See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete technical details.

---

## Browser Support

| Browser | Status | Manifest | Installation |
|---------|--------|----------|--------------|
| **Chrome** | 🔄 Updating to MV3 | V2 → V3 | [Chrome Web Store](https://chrome.google.com/webstore/detail/luminate-online-page-edit/dpkklfhgpnjklakhoelfnbfgihkfgpap) (legacy) |
| **Firefox** | 🔄 Updating to MV3 | V2 → V3 | Manual install (see below) |
| **Opera** | 🔄 Updating | V2 → V3 | Manual install (see below) |
| **Safari** | 🔄 Modernizing | Legacy → WebExtension | Manual install (see below) |
| **Edge** | 📋 Planned | V3 | Coming soon |

---

## Installation

### From Browser Stores (Coming Soon)

Once modernization is complete, the extension will be published to official browser stores.

**Current Chrome Web Store version (1.12)** is legacy but still functional:
- [Luminate Online Page Editor - Chrome](https://chrome.google.com/webstore/detail/luminate-online-page-edit/dpkklfhgpnjklakhoelfnbfgihkfgpap)

### From Source (Developer Install)

#### Prerequisites
- Node.js 18+ and npm
- Git

#### Steps

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
   npm run build
   ```

4. **Load in your browser**

   **Chrome/Edge:**
   1. Navigate to `chrome://extensions/`
   2. Enable "Developer mode" (toggle in top right)
   3. Click "Load unpacked"
   4. Select the `chrome/` directory

   **Firefox:**
   1. Navigate to `about:debugging#/runtime/this-firefox`
   2. Click "Load Temporary Add-on"
   3. Select the `manifest.json` file in the `firefox/` directory

   **Opera:**
   1. Navigate to `opera://extensions/`
   2. Enable "Developer mode"
   3. Click "Load unpacked"
   4. Select the `opera/` directory

   **Safari:**
   - Safari extension modernization in progress
   - Legacy `.safariextz` format available but not recommended

---

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/yeeboo-digital/luminateEdit.git
cd luminateEdit

# Install dependencies
npm install

# Start development mode (watches for changes)
npm run dev
```

### Project Structure

```
luminateEdit/
├── shared/src/luminateEdit.js    # Core logic - servlet detection & URL mapping
├── chrome/                        # Chrome-specific implementation
├── firefox/                       # Firefox-specific implementation
├── opera/                         # Opera-specific implementation
├── safari/                        # Safari-specific implementation
└── docs/                          # Documentation
```

### Build Commands

```bash
npm run build          # Build all browser extensions
npm run build:chrome   # Build Chrome extension only
npm run build:firefox  # Build Firefox extension only
npm run build:opera    # Build Opera extension only
npm run build:safari   # Build Safari extension only
npm run lint           # Run linting
npm run test           # Run tests
```

### How It Works

1. Extension monitors page URLs via browser APIs
2. Detects Luminate Online servlets in the URL path
3. Parses query parameters to identify specific page/content IDs
4. Maps to corresponding admin interface URL
5. Displays pencil icon when match is found
6. On click, opens admin URL in new tab

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical documentation.

### Adding Support for New Page Types

To add support for a new Luminate Online servlet:

1. Add a new servlet object to `shared/src/luminateEdit.js`:
   ```javascript
   servlets: {
     YourNewServlet: {
       getUrl: function() {
         var adminUrl = 'AdminServletName';
         var currentId = luminateEdit.getQueryParam('id');
         adminUrl += '?param=${id}';
         return adminUrl.replace('${id}', currentId);
       }
     }
   }
   ```

2. Test on a Luminate Online instance
3. Submit a pull request (see [CONTRIBUTING.md](./CONTRIBUTING.md))

---

## Testing

### Manual Testing

1. Build the extension
2. Load in developer mode (see Installation)
3. Navigate to a Luminate Online site
4. Verify pencil icon appears
5. Click icon and verify correct admin page opens

### Automated Testing

```bash
npm run test           # Run all tests
npm run test:unit      # Unit tests only
npm run test:e2e       # End-to-end tests
npm run test:watch     # Watch mode
```

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Code of conduct
- Development workflow
- Pull request process
- Coding standards

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-feature`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m "Add support for XYZ servlet"`
5. Push to your fork: `git push origin feature/my-new-feature`
6. Open a pull request

---

## Troubleshooting

### Pencil icon not appearing

**Possible causes:**
- Not on a Luminate Online site (extension only activates on LO pages)
- Servlet not yet supported (check supported list above)
- Extension not properly installed/enabled

**Debug steps:**
1. Check that extension is enabled in browser extensions page
2. Verify you're on a page with `/site/` in the URL
3. Open browser console and check for errors
4. Try reloading the page

### Wrong admin page opens

This may indicate:
- Luminate Online has changed their URL structure
- New servlet version we don't yet support
- Please [open an issue](https://github.com/yeeboo-digital/luminateEdit/issues) with:
  - The front-end page URL
  - The admin URL it should open
  - Your Luminate Online version

### Extension not working after update

1. Remove and reinstall the extension
2. Clear browser cache
3. Check for browser console errors
4. Verify you're using a supported browser version

---

## Roadmap

### Phase 1: Foundation (Current)
- [x] Documentation modernization
- [ ] Add LICENSE and CONTRIBUTING.md
- [ ] Set up modern build system
- [ ] Add testing framework

### Phase 2: Modernization
- [ ] Migrate to Manifest V3 (Chrome, Firefox, Opera)
- [ ] Modernize Safari extension to WebExtension
- [ ] Add Edge support
- [ ] Comprehensive testing

### Phase 3: Enhancement
- [ ] Options/settings page
- [ ] Custom servlet configuration
- [ ] Dark mode icon
- [ ] Keyboard shortcuts

### Phase 4: Publication
- [ ] Publish to Chrome Web Store
- [ ] Publish to Firefox Add-ons
- [ ] Publish to Opera Add-ons
- [ ] Submit to Edge Add-ons
- [ ] Safari App Store (if feasible)

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

**Latest**: Version 1.12 (November 15, 2017)
- Minor bug fixes
- Firefox 53+ support
- Dropped legacy browser support

---

## License

MIT License - see [LICENSE](./LICENSE) file for details.

This is free and unencumbered software released into the public domain for the benefit of the Luminate Online community.

---

## Acknowledgments

- **Original Author**: [Noah Cooper](https://github.com/noahcooper) - Created and maintained through v1.12
- **Current Maintainer**: [Yeeboo Digital](https://github.com/yeeboo-digital) - Modernization and ongoing development
- **Contributors**: See [CONTRIBUTORS.md](./CONTRIBUTORS.md)

---

## Support

- **Issues**: [GitHub Issues](https://github.com/yeeboo-digital/luminateEdit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yeeboo-digital/luminateEdit/discussions)
- **Email**: For security issues, email [security contact]

---

## Related Projects

- [Luminate Online Documentation](https://www.blackbaud.com/online-marketing/luminate-online)
- [Convio/Luminate API Documentation](https://open.convio.com/api/)

---

**Note**: This extension is not officially affiliated with or endorsed by Blackbaud, Inc. It is a community tool created to improve the workflow of Luminate Online administrators.
