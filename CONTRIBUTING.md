# Contributing to Luminate Online Page Editor

Thank you for your interest in contributing to the Luminate Online Page Editor! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Adding New Servlet Support](#adding-new-servlet-support)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Our Standards

**Positive behaviors include:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behaviors include:**
- Harassment, trolling, or discriminatory comments
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of unacceptable behavior may be reported to the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

---

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher
- **Git**
- A Luminate Online test instance (for testing)
- Basic knowledge of JavaScript and browser extension APIs

### Initial Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/luminateEdit.git
   cd luminateEdit
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/yeeboo-digital/luminateEdit.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Development Workflow

### 1. Keep Your Fork Updated

Before starting new work, sync with upstream:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/descriptive-name
# or
git checkout -b fix/bug-description
# or
git checkout -b docs/documentation-improvement
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 3. Make Your Changes

- Write clear, commented code
- Follow existing code style
- Add tests for new functionality
- Update documentation as needed

### 4. Test Thoroughly

```bash
# Run linting
npm run lint

# Run tests
npm run test

# Build and manually test in browser
npm run build
```

**Manual testing checklist:**
- Load extension in developer mode
- Test on multiple Luminate Online page types
- Verify pencil icon appears correctly
- Verify correct admin URLs open
- Test in all supported browsers

### 5. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "Add support for NewServlet pages

- Implement servlet detection logic
- Add URL mapping to admin interface
- Add tests for NewServlet
- Update documentation"
```

**Commit message format:**
```
<type>: <short summary>

<detailed description>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Open a Pull Request

- Go to your fork on GitHub
- Click "Pull Request"
- Select your feature branch
- Fill out the PR template
- Submit for review

---

## Coding Standards

### JavaScript Style Guide

We follow modern JavaScript best practices:

```javascript
// Use const/let, not var
const adminUrl = 'SomeAdmin';
let currentId = null;

// Use template literals for strings
const url = `${baseUrl}?id=${id}`;

// Use arrow functions where appropriate
const buildUrl = (id) => `Admin?id=${id}`;

// Add JSDoc comments for functions
/**
 * Gets the admin URL for the current page
 * @returns {string|null} Admin URL or null if not found
 */
getUrl: function() {
  // ...
}

// Use meaningful variable names
const currentPageId = luminateEdit.getQueryParam('page_id');
const adminServletUrl = 'PageBuilderAdmin';

// Keep functions small and focused
// One function should do one thing well
```

### Code Organization

- **One concern per file** when possible
- **Group related functions** together
- **Extract magic numbers** to named constants
- **Avoid deep nesting** (max 3 levels)

### Comments

```javascript
// Good: Explain WHY, not WHAT
// Image Library requires redirect through API for security
adminUrl = 'CRTeamraiserAPI?method=&redirect=' + encodeURIComponent(path);

// Avoid: Obvious comments
// Set the admin URL
adminUrl = 'Admin';
```

### Naming Conventions

- **Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Functions**: `camelCase`
- **Classes**: `PascalCase` (if added)
- **Files**: `kebab-case.js`

---

## Testing Guidelines

### Unit Tests

Write unit tests for all new functions:

```javascript
describe('luminateEdit.servlets.PageServer', () => {
  it('should generate correct admin URL for PageServer', () => {
    luminateEdit.tabUrl = 'https://example.com/site/PageServer?pagename=test';
    const url = luminateEdit.servlets.PageServer.getUrl();
    expect(url).toContain('PageBuilderAdmin');
    expect(url).toContain('test');
  });
});
```

### Integration Tests

Test servlet detection and URL mapping end-to-end:

```javascript
it('should detect servlet from URL and show pencil icon', async () => {
  await browser.url('https://example.com/site/PageServer?pagename=home');
  const icon = await browser.$('.page-action-icon');
  expect(await icon.isDisplayed()).toBe(true);
});
```

### Manual Testing

For each change, test:
1. Chrome/Chromium
2. Firefox
3. Opera (if applicable)
4. Multiple Luminate Online page types
5. Edge cases (missing parameters, invalid URLs, etc.)

---

## Pull Request Process

### Before Submitting

- ✅ Code follows style guidelines
- ✅ All tests pass (`npm test`)
- ✅ Linting passes (`npm run lint`)
- ✅ Documentation updated
- ✅ CHANGELOG.md updated (for significant changes)
- ✅ Manually tested in at least one browser
- ✅ Commit messages are clear and descriptive

### PR Template

When opening a PR, include:

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (describe)

## Testing
Describe how you tested this change

## Luminate Online Pages Tested
- [ ] PageBuilder
- [ ] TeamRaiser
- [ ] Donation forms
- [ ] Other: ___________

## Browsers Tested
- [ ] Chrome
- [ ] Firefox
- [ ] Opera
- [ ] Safari

## Screenshots (if applicable)

## Additional Notes
Any other context about the PR
```

### Review Process

1. **Automated checks** run (linting, tests)
2. **Maintainer review** (1-2 business days)
3. **Discussion and feedback**
4. **Updates if needed**
5. **Approval and merge**

### After Merge

- Your branch will be deleted
- Update your fork:
  ```bash
  git checkout main
  git pull upstream main
  git push origin main
  ```

---

## Adding New Servlet Support

### Step-by-Step Guide

**1. Identify the servlet**

Navigate to a Luminate Online page and find:
- Front-end servlet name (in URL after `/site/`)
- Query parameters used
- The admin interface URL you want to open

**Example:**
- Front-end: `https://example.com/site/Survey?SURVEY_ID=1001&page=questions`
- Admin: `https://example.com/admin/SurveyAdmin?action=edit_survey&survey_id=1001`

**2. Add servlet object to `shared/src/luminateEdit.js`**

```javascript
servlets: {
  Survey: {
    /**
     * Gets admin URL for Survey servlet
     * @returns {string|null} Admin URL or null if cannot be determined
     */
    getUrl: function() {
      var adminUrl = 'SurveyAdmin';

      var currentSurveyId = luminateEdit.getQueryParam('SURVEY_ID');

      if(currentSurveyId != null) {
        adminUrl += '?action=edit_survey&survey_id=${surveyId}';
      }
      else {
        adminUrl += '?survey=survey_list';
      }

      adminUrl = adminUrl.replace('${surveyId}', currentSurveyId);

      return adminUrl;
    }
  }
}
```

**3. Write tests**

```javascript
describe('luminateEdit.servlets.Survey', () => {
  it('should handle survey with ID', () => {
    luminateEdit.tabUrl = 'https://example.com/site/Survey?SURVEY_ID=1001';
    const url = luminateEdit.servlets.Survey.getUrl();
    expect(url).toBe('SurveyAdmin?action=edit_survey&survey_id=1001');
  });

  it('should handle survey list', () => {
    luminateEdit.tabUrl = 'https://example.com/site/Survey';
    const url = luminateEdit.servlets.Survey.getUrl();
    expect(url).toBe('SurveyAdmin?survey=survey_list');
  });
});
```

**4. Test manually**

- Build the extension
- Load in browser
- Navigate to Survey page
- Verify pencil icon appears
- Click and verify correct admin page opens

**5. Document**

Add to README.md supported page types list:
```markdown
- **Surveys** - Edit survey questions and settings
```

**6. Submit PR**

Include in PR description:
- Which servlet you added
- Front-end URL pattern
- Admin URL pattern
- Screenshot of working extension

---

## Reporting Bugs

### Before Reporting

1. **Search existing issues** - Your bug may already be reported
2. **Update to latest version** - Bug may already be fixed
3. **Test in multiple browsers** - Helps identify browser-specific issues

### Bug Report Template

```markdown
**Describe the bug**
Clear description of what the bug is

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Actual behavior**
What actually happened

**Screenshots**
If applicable, add screenshots

**Environment:**
- Browser: [e.g., Chrome 120]
- Extension version: [e.g., 1.12]
- Luminate Online version: [if known]
- Operating System: [e.g., macOS 14]

**Front-end URL:**
The Luminate Online page URL where the issue occurs

**Expected admin URL:**
The admin URL it should open (if you know it)

**Additional context**
Any other relevant information
```

---

## Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Screenshots, mockups, or examples

**Impact**
Who would benefit from this feature?
```

### Discussion First

For major features, open a **GitHub Discussion** first to:
- Get feedback from maintainers
- Avoid duplicate work
- Ensure alignment with project goals

---

## Questions?

- **GitHub Discussions**: For general questions and ideas
- **GitHub Issues**: For bugs and specific feature requests
- **Email**: [contact email] for sensitive issues

---

## Recognition

Contributors will be:
- Added to [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- Mentioned in release notes
- Recognized in the community

Thank you for contributing to the Luminate Online Page Editor! 🎉
