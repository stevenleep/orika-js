# Contributing to Orika-JS

Thank you for your interest in contributing to Orika-JS! 🎉

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Quick Start](#quick-start)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful and constructive.

## Quick Start

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/orika-js.git
cd orika-js

# 2. Install dependencies
pnpm install

# 3. Build packages
pnpm build

# 4. Make your changes and test
pnpm dev
```

## How Can I Contribute?

### Reporting Bugs

Use the [bug report template](https://github.com/stevenleep/orika-js/issues/new?template=bug_report.yml). Include:
- Steps to reproduce
- Expected vs actual behavior
- Environment details

### Suggesting Features

Use the [feature request template](https://github.com/stevenleep/orika-js/issues/new?template=feature_request.yml).

### First Time Contributing?

Look for issues labeled `good first issue` or `help wanted`.

## Development Setup

**Prerequisites:** Node.js >= 16, pnpm >= 8

```bash
pnpm install          # Install dependencies
pnpm build           # Build all packages
pnpm dev             # Development mode
pnpm build:core      # Build specific package
pnpm --filter react-demo dev  # Run example
```

## Coding Guidelines

- Use TypeScript with strict mode
- Follow existing code style
- Add JSDoc comments for public APIs
- Keep functions focused and small
- Write tests for new features

**Naming:**
- Classes/Interfaces: `PascalCase`
- Functions/Variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case.ts`

## Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

feat(core): add async converter support
fix(react): prevent re-renders in useMapper
docs: update README examples
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Pull Request Process

1. Ensure `pnpm build` succeeds
2. Follow conventional commit format
3. Update documentation if needed
4. Add changeset: `pnpm changeset` (for version bumps)
5. CI checks must pass
6. Get maintainer approval

## Release Process

For maintainers:

```bash
# Create changeset for version bump
pnpm changeset

# Commit changeset
git add .changeset/
git commit -m "chore: add changeset"

# Push - GitHub Actions will create release PR
git push origin main
```

## Questions?

- GitHub Discussions: Questions and ideas
- GitHub Issues: Bugs and features

Thank you for contributing! 🎉

