# Regulatory Mapping

APP is designed with regulation in mind. This document maps APP features to specific regulatory requirements across jurisdictions, with a focus on the EU AI Act.

## EU AI Act (Regulation 2024/1689)

### Article 50: Transparency Obligations

The EU AI Act Article 50 is the primary regulatory driver for APP. Its obligations become enforceable on **2 August 2026**.

#### Article 50(2) — Provider Obligations

> Providers of AI systems [...] shall ensure that the outputs of the AI system are marked in a machine-readable format and detectable as artificially generated or manipulated.

| Requirement | APP Feature | Implementation |
|-------------|------------|----------------|
| Machine-readable marking | `_app` metadata object | Inline JSON, HTTP headers, or linked metadata |
| Detectable as AI-generated | `ai_generated: true` | Explicit boolean field |
| Detection mechanism free of charge | Verification protocol | Public endpoints, no auth required |
| Publicly available interface | `verification_uri` | HTTPS endpoint, no registration needed |
| Shall not affect functionality | `_app` key / `X-APP-*` headers | Non-breaking; consumers can ignore |

#### Article 50(4) — Deployer Obligations

> Deployers of an AI system that generates [...] text which is published for the purpose of informing the public [...] shall disclose that the content has been artificially generated or manipulated.

| Requirement | APP Feature | Implementation |
|-------------|------------|----------------|
| Disclose AI generation | `ai_generated` field | Available for downstream display |
| Human review exemption | `review.human_reviewed` | Boolean flag with timestamp |
| Review audit trail | `review` object | Includes role, timestamp, review type |

### How APP Achieves Compliance

1. **Embed APP metadata** in all AI-generated output → satisfies Article 50(2) marking requirement
2. **Expose a verification endpoint** → satisfies Article 50(2) detection mechanism requirement
3. **Record human review** when it occurs → supports Article 50(4) exemption claims
4. **Use non-breaking embedding** → satisfies the "shall not affect functionality" requirement

### Code of Practice

The EU Code of Practice on AI-generated content marking (expected June 2026) will provide detailed technical guidance. APP is designed to be adaptable:

- The schema is extensible via minor version updates
- The `extensions` namespace can carry Code of Practice-specific metadata
- The verification protocol can be extended to meet new requirements

---

## Other Regulatory Frameworks

### United States

| Framework | APP Relevance |
|-----------|---------------|
| Executive Order 14110 (AI Safety) | APP's provenance tracking aligns with EO guidance on content authentication and watermarking |
| NIST AI Risk Management Framework | APP supports the "Transparency" and "Accountability" functions of the AI RMF |
| State-level AI disclosure laws | Several US states are enacting AI content disclosure laws; APP provides a standard technical mechanism |

### China

| Framework | APP Relevance |
|-----------|---------------|
| Interim Measures for Generative AI (2023) | Requires labelling of AI-generated content; APP's `ai_generated` field and metadata satisfy this |

### Canada

| Framework | APP Relevance |
|-----------|---------------|
| AIDA (Artificial Intelligence and Data Act, proposed) | Includes transparency obligations for high-impact AI; APP provides a ready-made mechanism |

### United Kingdom

| Framework | APP Relevance |
|-----------|---------------|
| AI Safety Institute guidance | Voluntary provenance best practices; APP provides a concrete implementation |

### Global Standards

| Standard | APP Relevance |
|----------|---------------|
| ISO/IEC 42001 (AI Management System) | APP metadata provides the audit trail and documentation required by the standard |
| ISO/IEC 23894 (AI Risk Management) | APP supports risk management through transparency and traceability |

---

## Compliance Checklist

For organisations implementing APP to achieve EU AI Act compliance:

- [ ] Embed APP metadata (`_app` object or `X-APP-*` headers) in all AI-generated output
- [ ] Ensure `ai_generated` is set to `true` for all AI-generated content
- [ ] Include accurate `generator` information (platform and model)
- [ ] Record `generated_at` timestamps for all generation events
- [ ] Generate unique `generation_id` (UUID v4) for each generation
- [ ] Expose a public verification endpoint (recommended)
- [ ] Implement human review tracking (`review` object) when applicable
- [ ] Compute and include `content_hash` for integrity verification (recommended)
- [ ] Document your APP implementation in your AI governance documentation
- [ ] Validate metadata against the APP JSON Schema regularly
