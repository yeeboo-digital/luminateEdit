# Browser Extension Refactoring Plan

**Project:** Luminate Online Page Editor
**Current State:** Manifest V2, ES5, Multi-browser with duplication
**Target State:** Manifest V3, Modern TypeScript, Unified codebase
**Estimated Scope:** Major refactoring

---

## Executive Summary

This extension is **currently non-functional** in modern Chrome (Manifest V2 support ended June 2024) and modern Safari. It requires migration to Manifest V3 and modernization of the entire codebase to remain viable.

### Critical Issues
1. **BLOCKING:** Manifest V2 deprecated - extension won't load in Chrome 127+
2. **BLOCKING:** Safari extension format deprecated - doesn't work in Safari 13+
3. **TECH DEBT:** 8-year-old ES5 codebase with no modern tooling

---

## Phase 1: Foundation & Tooling (Modern Development Environment)

### 1.1 Initialize Modern Project Structure

**Goal:** Set up TypeScript, build tooling, and testing framework

**Tasks:**
- [ ] Initialize npm project with `package.json`
- [ ] Add TypeScript configuration (`tsconfig.json`)
- [ ] Set up Vite or Webpack for bundling
- [ ] Configure ESLint + Prettier
- [ ] Add testing framework (Vitest/Jest)
- [ ] Create `.gitignore` for node_modules, dist, etc.

**New Project Structure:**
```
luminateEdit/
├── src/
│   ├── background/
│   │   └── service-worker.ts      # MV3 service worker
│   ├── core/
│   │   ├── servlet-mappings.ts    # Migrated from shared/src
│   │   └── url-parser.ts
│   ├── types/
│   │   └── index.d.ts
│   └── manifest.json              # MV3 manifest template
├── dist/                          # Build output
│   ├── chrome/
│   ├── firefox/
│   └── edge/
├── tests/
│   └── servlet-mappings.test.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

**Dependencies:**
```json
{
  "devDependencies": {
    "@types/chrome": "^0.0.268",
    "@types/webextension-polyfill": "^0.10.7",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vite-plugin-web-extension": "^4.0.0",
    "vitest": "^1.0.0",
    "eslint": "^8.56.0",
    "prettier": "^3.1.0"
  },
  "dependencies": {
    "webextension-polyfill": "^0.10.0"
  }
}
```

**Files to Create:**
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `.eslintrc.js`
- `.prettierrc`
- `.gitignore`

---

## Phase 2: Manifest V3 Migration

### 2.1 Create MV3 Manifest

**Critical Changes:**
- Manifest version: 2 → 3
- Background page → Service worker
- `chrome.pageAction` → `chrome.action`
- Host permissions model updated
- Content Security Policy (CSP) format changed

**New Manifest (`manifest.json`):**
```json
{
  "manifest_version": 3,
  "name": "Luminate Edit",
  "version": "2.0.0",
  "description": "Open the Luminate Online admin page for any constituent-facing page.",

  "action": {
    "default_icon": {
      "16": "icons/logo16.png",
      "48": "icons/logo48.png",
      "128": "icons/logo128.png"
    }
  },

  "background": {
    "service_worker": "background.js",
    "type": "module"
  },

  "permissions": ["tabs", "activeTab"],

  "icons": {
    "16": "icons/logo16.png",
    "48": "icons/logo48.png",
    "128": "icons/logo128.png"
  }
}
```

### 2.2 Convert Background Script to Service Worker

**Key Differences:**
- No DOM access in service workers
- No `window` object
- Must be ephemeral (can't maintain long-lived state)
- Event-driven architecture

**Migration Steps:**
- [ ] Replace `chrome.tabs.onUpdated` with `chrome.tabs.onUpdated` (still works but change approach)
- [ ] Replace `chrome.pageAction` → `chrome.action`
- [ ] Use `chrome.declarativeContent` for conditional icon display
- [ ] Ensure no persistent background page patterns

**Old Pattern (MV2):**
```javascript
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (luminateEdit.getCurrentServlet(tab.url)) {
    chrome.pageAction.show(tabId);
  }
});

