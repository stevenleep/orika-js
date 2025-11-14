# Contributing to orika-js

Thank you for your interest in contributing to orika-js! We welcome contributions from the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## 🤝 Code of Conduct

Please be respectful and constructive in all interactions. We aim to foster an open and welcoming environment.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16
- pnpm >= 8

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/orika-js.git
   cd orika-js
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Build the Project**
   ```bash
   pnpm build
   ```

4. **Run Examples**
   ```bash
   pnpm run example:01  # Basic example
   pnpm run example:02  # Async example
   pnpm run example:web # Web example
   ```

## 💡 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Code samples if applicable
- Environment details (Node version, OS, etc.)

### Suggesting Enhancements

Feature requests are welcome! Please:
- Check if the feature already exists
- Clearly describe the use case
- Provide examples of how it would work

### Contributing Code

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test Your Changes**
   ```bash
   pnpm build
   pnpm run example:01  # Test basic functionality
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

## 📝 Coding Guidelines

### TypeScript

- Use TypeScript strict mode
- Provide proper type annotations
- Avoid `any` types when possible
- Use generics for reusable components

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- Use meaningful variable and function names

### File Organization

```
src/
  builder/     - Configuration builders
  cache/       - Caching mechanisms
  converter/   - Type converters
  core/        - Core mapping logic
  decorators/  - Decorator implementations
  expression/  - Expression evaluation
  types/       - Type definitions
  utils/       - Utility functions
```

### Adding New Features

1. **Create appropriate files** in the correct directory
2. **Export from index.ts** if it's a public API
3. **Add examples** in the `examples/` directory
4. **Update README.md** with usage instructions
5. **Update CHANGELOG.md** with your changes

### Examples

When adding new features, please add an example:

```typescript
// examples/XX-your-feature.ts
import { MapperFactory, createMapperBuilder } from '../src';

// Clear, commented example code
class Source { /* ... */ }
class Target { /* ... */ }

// Show the feature in action
createMapperBuilder<Source, Target>()
  .from(Source)
  .to(Target)
  // Your feature here
  .register();

const result = factory.map(source, Source, Target);
console.log('Result:', result);
```

## 📋 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```bash
feat: add support for nested object mapping
fix: resolve null pointer in async mapper
docs: update README with new examples
refactor: simplify converter registry logic
```

## 🔍 Pull Request Process

1. **Ensure your PR**:
   - Has a clear description
   - References any related issues
   - Includes examples if adding features
   - Doesn't break existing functionality

2. **PR Review**:
   - Maintainers will review your code
   - Address any feedback or questions
   - Make requested changes if needed

3. **Merging**:
   - PRs require approval from a maintainer
   - Squash and merge is preferred
   - Your contribution will be credited

## 🎯 Good First Issues

Look for issues labeled `good first issue` - these are great for newcomers!

Common areas for contribution:
- Adding new converters
- Improving documentation
- Adding more examples
- Performance optimizations
- Bug fixes

## 📞 Questions?

- Open an issue for discussion
- Check existing issues and PRs first
- Be patient - maintainers respond as soon as possible

## 🙏 Thank You!

Your contributions make orika-js better for everyone. We appreciate your time and effort!

---

**Happy Coding!** 🚀

