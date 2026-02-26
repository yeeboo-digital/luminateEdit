# Changelog

All notable changes to the Luminate Online Page Editor extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 🚧 In Progress - Version 2.0.0

This major version represents a complete modernization of the extension for 2026.

#### Added
- Comprehensive documentation (README.md, CONTRIBUTING.md, ARCHITECTURE.md)
- MIT License file
- Modern build system with Webpack
- Package.json with npm scripts
- ESLint and Prettier for code quality
- Jest testing framework
- Husky for git hooks
- Proper semantic versioning

#### Changed
- **[BREAKING]** Migrating to Manifest V3 (from V2)
- Updated repository from noahcooper → yeeboo-digital
- Modernized JavaScript (ES6+)
- Restructured project for better maintainability

#### Planned
- Manifest V3 support for Chrome, Firefox, Opera
- Modern Safari WebExtension format
- Microsoft Edge support
- Comprehensive test suite
- Automated CI/CD pipeline
- Browser store republication

---

## [1.12] - 2017-11-15

### Changed
- Minor bug fixes
- Updates to support Firefox 53+
- Dropped support for legacy versions of Firefox and Opera

---

## [1.11] - 2015-10-30

### Added
- Support for editing National Teams Top Events pages
- Support for editing Top Teams pages
- Support for editing Top Participants pages
- Support for editing Search pages

### Changed
- Updates to support Firefox 38+

---

## [1.10] - 2013-07-24

### Added
- **Opera Next support** - Extension now available for Opera browser
- Support for editing Progress Meters
- Link to Receipt Manager when viewing ReceiptViewer pages
- Support for editing secure TeamRaiser pages
- Support for editing custom TellAFriend pages created for:
  - PageBuilder pages
  - StoryBuilder articles
  - Events

---

## [1.9] - 2013-07-05

### Fixed
- Bug caused by change in Luminate Online URL syntax following move from JServ to Tomcat

---

## [1.8] - 2013-03-29

### Added
- Support for editing Rewards pages
- Link to Receipt Manager when viewing ReceiptRequest pages

### Changed
- Updated Firefox extension to use Add-on SDK 1.14 to ensure Firefox 20 compatibility

---

## [1.7] - 2013-03-05

### Fixed
- [Issue #1](https://github.com/noahcooper/luminateEdit/issues/1) - Bug with Action Alert Take Action Page edit link

---

## [1.6] - 2013-02-19

### Added
- Support for editing images in the Image Library
- Support for editing API configuration when viewing an API response document
- Support for editing AjaxProxy settings when viewing the AjaxProxy servlet

---

## [1.5] - 2013-02-08

### Added
- **Opera support** - Extension now available for Opera browser
- Support for editing Clubs pages
- Support for editing Directory pages

### Fixed
- Issue with getQueryParam method being broken when JavaScript was minified with UglifyJS
- Issue with Chrome URLs beginning with "view-source:"

---

## [1.4] - 2013-01-09

### Added
- Support for editing ConsProfileUser pages
- Support for editing ConsInterestsUser pages
- Support for editing Gift Service Center pages
- Support for editing Personal Events pages

### Changed
- Updated getQueryParam method to work with query strings preceded by `&amp;`

---

## [1.3] - 2013-01-04

### Added
- **Safari support** - Extension now available for Safari browser

### Fixed
- Minor bug fix for eCommerce confirmation page

---

## [1.2] - 2012-12-17

### Added
- **Firefox support** - Extension now available for Firefox browser
- Support for editing open authentication settings when viewing the GigyaLogin page
- Support for editing Photo Albums

---

## [1.1] - 2012-11-28

### Added
- Support for editing Donation Classic donation forms

### Fixed
- Issue with the default edit page for PageBuilder

---

## [1.0] - 2012-11-13

### Added
- Initial release for Chrome browser only
- Core functionality: One-click access to Luminate Online admin pages
- Page action (pencil icon) in address bar
- Support for 40+ Luminate Online servlets including:
  - PageBuilder pages
  - TeamRaiser events
  - Donation forms
  - Action alerts
  - Surveys
  - E-commerce
  - And more...

---

## Version History Overview

| Version | Date | Major Changes |
|---------|------|---------------|
| 2.0.0 | TBD | Manifest V3, modernization, documentation |
| 1.12 | 2017-11-15 | Firefox 53+ support, bug fixes |
| 1.11 | 2015-10-30 | National Teams support, Firefox 38+ |
| 1.10 | 2013-07-24 | Opera support, Progress Meters, secure TR pages |
| 1.9 | 2013-07-05 | JServ to Tomcat URL fix |
| 1.8 | 2013-03-29 | Rewards pages, Firefox 20 compatibility |
| 1.7 | 2013-03-05 | Action Alert bug fix |
| 1.6 | 2013-02-19 | Image Library, API config, AjaxProxy |
| 1.5 | 2013-02-08 | Opera support, Clubs, Directory |
| 1.4 | 2013-01-09 | Profile pages, Service Center |
| 1.3 | 2013-01-04 | Safari support, eCommerce fix |
| 1.2 | 2012-12-17 | Firefox support, Photo Albums |
| 1.1 | 2012-11-28 | Donation Classic support |
| 1.0 | 2012-11-13 | Initial Chrome release |

---

## Migration Guide: 1.x to 2.0

### For Users

Version 2.0 will be released to browser stores when ready. The transition should be seamless:

1. Existing installation will auto-update
2. Functionality remains the same
3. New Manifest V3 architecture (required by browsers)
4. Modern UI and performance improvements

### For Developers

If you've forked or modified this extension:

**Breaking Changes:**
- Manifest V2 → V3 (background pages → service workers)
- `pageAction` API → `action` API
- New permissions model
- Build system required (npm/webpack)

**Migration Steps:**
1. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for new structure
2. Update manifest to V3 format
3. Convert background pages to service workers
4. Install dependencies: `npm install`
5. Build: `npm run build`
6. Test thoroughly in all browsers

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup.

---

## Support and Feedback

- **Report bugs**: [GitHub Issues](https://github.com/yeeboo-digital/luminateEdit/issues)
- **Request features**: [GitHub Discussions](https://github.com/yeeboo-digital/luminateEdit/discussions)
- **Contribute**: See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Legend:**
- 🚧 In Progress
- ✅ Completed
- 📋 Planned
- 🐛 Bug Fix
- ✨ New Feature
- 🔥 Breaking Change
- 📚 Documentation
