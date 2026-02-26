# Shared Resources

This directory contains resources shared across all browser implementations of the Luminate Online Page Editor extension.

## Directory Structure

```
shared/
├── README.md           # This file
├── logo16.png         # 16x16 icon
├── logo48.png         # 48x48 icon
├── logo128.png        # 128x128 icon
└── src/
    └── luminateEdit.js  # Core logic (1300+ lines)
```

---

## Core Logic: luminateEdit.js

The heart of the extension, containing all servlet detection and URL mapping logic.

### Purpose

This file provides a browser-agnostic implementation that:
1. Detects Luminate Online servlets from page URLs
2. Maps front-end URLs to corresponding admin URLs
3. Parses query parameters
4. Supports 50+ different page types

### Architecture

```javascript
var luminateEdit = {
  tabUrl: null,  // Current page URL

  getCurrentServlet: function() { ... },  // Extract servlet name
  getQueryParam: function(paramName) { ... },  // Get URL parameter

  servlets: {
    PageServer: { getUrl: function() { ... } },
    TeamRaiser: { getUrl: function() { ... } },
    // ... 50+ more servlets
  }
};
```

### Browser Integration

Each browser wraps this core logic:

- **Chrome/Edge**: Uses Chrome Extensions API
- **Firefox**: Uses WebExtensions API
- **Opera**: Uses Chrome Extensions API (Chromium-based)
- **Safari**: Uses Safari-specific APIs (legacy) or WebExtensions (modern)

### Key Functions

#### `getCurrentServlet()`

Extracts the servlet name from a Luminate Online URL.

**Example**:
```javascript
luminateEdit.tabUrl = "https://example.com/site/PageServer?pagename=home";
luminateEdit.getCurrentServlet(); // Returns "PageServer"
```

**Supported Patterns**:
- `/site/{servlet}?params` - Standard pages
- `/site/{servlet};jsessionid=...` - Pages with session IDs
- `/images/content/pagebuilder/...` - Image Library (special case)

#### `getQueryParam(paramName)`

Retrieves a query parameter value from the current URL.

**Example**:
```javascript
luminateEdit.tabUrl = "https://example.com/site/Survey?SURVEY_ID=1001";
luminateEdit.getQueryParam('SURVEY_ID'); // Returns "1001"
```

**Features**:
- Handles `&amp;` entity encoding
- Returns `null` if parameter not found
- Compatible with UglifyJS minification

#### `servlets[ServletName].getUrl()`

Maps a front-end servlet to its admin URL.

**Example**:
```javascript
luminateEdit.tabUrl = "https://example.com/site/PageServer?pagename=home";
var servlet = luminateEdit.getCurrentServlet(); // "PageServer"
var adminUrl = luminateEdit.servlets[servlet].getUrl();
// Returns: "PageBuilderAdmin?filter_text=home&..."
```

---

## Supported Servlets

The extension currently supports 50+ servlets across all Luminate Online modules:

### Content Management
- PageServer, SPageServer, PageNavigator, SPageNavigator
- News, News2
- DocServer

### Fundraising
- TR, STR (TeamRaiser)
- TRC, TRSC (Participant Center)
- TRR (Registration)
- Donation, Donation2
- GetTogether, GetTogetherSec

### Advocacy
- Advocacy
- LteUser
- VoteCenter

### Commerce
- Ecommerce, EcommerceCheckout
- Ticketing
- Rewards

### And many more...

See [ARCHITECTURE.md](../ARCHITECTURE.md) for the complete list.

---

## Adding New Servlet Support

To add support for a new Luminate Online page type:

1. **Identify the servlet** from the URL
2. **Determine the admin URL** pattern
3. **Add a servlet object** to `luminateEdit.js`

### Example

```javascript
servlets: {
  // ... existing servlets

  YourNewServlet: {
    /**
     * Gets admin URL for YourNewServlet
     * @returns {string|null} Admin URL or null
     */
    getUrl: function() {
      var adminUrl = 'YourAdminServlet';
      var currentId = luminateEdit.getQueryParam('id');

      if (currentId != null) {
        adminUrl += '?action=edit&id=${id}';
        adminUrl = adminUrl.replace('${id}', currentId);
      }

      return adminUrl;
    }
  }
}
```

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed instructions.

---

## Icons

The shared icons are used across all browser implementations:

- **logo16.png**: 16×16 - Toolbar icon (small)
- **logo48.png**: 48×48 - Extension management page
- **logo128.png**: 128×128 - Chrome Web Store, high-DPI displays

All icons feature a pencil design, symbolizing "edit" functionality.

---

## Modernization Notes

### ES6 Module Conversion

The current code uses a global `luminateEdit` object. Future modernization will:

- Convert to ES6 modules
- Add proper exports/imports
- Enable tree-shaking
- Support modern build tools

**Current**:
```javascript
var luminateEdit = { ... };
```

**Future**:
```javascript
export class LuminateEdit { ... }
export { servlets } from './servlets';
```

### Type Safety

Consider adding JSDoc comments or converting to TypeScript:

```javascript
/**
 * @typedef {Object} ServletHandler
 * @property {function(): string|null} getUrl
 */

/**
 * @type {Object.<string, ServletHandler>}
 */
servlets: { ... }
```

---

## Testing

Unit tests should cover:

- Servlet detection logic
- Query parameter parsing
- URL generation for each servlet
- Edge cases (missing parameters, malformed URLs)

**Example test**:
```javascript
describe('luminateEdit.servlets.PageServer', () => {
  it('should generate correct admin URL', () => {
    luminateEdit.tabUrl = 'https://example.com/site/PageServer?pagename=test';
    const url = luminateEdit.servlets.PageServer.getUrl();
    expect(url).toContain('PageBuilderAdmin');
    expect(url).toContain('test');
  });
});
```

---

## Documentation

- **Main README**: [Project overview](../README.md)
- **Architecture**: [Technical documentation](../ARCHITECTURE.md)
- **Contributing**: [How to contribute](../CONTRIBUTING.md)

---

## License

MIT License - see [LICENSE](../LICENSE) for details.

**Original Work**: Copyright (c) 2012-2017 Noah Cooper
**Current Maintainer**: Copyright (c) 2026-present Yeeboo Digital