chrome.pageAction.onClicked.addListener(function(tab) {
  var servlet = luminateEdit.getCurrentServlet(tab.url);
  // ...
});
```

**New Pattern (MV3):**
```typescript
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const servlet = getCurrentServlet(tab.url);
    chrome.action.setIcon({
      tabId,
      path: servlet ? 'icons/logo48.png' : 'icons/logo48-disabled.png'
    });
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url) return;
  const adminUrl = getAdminUrl(tab.url);
  if (adminUrl) {
    await chrome.tabs.create({ url: adminUrl });
  }
});
```

---

## Phase 3: TypeScript Migration

### 3.1 Migrate Core Servlet Logic

**File:** `src/core/servlet-mappings.ts`

**Goals:**
- Convert ES5 → Modern TypeScript
- Add type definitions for servlets
- Improve URL parsing with native `URL` API
- Add error handling

**Type Definitions:**
```typescript
interface ServletMapping {
  name: string;
  getUrl: (url: URL) => string | null;
  test?: (url: URL) => boolean;
}

interface ServletCollection {
  [key: string]: ServletMapping;
}
```

**Modernization Example:**

**Before (ES5):**
```javascript
var luminateEdit = {
  getCurrentServlet: function(url) {
    if (!url) { return null; }
    var urlPath = url.split('?')[0];
    var servlet = urlPath.substring(urlPath.lastIndexOf('/') + 1);
    return servlet;
  },

  getQueryParam: function(url, name) {
    if (url.indexOf('?') === -1) { return null; }
    var params = url.split('?')[1].split('&');
    // ... more manual parsing
  }
};
```

**After (TypeScript):**
```typescript
export class LuminateEditCore {
  private static parseUrl(urlString: string): URL | null {
    try {
      return new URL(urlString);
    } catch {
      return null;
    }
  }

  static getCurrentServlet(urlString: string): string | null {
    const url = this.parseUrl(urlString);
    if (!url) return null;

    const pathParts = url.pathname.split('/');
    return pathParts[pathParts.length - 1] || null;
  }

  static getQueryParam(urlString: string, name: string): string | null {
    const url = this.parseUrl(urlString);
    return url?.searchParams.get(name) ?? null;
  }

  static getAdminUrl(urlString: string): string | null {
    const url = this.parseUrl(urlString);
    if (!url) return null;

    const servlet = this.getCurrentServlet(urlString);
    const mapping = servletMappings[servlet];

    return mapping?.getUrl(url) ?? null;
  }
}
```

### 3.2 Modernize Servlet Mappings

**Goals:**
- Use template literals instead of string replacement
- Use arrow functions
- Add null safety
- Extract common patterns

**Before:**
```javascript
var servlets = {
  'Donation2': {
    getUrl: function(url) {
      var id = luminateEdit.getQueryParam(url, 'df_id');
      return '${admin}/admin/editDonationForm?type=step1&df_id=${id}'
        .replace('${admin}', luminateEdit.getAdminPath(url))
        .replace('${id}', id);
    }
  }
};
```

**After:**
```typescript
const servletMappings: ServletCollection = {
  Donation2: {
    name: 'Donation Form',
    getUrl: (url: URL): string | null => {
      const id = url.searchParams.get('df_id');
      if (!id) return null;

      const adminPath = getAdminPath(url);
      return `${adminPath}/admin/editDonationForm?type=step1&df_id=${id}`;
    }
  }
};
```

### 3.3 Add URL Builder Utilities

**File:** `src/core/url-parser.ts`

```typescript
export function getAdminPath(url: URL): string {
  const protocol = url.protocol;
  const hostname = url.hostname;
  const port = url.port ? `:${url.port}` : '';

  return `${protocol}//${hostname}${port}`;
}

export function buildAdminUrl(
  baseUrl: URL,
  path: string,
  params: Record<string, string>
): string {
  const adminPath = getAdminPath(baseUrl);
  const searchParams = new URLSearchParams(params);

  return `${adminPath}${path}?${searchParams.toString()}`;
}
```

---

## Phase 4: Testing & Quality

### 4.1 Add Unit Tests

**File:** `tests/servlet-mappings.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { LuminateEditCore } from '../src/core/servlet-mappings';

