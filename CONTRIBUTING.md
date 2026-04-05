# Contributing to MiTube

We welcome contributions to MiTube! This document outlines the project structure, development workflow, and guidelines for contributing to this Chrome extension.

## Project Structure

The MiTube Chrome extension follows a modular architecture with clear separation of concerns:

```
MiTube/
├── src/
│   ├── manifest.json           # Extension manifest (Chrome Extension Manifest V3)
│   ├── background.js           # Background service worker
│   ├── content/
│   │   ├── content.js          # Main content script (YouTube page interaction)
│   │   └── loader.js          # Content loader (ES module loading)
│   ├── features/              # Feature modules
│   │   ├── playlist_duration.js    # Playlist duration feature
│   │   ├── playlist_end_time.js   # Playlist end time feature
│   │   ├── hide_shorts.js         # Hide shorts feature
│   │   ├── hide_members.js        # Hide members-only videos feature
│   │   └── always_show_next.js    # Always show next button feature
│   ├── popup/
│   │   ├── popup.html         # Popup UI
│   │   ├── popup.css          # Popup styling
│   │   └── popup.js           # Popup logic
│   ├── utils/                 # Utility modules
│   │   ├── constants.js       # Shared constants and selectors
│   │   ├── dom.js            # DOM utilities and badge detection
│   │   ├── storage.js        # Storage management (Chrome Storage API)
│   │   ├── time_utils.js     # Time utilities (formatting, parsing)
│   │   ├── visibility.js     # Visibility management utilities
│   │   └── display.js        # Display management utilities
│   └── icons/                 # Extension icons
├── tests/                     # Test files
└── README.md                  # Project documentation
```

### Key Architecture Components

#### Content Scripts
- **`content/loader.js`**: Entry point that loads `content.js` as an ES module
- **`content/content.js`**: Main orchestrator for YouTube page interaction

#### Feature Modules
Each feature is implemented as a separate module in the `features/` directory:
- **Playlist Features**: `playlist_duration.js`, `playlist_end_time.js`
- **Hide Features**: `hide_shorts.js`, `hide_members.js`
- **Video Player Features**: `always_show_next.js`

#### Utility Modules
- **`visibility.js`**: Generic `VisibilityManager` class for showing/hiding DOM elements
- **`display.js`**: `FeatureDisplayManager` class for displaying info elements
- **`dom.js`**: DOM utilities including badge detection
- **`constants.js`**: Centralized constants and selectors
- **`storage.js`**: Chrome Storage API wrapper
- **`time_utils.js`**: Time formatting and parsing utilities

## Development Setup

### Prerequisites
- Node.js (for package management and testing)
- Chrome browser (for extension testing)
- Git (for version control)

### Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/thebear705/MiTube.git
   cd MiTube
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Open Chrome and navigate to `chrome://extensions`

4. Enable **Developer mode** (toggle in the top right corner)

5. Click **Load unpacked**

6. Select the `MiTube/src` directory

### Development Workflow

#### Making Changes
1. Make your changes to the appropriate files
2. Test your changes in Chrome
3. Run tests to ensure nothing is broken
4. Reload the extension in Chrome

#### Testing
Run the test suite to ensure your changes don't break existing functionality:
```bash
npm test
```

#### Code Style
- Follow the existing code patterns and conventions
- Use ES6+ features where appropriate
- Keep functions focused and modular
- Add comments for complex logic

## Testing

### Running Tests
The project uses Jest for testing. To run the test suite:
```bash
npm test
```

### Test Files
Test files are located in the `tests/` directory and follow the naming convention `*.test.js`.

## Reloading the Extension

After making changes to the source code, you need to reload the extension in Chrome:

1. Go to `chrome://extensions`
2. Click the **Reload** button on the MiTube extension card
3. Refresh any YouTube page (or navigate to a new one)

## Contribution Process

### Before You Start
1. Check existing issues and pull requests to avoid duplication
2. For new features, consider opening an issue to discuss the approach

### Making Changes
1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the project structure and code style

3. Test your changes thoroughly

4. Run the test suite:
   ```bash
   npm test
   ```

5. Commit your changes with descriptive commit messages

6. Push your branch and create a pull request

### Code Review
- All pull requests require review before merging
- Reviewers will check for code quality, functionality, and adherence to guidelines
- Be prepared to make changes based on feedback

## Git Workflow

### Branch Naming
- Use descriptive names: `feature/feature-name`, `bugfix/issue-description`
- Keep branches focused on a single feature or fix

### Commit Messages
- Use present tense: "Add feature" not "Added feature"
- Be descriptive but concise
- Reference issue numbers when applicable

### Pull Requests
- Include a clear description of changes
- Reference related issues
- Ensure all tests pass
- Include any relevant screenshots or examples

## Code Review Process

### What Reviewers Look For
- Code quality and maintainability
- Adherence to project conventions
- Proper testing
- Performance considerations
- Security implications

### Review Checklist
- [ ] Code follows existing patterns
- [ ] Tests are included and passing
- [ ] Documentation is updated if needed
- [ ] No breaking changes without discussion
- [ ] Performance is acceptable

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Getting Help

If you have questions or need assistance:
- Check existing issues
- Open a new issue for discussion
- Reach out to the maintainers

We appreciate your interest in contributing to MiTube!