# Release Process

This document explains how to create releases for this monorepo using GitHub Actions.

## Automated Release Process

This repository is configured with GitHub Actions workflows to automate the release process. These workflows handle:

1. Version management
2. Changelog generation
3. Tagging
4. Release creation
5. Package.json version updates

## How to Create a New Release

### Option 1: Using the "Build and Release" GitHub Action

1. Go to the "Actions" tab in the GitHub repository
2. Select the "Build and Release" workflow
3. Click "Run workflow"
4. Configure the following options:
   - **Version increment type**: Choose from `patch`, `minor`, or `major` based on the changes since the last release
   - **Manual version override** (optional): Provide a specific version number if needed
5. Click "Run workflow"

This will:
- Generate a new version number based on the previous tag
- Build and push Docker images
- Update Helm chart values
- Create a Git tag
- Generate a detailed changelog
- Create a GitHub release with the changelog
- Create a PR to update Helm charts

### Option 2: Using the "Auto Update Package Version" GitHub Action

This action can be run manually to update the version in the package.json file:

1. Go to the "Actions" tab in the GitHub repository
2. Select the "Auto Update Package Version" workflow
3. Click "Run workflow"
4. Enter the version number (without 'v' prefix)
5. Click "Run workflow"

This will:
- Update the version in the root package.json file
- Create a pull request with the changes

## Understanding the Versioning Scheme

This repository follows Semantic Versioning (SemVer):

- **MAJOR** version for incompatible API changes (x.0.0)
- **MINOR** version for adding functionality in a backward compatible manner (0.x.0)
- **PATCH** version for backward compatible bug fixes (0.0.x)

## Changelog Format

The automated changelog generation categorizes changes based on commit message prefixes:

- 🚀 **Features**: Commits starting with `feat`
- 🐛 **Bug Fixes**: Commits starting with `fix`
- 🧪 **Tests and CI**: Commits starting with `test` or `ci`
- 📚 **Documentation**: Commits starting with `docs`
- 🧹 **Chores and Refactoring**: Commits starting with `chore` or `refactor`
- 📦 **Other Changes**: Any other commit types

## Tips for Good Commit Messages

For the changelog to be most effective, follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types:
- feat: A new feature
- fix: A bug fix
- docs: Documentation changes
- style: Changes that do not affect code meaning (formatting, etc)
- refactor: Code change that neither fixes a bug nor adds a feature
- perf: Code change that improves performance
- test: Adding or modifying tests
- chore: Changes to the build process or auxiliary tools

By following this format, the automated changelog will be well-organized and informative.

## Manual Steps (if needed)

If you need to manually tag a release:

```bash
# Create an annotated tag
git tag -a v1.0.0 -m "Release v1.0.0"

# Push the tag to remote
git push origin v1.0.0
```