describe('LuminateEditCore', () => {
  describe('getCurrentServlet', () => {
    it('should extract servlet from URL', () => {
      const url = 'https://example.org/site/Donation2?df_id=123';
      expect(LuminateEditCore.getCurrentServlet(url)).toBe('Donation2');
    });

    it('should return null for invalid URLs', () => {
      expect(LuminateEditCore.getCurrentServlet('')).toBeNull();
    });
  });

  describe('getAdminUrl', () => {
    it('should generate admin URL for Donation2', () => {
      const url = 'https://example.org/site/Donation2?df_id=123';
      const adminUrl = LuminateEditCore.getAdminUrl(url);

      expect(adminUrl).toBe(
        'https://example.org/admin/editDonationForm?type=step1&df_id=123'
      );
    });

    it('should return null for unknown servlets', () => {
      const url = 'https://example.org/site/UnknownServlet';
      expect(LuminateEditCore.getAdminUrl(url)).toBeNull();
    });
  });
});
```

**Test Coverage Goals:**
- [ ] All 60+ servlet mappings tested
- [ ] Edge cases (missing params, invalid URLs)
- [ ] URL parsing utilities
- [ ] Error handling paths

### 4.2 Add E2E Tests (Optional)

Using Playwright or Puppeteer to test actual extension behavior:
- Load extension in browser
- Navigate to test Luminate page
- Verify icon appears/disappears
- Click icon and verify correct admin URL opens

---

## Phase 5: Build System & Cross-Browser Support

### 5.1 Configure Vite Build

**File:** `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import webExtension from 'vite-plugin-web-extension';

export default defineConfig({
  plugins: [
    webExtension({
      manifest: './src/manifest.json',
      browser: process.env.TARGET_BROWSER || 'chrome',
      webExtConfig: {
        startUrl: ['https://example.org/site/Donation2?df_id=1'],
      },
    }),
  ],
  build: {
    outDir: `dist/${process.env.TARGET_BROWSER || 'chrome'}`,
    emptyOutDir: true,
  },
});
```

### 5.2 Cross-Browser Build Scripts

**File:** `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:chrome": "TARGET_BROWSER=chrome vite",
    "dev:firefox": "TARGET_BROWSER=firefox vite",

    "build": "npm run build:chrome && npm run build:firefox && npm run build:edge",
    "build:chrome": "TARGET_BROWSER=chrome vite build",
    "build:firefox": "TARGET_BROWSER=firefox vite build",
    "build:edge": "TARGET_BROWSER=edge vite build",

    "test": "vitest run",
    "test:watch": "vitest",

    "lint": "eslint src --ext .ts",
    "format": "prettier --write 'src/**/*.ts'",

    "package": "npm run build && npm run package:chrome && npm run package:firefox",
    "package:chrome": "cd dist/chrome && zip -r ../../luminate-edit-chrome.zip .",
    "package:firefox": "cd dist/firefox && zip -r ../../luminate-edit-firefox.zip ."
  }
}
```

### 5.3 Use WebExtension Polyfill

For Firefox compatibility, use `webextension-polyfill`:

```typescript
import browser from 'webextension-polyfill';

// Works in both Chrome and Firefox
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // ...
});

browser.action.onClicked.addListener(async (tab) => {
  // ...
});
```

---

## Phase 6: Safari Extension (Optional/Deferred)

### Current State
Safari extensions now require:
- Safari App Extension (native macOS app)
- Xcode project
- Different architecture (native Swift/Obj-C + web content)

### Recommendation
**DEFER** Safari support until MV3 version is stable. Safari App Extensions require:
- macOS development environment
- Apple Developer account ($99/year)
- Completely different codebase
- Native app wrapper

**Alternative:** Document that Safari is not supported in v2.0, revisit in future release.

---

## Phase 7: Documentation & Deployment

### 7.1 Update Documentation

**Files to Create/Update:**
- [ ] `README.md` - Installation, development, building
- [ ] `CONTRIBUTING.md` - How to contribute
- [ ] `CHANGELOG.md` - Version history
- [ ] `docs/ARCHITECTURE.md` - Technical overview
- [ ] `docs/SERVLET_MAPPINGS.md` - How servlet mappings work

### 7.2 CI/CD Pipeline

**GitHub Actions Workflow (`.github/workflows/build.yml`):**

```yaml
name: Build and Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  release:
    if: startsWith(github.ref, 'refs/tags/v')
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run package
      - uses: actions/upload-artifact@v4
        with:
          name: extension-packages
          path: |
            luminate-edit-chrome.zip
            luminate-edit-firefox.zip
