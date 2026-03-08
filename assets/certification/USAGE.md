# APP Certification Badge — Usage Guidelines

The APP Certification Badge is available for businesses and platforms that have implemented the [AI Provenance Protocol](https://aiprovenanceprotocol.io) in their products or services. Displaying the badge signals to customers, partners, and regulators that your AI-generated output includes machine-readable provenance metadata.

---

## Available Variants

| File | Description | Recommended Use |
|------|-------------|-----------------|
| `app-certified-badge.svg` | Full horizontal lockup (blue) | Website footers, about pages, partner pages |
| `app-certified-badge-light.svg` | Full horizontal lockup (light/white background) | Light-themed pages, print media |
| `app-certified-badge-dark.svg` | Full horizontal lockup (dark background) | Dark-themed pages, dark-mode UIs |
| `app-certified-badge-compact.svg` | Square badge | Sidebars, app stores, social media avatars |
| `app-certified-inline.svg` | Small inline pill | Navigation bars, inline trust indicators |
| `app-certified-mark.svg` | Icon-only mark | Favicons, small UI elements, watermarks |

---

## Embedding in HTML

### Standard badge

```html
<a href="https://aiprovenanceprotocol.io" target="_blank" rel="noopener">
  <img
    src="/assets/app-certified-badge.svg"
    alt="APP Certified — AI Provenance Protocol"
    width="480"
    height="140"
  />
</a>
```

### Inline badge

```html
<a href="https://aiprovenanceprotocol.io" target="_blank" rel="noopener">
  <img
    src="/assets/app-certified-inline.svg"
    alt="APP Certified"
    width="220"
    height="44"
  />
</a>
```

### Markdown

```markdown
[![APP Certified — AI Provenance Protocol](https://raw.githubusercontent.com/AI-Provenance-Protocol/ai-provenance-protocol/main/assets/certification/app-certified-badge.svg)](https://aiprovenanceprotocol.io)
```

---

## Eligibility

To display the APP Certification Badge, your implementation **must**:

1. **Embed valid APP metadata** in at least one supported mode (inline JSON, HTTP headers, or linked metadata)
2. **Include all required fields**: `app_version`, `ai_generated`, `generator`, `generated_at`, `generation_id`
3. **Expose a public verification endpoint** conforming to the APP verification protocol (Level 1 minimum)
4. **Use APP v1.0 or later** as specified in the [protocol specification](../../spec/v1.0/spec.md)

Self-certification is accepted during the bootstrap phase (Phase 1 governance). A formal certification programme will be introduced when the protocol reaches Phase 2 governance.

---

## Design Rules

- **Do not** alter the colours, proportions, or typography of the badge
- **Do not** place the badge on backgrounds that reduce legibility — use the appropriate variant for your background colour
- **Maintain clear space** around the badge equal to at least half the badge height
- **Minimum sizes**: horizontal badge 240px wide, compact badge 80px wide, inline badge 140px wide, mark 32px wide
- The badge **must** link to `https://aiprovenanceprotocol.io` or your platform's public APP verification endpoint

---

## Colour Reference

| Token | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#0165B3` | Main badge background, logo on light variant |
| Dark Blue | `#014D8A` | Gradient end |
| Navy | `#0A1A2A` | Dark variant background, text on light variant |
| Light Blue | `#4DA6FF` | Logo and text on dark variant |

---

## Questions?

If you have questions about badge usage or certification eligibility, please [open a discussion](https://github.com/AI-Provenance-Protocol/ai-provenance-protocol/discussions) on the APP GitHub repository.
