# Contributing to the AI Provenance Protocol

Thank you for your interest in contributing to the AI Provenance Protocol (APP). This document provides guidelines and information for contributors.

## How to Contribute

### Reporting Issues

- Use [GitHub Issues](https://github.com/AI-Provenance-Protocol/ai-provenance-protocol/issues) to report bugs, suggest features, or ask questions
- Search existing issues before creating a new one
- Use the appropriate issue template when available

### Specification Changes

Changes to the protocol specification require careful consideration:

1. **Open an issue first** — describe the problem and your proposed solution
2. **Discuss** — allow time for community feedback (minimum 7 days for non-trivial changes)
3. **Submit a PR** — reference the issue, include rationale, and describe impact on existing implementations
4. **Review** — specification PRs require at least two approvals

### Documentation

Documentation improvements are always welcome:

- Fix typos, clarify language, improve examples
- Add implementation guides for new platforms or languages
- Translate documentation into other languages

### Code (SDKs, Tools, Website)

1. Fork the repository
2. Create a feature branch (`feat/your-feature-name`)
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 20+ and pnpm (for website and TypeScript SDK)
- Python 3.11+ (for Python SDK)
- Git

### Website Development

```bash
cd website
pnpm install
pnpm dev
```

## Branch Naming

| Prefix | Purpose |
|--------|---------|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes |
| `spec/` | Specification changes |
| `chore/` | Maintenance tasks |

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add content hash verification to TypeScript SDK
fix: correct JSON Schema for review object
docs: add WordPress integration guide
spec: clarify human review exemption criteria
chore: update CI configuration
```

## Code Style

### TypeScript
- Strict mode enabled
- ESLint + Prettier formatting
- Prefer `interface` over `type` for public APIs
- Export types alongside implementations

### Python
- Format with Black (line length 88)
- Lint with Ruff
- Type hints on all public functions
- Docstrings in Google style

## Specification Writing Style

- Use RFC 2119 keywords (MUST, SHOULD, MAY) precisely and consistently
- Define terms on first use
- Include practical examples for every feature
- Reference relevant EU AI Act articles where applicable
- Keep the core specification minimal; use extensions for domain-specific needs

## Code of Conduct

All contributors must follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

By contributing to APP, you agree that your contributions will be licensed under:
- **Specification contributions**: CC BY 4.0
- **Code contributions**: Apache 2.0

## Questions?

- Open a [GitHub Discussion](https://github.com/AI-Provenance-Protocol/ai-provenance-protocol/discussions)
- File an [Issue](https://github.com/AI-Provenance-Protocol/ai-provenance-protocol/issues)
