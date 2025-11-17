# Changesets

This directory contains changesets that describe changes to packages in this repository.

## What is a changeset?

A changeset is an intent to release a set of packages at particular semver bump types with a summary of the changes made.

## How to create a changeset

Run the following command:

```bash
pnpm changeset
```

This will:
1. Ask you which packages you want to include
2. Ask what kind of change (major, minor, or patch)
3. Ask you to write a summary of the changes

The changeset will be saved as a markdown file in this directory.

## When to create a changeset

Create a changeset when you:
- Add a new feature (minor)
- Fix a bug (patch)
- Make a breaking change (major)
- Update documentation that should be noted in changelog (patch)

## What happens next

1. Your changeset file gets committed to the repository
2. When merged to main, GitHub Actions creates a "Version Packages" PR
3. The PR bumps versions and updates changelogs
4. When the PR is merged, packages are published to npm

## Learn more

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Our Release Process](../RELEASE.md)

