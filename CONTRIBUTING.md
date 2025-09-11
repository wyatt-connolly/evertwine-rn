# Contributing to Evertwine

Thank you for your interest in contributing to Evertwine! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Git
- Firebase account (for testing)

### Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/your-username/evertwine-rn.git
   cd evertwine-rn
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Create a Firebase project
   - Copy the configuration to `firebase.config.ts`
   - Enable Authentication, Firestore, and Storage

4. **Start development:**
   ```bash
   npm start
   ```

## 🌳 Branch Strategy

We use a Git Flow branching model:

- **`main`** - Production-ready code
- **`develop`** - Integration branch for features
- **`feature/*`** - Feature development branches
- **`hotfix/*`** - Critical bug fixes

### Branch Naming Convention
- Features: `feature/description-of-feature`
- Bug fixes: `bugfix/description-of-bug`
- Hotfixes: `hotfix/description-of-hotfix`

## 🔄 Development Workflow

### 1. Create a Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Write clean, readable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 3. Commit Your Changes
```bash
git add .
git commit -m "feat: add new feature description"
```

**Commit Message Format:**
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 4. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a pull request to the `develop` branch.

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type when possible
- Use meaningful variable and function names

### React Native
- Use functional components with hooks
- Follow React Native best practices
- Use proper prop types and interfaces
- Implement proper error handling

### File Organization
- Keep components small and focused
- Use proper folder structure
- Export components from index files
- Follow naming conventions

### Styling
- Use StyleSheet for styles
- Follow the theme system
- Use consistent spacing and colors
- Make components responsive

## 🧪 Testing

### Manual Testing
- Test on both iOS and Android
- Test in both light and dark themes
- Test with different screen sizes
- Test offline functionality

### Firebase Testing
- Test authentication flows
- Test Firestore operations
- Test image uploads
- Test error handling

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows the style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] Proper error handling is implemented

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Tested in both themes
- [ ] Firebase functionality tested

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment:**
   - OS version
   - React Native version
   - Expo version
   - Device/emulator details

2. **Steps to Reproduce:**
   - Clear, numbered steps
   - Expected vs actual behavior

3. **Additional Context:**
   - Screenshots or videos
   - Error messages
   - Relevant code snippets

## 💡 Feature Requests

When suggesting features:

1. **Problem Description:**
   - What problem does this solve?
   - Who would benefit from this feature?

2. **Proposed Solution:**
   - How should this feature work?
   - Any design considerations?

3. **Additional Context:**
   - Screenshots or mockups
   - Related issues or discussions

## 🔒 Security

If you discover a security vulnerability:

1. **DO NOT** create a public issue
2. Email security concerns to: [security@evertwine.com]
3. Include detailed information about the vulnerability
4. Allow time for the team to address the issue

## 📞 Getting Help

- **GitHub Issues:** For bugs and feature requests
- **Discussions:** For general questions and ideas
- **Documentation:** Check the README and code comments

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📄 License

By contributing to Evertwine, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Evertwine! 🚀