```

### 7.3 Deployment Checklist

**Chrome Web Store:**
- [ ] Update store listing with new screenshots
- [ ] Update description to mention MV3
- [ ] Upload new version
- [ ] Test in production

**Firefox Add-ons:**
- [ ] Submit for review (required for MV3)
- [ ] Update listing
- [ ] Monitor review process

---

## Migration Strategy & Risks

### Approach: Big Bang vs Incremental

**Recommended: Big Bang (v2.0 Release)**

**Rationale:**
- Extension is currently broken in modern Chrome
- Small codebase (1400 LOC) - rewrite is manageable
- No active users to disrupt (extension is non-functional)
- Clean slate allows proper architecture

**Steps:**
1. Create new TypeScript codebase in parallel
2. Migrate servlet mappings methodically (with tests)
3. Test thoroughly before release
4. Release as v2.0 with breaking changes
5. Archive old code in `legacy/` directory

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Servlet mappings have bugs | High | Comprehensive unit tests for all 60+ servlets |
| MV3 behavioral differences | Medium | E2E testing in actual Chrome/Firefox |
| Build complexity | Low | Use mature tooling (Vite) with good docs |
| User disruption | Low | Extension already broken; document changes |
| Safari abandonment | Low | Small user base, can revisit later |

---

## Implementation Phases Summary

### Phase 1: Foundation (Week 1)
- Set up TypeScript, Vite, ESLint, Prettier
- Create new project structure
- Initialize tests

### Phase 2: Core Migration (Week 2)
- Migrate servlet mappings to TypeScript
- Modernize URL parsing
- Write comprehensive tests

### Phase 3: MV3 Integration (Week 3)
- Create MV3 manifest
- Implement service worker
- Handle Chrome/Firefox differences

### Phase 4: Testing & Polish (Week 4)
- E2E testing
- Cross-browser testing
- Bug fixes and refinement

### Phase 5: Release (Week 5)
- Documentation
- Package for distribution
- Submit to stores
- Monitor rollout

---

## Success Criteria

- [ ] Extension loads and functions in Chrome 127+
- [ ] Extension loads and functions in Firefox 120+
- [ ] Extension loads and functions in Edge (Chromium)
- [ ] All 60+ servlet mappings tested and working
- [ ] TypeScript with no `any` types
- [ ] 90%+ test coverage
- [ ] Build process automated
- [ ] Documentation complete
- [ ] Published to Chrome Web Store and Firefox Add-ons

---

## Open Questions

1. **User Base:** How many active users does this extension have? Should we maintain backward compatibility or clean break?
2. **Luminate Online Status:** Is Luminate Online still actively used? Have their URLs changed?
3. **Maintenance:** Who will maintain this after refactoring? Need training on TypeScript/MV3?
4. **Safari:** Should we invest in Safari App Extension, or focus on Chrome/Firefox/Edge only?
5. **Features:** Any new features needed, or pure refactoring?

---

## Conclusion

This refactoring is **essential** for the extension to function in modern browsers. The current codebase is well-designed but critically outdated. The migration to Manifest V3, TypeScript, and modern tooling will:

- Restore functionality in Chrome/Firefox/Edge
- Improve maintainability with types and tests
- Modernize development workflow
- Position the extension for future updates

**Recommended Timeline:** 4-5 weeks for full implementation and testing.

**Next Steps:**
1. Get approval for this plan
2. Begin Phase 1 (Foundation & Tooling)
3. Set up development environment
4. Start migrating servlet mappings with tests
