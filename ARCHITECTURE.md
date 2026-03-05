# Architecture Documentation

This document provides a technical overview of how the Luminate Online Page Editor extension works.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Servlet Detection Logic](#servlet-detection-logic)
- [URL Mapping Strategy](#url-mapping-strategy)
- [Browser-Specific Implementations](#browser-specific-implementations)
- [Extension Lifecycle](#extension-lifecycle)
- [Technical Decisions](#technical-decisions)

---

## Overview

The Luminate Online Page Editor is a browser extension that provides one-click access to administrative interfaces for Luminate Online pages. It works by:

1. **Monitoring** page URLs as users browse
2. **Detecting** Luminate Online servlets in the URL
3. **Parsing** query parameters to identify specific content
4. **Mapping** to corresponding admin URLs
5. **Displaying** a clickable pencil icon when a match is found

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 Active Tab                             │  │
│  │  https://example.com/site/PageServer?pagename=home    │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↓ Tab URL change event           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Service Worker (background.js)               │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────┐    │  │
│  │  │   luminateEdit Core (luminateEdit.js)       │    │  │
│  │  │                                              │    │  │
│  │  │  1. getCurrentServlet()                     │    │  │
│  │  │     ↓ Extracts "PageServer" from URL        │    │  │
│  │  │                                              │    │  │
│  │  │  2. servlets.PageServer.getUrl()            │    │  │
│  │  │     ↓ Returns admin URL                     │    │  │
│  │  │                                              │    │  │
│  │  │  3. Browser API: show action icon            │    │  │
│  │  └──────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↓ User clicks icon               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              New Tab Opens                            │  │
│  │  https://example.com/admin/PageBuilderAdmin?...      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. `shared/src/luminateEdit.js`

**Purpose**: Core business logic shared across all browsers

**Namespace**: `luminateEdit` (global object)

**Key Properties**:
- `tabUrl`: Stores the current active tab URL
- `servlets`: Object containing all servlet handlers
- `common`: Shared utility methods

**Key Methods**:

```javascript
luminateEdit = {
  tabUrl: null,  // Current page URL

  // Extracts servlet name from URL
  getCurrentServlet: function() { ... },

  // Gets query parameter value
  getQueryParam: function(paramName) { ... },

  // Servlet handlers
  servlets: {
    PageServer: { getUrl: function() { ... } },
    TeamRaiser: { getUrl: function() { ... } },
    // ... 50+ more servlets
  }
}
```

### 2. Browser-Specific Background Scripts

Each browser has its own wrapper that:
- Initializes the extension
- Listens for tab URL changes
- Calls `luminateEdit` core logic
- Shows/hides page action icon
- Handles icon clicks

**Example**: `chrome/src/background.js`

```javascript
// Listen for tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url) {
    luminateEdit.tabUrl = changeInfo.url;
    var servlet = luminateEdit.getCurrentServlet();

    if (servlet && luminateEdit.servlets[servlet]) {
      chrome.action.setIcon({tabId: tabId, path: "logo128.png"});
    }
  }
});

// Handle icon click
chrome.action.onClicked.addListener(function(tab) {
  var servlet = luminateEdit.getCurrentServlet();
  var adminUrl = luminateEdit.servlets[servlet].getUrl();
  chrome.tabs.create({ url: adminUrl });
});
```

### 3. Manifest Files

Define extension metadata, permissions, and entry points.

**Current**: Manifest V3
```json
{
  "manifest_version": 3,
  "name": "Luminate Online Page Editor",
  "version": "1.12",
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_icon": "logo128.png",
    "default_title": "Edit this page"
  },
  "permissions": ["tabs", "declarativeContent"]
}
```

Note: Firefox uses `"background": { "scripts": ["background.js"] }` instead of `service_worker`, and `activeTab` instead of `declarativeContent`.

---

## Data Flow

### Step-by-Step Execution

**1. User navigates to Luminate Online page**
```
URL: https://secure2.convio.net/example/site/PageServer?pagename=home
```

**2. Browser fires tab update event**
```javascript
chrome.tabs.onUpdated → tabId, changeInfo, tab
```

**3. Extension captures URL**
```javascript
luminateEdit.tabUrl = "https://secure2.convio.net/example/site/PageServer?pagename=home"
```

**4. Extract servlet name**
```javascript
getCurrentServlet() returns "PageServer"
```

**Logic**:
```javascript
getCurrentServlet: function() {
  // Check if URL contains /site/
  if (luminateEdit.tabUrl.indexOf('/site/') == -1) {
    return null;
  }

  // Extract servlet: /site/{SERVLET}/...
  return luminateEdit.tabUrl
    .split('/site/')[1]  // "PageServer?pagename=home"
    .split('/')[0]        // "PageServer?pagename=home"
    .split('?')[0]        // "PageServer"
    .split(';')[0];       // "PageServer"
}
```

**5. Check if servlet is supported**
```javascript
if (luminateEdit.servlets["PageServer"]) {
  // Servlet is supported
}
```

**6. Show action icon**
```javascript
chrome.action.setIcon({tabId: tabId, path: "logo128.png"});
```

**7. User clicks pencil icon**

**8. Generate admin URL**
```javascript
var adminUrl = luminateEdit.servlets.PageServer.getUrl();
```

**Logic**:
```javascript
PageServer: {
  getUrl: function() {
    var adminUrl = 'PageBuilderAdmin';
    var currentPageName = luminateEdit.getQueryParam('pagename');

    if (currentPageName != null) {
      adminUrl += '?filter_text=${pageName}&filter_search=Search' +
                  '&pagebuilder=page_list&lcmd=filtering';
    }

    return adminUrl.replace('${pageName}', currentPageName);
  }
}
```

**Returns**:
```
"PageBuilderAdmin?filter_text=home&filter_search=Search&pagebuilder=page_list&lcmd=filtering"
```

**9. Open in new tab**
```javascript
chrome.tabs.create({
  url: "https://secure2.convio.net/example/admin/PageBuilderAdmin?..."
});
```

**Result**: Admin page opens with the correct page pre-selected

---

## Servlet Detection Logic

### URL Pattern Recognition

Luminate Online uses consistent URL patterns:

**Front-end pages**:
```
https://{domain}/site/{SERVLET}?{params}
```

**Admin pages**:
```
https://{domain}/admin/{AdminServlet}?{params}
```

### Detection Algorithm

```javascript
getCurrentServlet: function() {
  // 1. Check for /site/ or special patterns
  if (luminateEdit.tabUrl == null ||
      luminateEdit.tabUrl.indexOf('/site/') == -1) {

    // Special case: Image Library
    if (luminateEdit.tabUrl.indexOf('/images/content/pagebuilder/') != -1) {
      return 'ImageLibraryPseudoServlet';
    }

    return null;
  }

  // 2. Extract servlet name from URL path
  var urlParts = luminateEdit.tabUrl.split('/site/')[1];
  var servlet = urlParts.split('/')[0]    // Split on path
                        .split('?')[0]    // Split on query string
                        .split(';')[0];   // Split on session ID

  return servlet;
}
```

### Supported Patterns

| Pattern | Example | Servlet Extracted |
|---------|---------|-------------------|
| Standard | `/site/PageServer?...` | `PageServer` |
| With path | `/site/TR/Events/123` | `TR` |
| With session | `/site/Survey;jsessionid=ABC?...` | `Survey` |
| Image Library | `/images/content/pagebuilder/img.jpg` | `ImageLibraryPseudoServlet` |

---

## URL Mapping Strategy

### Servlet Object Structure

Each servlet has a `getUrl()` method that:
1. Declares the admin servlet name
2. Extracts relevant query parameters
3. Builds the admin URL with appropriate parameters
4. Returns the complete admin URL

### Example: Survey Servlet

```javascript
Survey: {
  getUrl: function() {
    // 1. Define admin servlet
    var adminUrl = 'SurveyAdmin';

    // 2. Extract parameters from front-end URL
    var currentSurveyId = luminateEdit.getQueryParam('SURVEY_ID');

    // 3. Build admin URL based on context
    if (currentSurveyId != null) {
      // Specific survey → edit page
      adminUrl += '?action=edit_survey&survey=survey_page_edit&survey_id=${surveyId}';
    } else {
      // No survey ID → list page
      adminUrl += '?survey=survey_list';
    }

    // 4. Replace placeholders
    adminUrl = adminUrl.replace('${surveyId}', currentSurveyId);

    // 5. Return complete URL
    return adminUrl;
  }
}
```

### Complex Example: TeamRaiser

TeamRaiser has many page types (registration, participant center, personal pages, etc.). The servlet uses URL parameter patterns to determine the correct admin interface:

```javascript
TR: {
  getUrl: function() {
    var adminUrl = 'TREdit';
    var currentPg = luminateEdit.getQueryParam('pg');
    var currentFrId = luminateEdit.getQueryParam('fr_id');

    switch(currentPg) {
      case 'entry':
        // Greeting page
        adminUrl += '?page_type=fr_info&tr=edit_event_page&fr_id=${frId}';
        break;

      case 'personal':
        // Personal fundraising page
        adminUrl = 'FriendraiserAdmin?pg=editor&type=fr_personal' +
                   '&fr_id=${frId}&frppid=' +
                   luminateEdit.getQueryParam('px');
        break;

      case 'team':
        // Team page
        adminUrl = 'FriendraiserAdmin?pg=editor&type=fr_team_page' +
                   '&fr_id=${frId}&team_id=' +
                   luminateEdit.getQueryParam('team_id');
        break;

      // ... many more cases
    }

    return adminUrl.replace('${frId}', currentFrId);
  }
}
```

### Parameter Extraction

```javascript
getQueryParam: function(paramName) {
  if (luminateEdit.tabUrl == null ||
      luminateEdit.tabUrl.indexOf('?') == -1) {
    return null;
  }

  // Handle &amp; in URLs (from HTML entity encoding)
  var queryStrings = '&' + luminateEdit.tabUrl
    .split('?')[1]
    .replace(new RegExp('&' + 'amp;', 'g'), '&');

  if (queryStrings.indexOf('&' + paramName + '=') == -1) {
    return null;
  }

  return queryStrings
    .split('&' + paramName + '=')[1]
    .split('&')[0];
}
```

---

## Browser-Specific Implementations

### Chrome / Chromium / Edge

**API**: Chrome Extensions API (Manifest V3)
**Background**: Service worker
**Icon**: Action API

```javascript
chrome.tabs.onUpdated.addListener(callback);
chrome.action.onClicked.addListener(callback);
```

### Firefox

**API**: WebExtensions API (Manifest V3)
**Background**: Background scripts
**Icon**: Action API

```javascript
browser.tabs.onUpdated.addListener(callback);
browser.action.onClicked.addListener(callback);
```

**Differences from Chrome**:
- Uses `browser.*` namespace (also supports `chrome.*`)
- Returns Promises instead of callbacks (can use both)
- Uses `"background": { "scripts": [...] }` instead of `service_worker`

### Opera

**API**: Chrome Extensions API (Manifest V3, Opera uses Chromium)
**Implementation**: Identical to Chrome

---

## Extension Lifecycle

### Installation

1. Browser loads manifest file
2. Validates permissions and configuration
3. Registers background script
4. Extension becomes active

### Runtime

```
┌─────────────────────────────────────────────┐
│           Browser Extension                 │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │  Service Worker (background.js)      │    │
│  │  - Monitors all tabs                │    │
│  │  - Maintains luminateEdit state     │    │
│  │  - Shows/hides icon                 │    │
│  └────────────────────────────────────┘    │
│                   ↕                          │
│  ┌────────────────────────────────────┐    │
│  │      Browser APIs                   │    │
│  │  - chrome.tabs                      │    │
│  │  - chrome.action                    │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### Per-Tab Lifecycle

For each tab:

1. **Tab created/URL changed** → `onUpdated` event fires
2. **Extension checks URL** → `luminateEdit.getCurrentServlet()`
3. **Servlet found** → `chrome.action.setIcon(tabId)`
4. **User clicks icon** → `onClicked` event fires
5. **New tab opens** → Admin URL loaded

### Update

When extension updates:
1. Browser downloads new version
2. Reloads extension
3. Background script reinitializes
4. All tabs continue working

---

## Technical Decisions

### Why Action API?

In Manifest V3, `pageAction` and `browserAction` are unified into the `action` API. The extension uses `declarativeContent` (Chrome/Opera/Edge) or `activeTab` (Firefox) to control when the icon is active.

### Why Service Worker Instead of Content Scripts?

**Service Worker** (Manifest V3):
- ✅ Runs once for all tabs (efficient)
- ✅ Can access browser APIs directly
- ✅ Doesn't inject code into pages (safer)
- ✅ Required by Manifest V3 (Chrome/Opera/Edge)

**Content Scripts**:
- ❌ Would run in every tab (inefficient)
- ❌ Limited API access
- ❌ Would need messaging to background
- ❌ Potential conflicts with page JavaScript

**Decision**: Service worker is more efficient and safer.

Note: Firefox MV3 uses background scripts instead of service workers, but the behavior is equivalent.

### Why Global Object Instead of Modules?

**Current** (Global `luminateEdit`):
- ✅ Simple, no build process needed
- ✅ Works in all browsers
- ✅ Easy to extend

**Modern** (ES6 Modules):
- Better encapsulation
- Tree-shaking
- Modern tooling

**Future**: Migrate to ES6 modules as part of MV3 migration.

### Why Servlet Detection Instead of Content Analysis?

**Servlet Detection** (URL parsing):
- ✅ Fast (no DOM parsing)
- ✅ Works before page loads
- ✅ Reliable (URLs are stable)
- ✅ No page interaction needed

**Content Analysis** (page scraping):
- ❌ Slow (wait for DOM)
- ❌ Brittle (HTML changes break it)
- ❌ Requires content script injection

**Decision**: URL parsing is faster and more reliable.

---

## Complete Servlet List

The extension currently supports 50+ servlets. Here's the complete list:

### Content Management
- `PageServer`, `SPageServer` - PageBuilder pages
- `PageNavigator`, `SPageNavigator` - PageBuilder navigation
- `News`, `News2` - Articles/blog posts
- `DocServer` - Documents

### Fundraising
- `TR`, `STR` - TeamRaiser events
- `TRC`, `TRSC` - TeamRaiser participant center
- `TRR` - TeamRaiser registration
- `Donation`, `Donation2` - Donation forms
- `GetTogether`, `GetTogetherSec` - Personal events

### Engagement
- `Advocacy` - Action alerts
- `LteUser` - Letter to editor alerts
- `VoteCenter` - Legislative scorecards
- `Survey`, `SSurvey` - Surveys

### Commerce
- `Ecommerce`, `EcommerceCheckout` - Online stores
- `Ticketing` - Event ticketing
- `Rewards` - Rewards programs

### Communication
- `Ecard` - E-cards
- `TellAFriend` - Tell-a-friend pages
- `PhotoAlbumUser` - Photo albums

### Administrative
- `CRTeamraiserAPI`, `SRTeamraiserAPI` - API configuration
- `CRDonationAPI`, `SRDonationAPI` - Donation API
- `CRConsAPI`, `SRConsAPI` - Constituent API
- *(20+ more API endpoints)*
- `ImageLibraryPseudoServlet` - Image library
- `AjaxProxy` - AJAX proxy settings
- `GigyaLogin` - Social login config

### User Management
- `ConsProfileUser` - Profile pages
- `ConsInterestsUser` - Interest preferences
- `ServiceCenter`, `UserCenter` - Service center
- `Dir` - Directory
- `Clubs` - Clubs/groups

### Transactions
- `ReceiptRequest`, `ReceiptViewer` - Receipt management
- `Calendar` - Event calendar
- `DynImg` - Progress meters (dynamic images)

---

## Future Architecture Improvements

### Build System

Add modern tooling:
- **Bundler**: Webpack or Rollup
- **Transpiler**: Babel for broader compatibility
- **Minification**: Terser for production
- **Testing**: Jest or Mocha

### Testing Infrastructure

- Unit tests for servlet logic
- Integration tests for URL mapping
- E2E tests with Puppeteer/Playwright
- Visual regression tests

### Type Safety

Consider TypeScript for:
- Better developer experience
- Catch errors at compile time
- Self-documenting code

---

## Contributing to Architecture

When proposing architectural changes:

1. **Document the problem** clearly
2. **Consider alternatives** and trade-offs
3. **Assess impact** on existing code
4. **Provide migration path** if breaking
5. **Discuss in GitHub Issues** before implementing

---

## References

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Firefox WebExtensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Luminate Online API Documentation](https://open.convio.com/api/)

---

**Questions about the architecture?** Open a [GitHub Discussion](https://github.com/yeeboo-digital/luminateEdit/discussions).
