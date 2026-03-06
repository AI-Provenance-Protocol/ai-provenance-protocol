# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in the AI Provenance Protocol specification, reference implementations, or related tooling, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, please email **security@aiprovenanceprotocol.io** with:

1. A description of the vulnerability
2. Steps to reproduce
3. Potential impact assessment
4. Suggested fix (if any)

We will acknowledge receipt within 48 hours and aim to provide a detailed response within 7 days.

## Scope

This security policy covers:

- The APP specification itself (e.g., design flaws that could allow provenance spoofing)
- Reference implementations and SDKs
- The verification protocol
- The project website and infrastructure

## Security Considerations in the Specification

The APP specification includes security considerations that implementors should be aware of:

### Provenance Metadata Integrity
- APP metadata can be modified after generation unless `content_hash` verification is used
- Implementors SHOULD use `content_hash` to detect tampering
- Level 2 verification (content hash matching) provides stronger integrity guarantees than Level 1 (ID lookup)

### Verification Endpoint Security
- Verification endpoints MUST NOT return generated content (only provenance metadata)
- Rate limiting is RECOMMENDED to prevent enumeration attacks
- HTTPS is REQUIRED for verification endpoints in production

### Privacy
- The `review` object intentionally records roles, not personal identifiers
- `generation_id` is pseudonymous — it does not contain PII
- Platforms should consider GDPR implications when storing and serving provenance metadata

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x (draft) | Yes |

## Responsible Disclosure

We follow a 90-day responsible disclosure policy. After reporting, we will:

1. Confirm the vulnerability
2. Develop a fix
3. Coordinate disclosure timing with the reporter
4. Publish an advisory
