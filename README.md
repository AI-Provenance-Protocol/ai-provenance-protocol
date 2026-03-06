# AI Provenance Protocol (APP)

**The open standard for AI-generated content provenance.**

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Spec: CC BY 4.0](https://img.shields.io/badge/Spec-CC%20BY%204.0-green.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Specification](https://img.shields.io/badge/spec-v1.0--draft-orange.svg)](./spec/v1.0/spec.md)

APP is a vendor-neutral, machine-readable format for recording, embedding, and verifying the provenance of AI-generated content. It answers the fundamental questions about any AI output: **who** triggered it, **what model** produced it, **what inputs** were used, and **whether a human reviewed it**.

**Website**: [aiprovenanceprotocol.io](https://aiprovenanceprotocol.io) · **Spec**: [v1.0 Draft](./spec/v1.0/spec.md) · **Schema**: [JSON Schema](./spec/v1.0/schema/app-metadata.schema.json)

---

## Why APP?

AI-generated content is proliferating across every industry, yet there is no widely adopted standard for communicating its provenance. Existing approaches cover images and video ([C2PA](https://c2pa.org/)), or are limited to specific domains ([IPTC](https://iptc.org/)), leaving **text, structured data, and code** without a provenance standard.

Meanwhile, the **EU AI Act Article 50** — enforceable 2 August 2026 — requires AI providers to mark output in a machine-readable, detectable format and offer free verification mechanisms. APP is designed to satisfy these obligations out of the box.

### APP at a glance

| | |
|---|---|
| **What it covers** | Text, structured data, code, and any content representable as JSON or transmitted via HTTP |
| **How it works** | A JSON metadata object (`_app`) embedded in output, transmitted as HTTP headers, or linked via URI |
| **Verification** | Public REST endpoints for third-party provenance confirmation |
| **Compliance** | Maps directly to EU AI Act Article 50(2) and 50(4) obligations |
| **Relationship to C2PA** | Complementary — C2PA handles images/video/audio, APP handles text and structured data |
| **Relationship to MCP** | Complementary — MCP connects AI to tools, APP records provenance of AI output |

---

## Quick Example

```json
{
  "title": "Premium Leather Wallet",
  "description": "Handcrafted from full-grain leather...",
  "_app": {
    "app_version": "1.0.0",
    "ai_generated": true,
    "generator": {
      "platform": "my-platform",
      "model": "anthropic/claude-sonnet-4"
    },
    "generated_at": "2026-03-06T14:22:00Z",
    "generation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "verification_uri": "https://verify.my-platform.com/v1/verify",
    "review": {
      "human_reviewed": false
    }
  }
}
```

Any system receiving this JSON can instantly determine that the content was AI-generated, which model produced it, and where to verify the claim.

---

## Documentation

| Resource | Description |
|----------|-------------|
| [Specification v1.0](./spec/v1.0/spec.md) | The full protocol specification |
| [JSON Schema](./spec/v1.0/schema/app-metadata.schema.json) | Machine-validatable schema for APP metadata |
| [Getting Started](./docs/getting-started.md) | Quick start guide for implementors |
| [Embedding Modes](./docs/embedding-modes.md) | Inline, HTTP header, and linked metadata modes |
| [Verification Protocol](./docs/verification-protocol.md) | How third-party verification works |
| [MCP Integration](./docs/mcp-integration.md) | Using APP with the Model Context Protocol |
| [Regulatory Mapping](./docs/regulatory-mapping.md) | EU AI Act compliance matrix |
| [White Paper](./white-paper/ai-provenance-protocol.md) | Full rationale and technical background |

---

## Embedding Modes

APP metadata can be delivered in three ways:

### 1. Inline Embedding (JSON output)
Embed the `_app` key directly in JSON responses.

### 2. HTTP Headers (API responses)
```http
X-APP-Generation-Id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
X-APP-AI-Generated: true
X-APP-Generator: my-platform
X-APP-Model: anthropic/claude-sonnet-4
X-APP-Verification-URI: https://verify.example.com/v1/verify
```

### 3. Linked Metadata (any content type)
```http
Link: <https://verify.example.com/v1/metadata/a1b2c3d4-...>; rel="ai-provenance"; type="application/app+json"
```

---

## Verification

Conformant platforms expose public REST endpoints for third-party verification:

```
GET  {verification_uri}/{generation_id}    → Provenance lookup
POST {verification_uri}/match              → Content hash verification
```

No authentication required. Returns provenance metadata only — never the content itself.

---

## Project Structure

```
ai-provenance-protocol/
├── spec/                    Protocol specification
│   └── v1.0/               Version 1.0
│       ├── spec.md          Full specification document
│       └── schema/          JSON Schema files
├── docs/                    Documentation and guides
├── white-paper/             White paper
├── website/                 Documentation website (aiprovenanceprotocol.io)
├── examples/                Example implementations
├── CONTRIBUTING.md          Contribution guidelines
├── CODE_OF_CONDUCT.md       Community code of conduct
└── SECURITY.md              Security policy
```

---

## Ecosystem

### SDKs (Coming Soon)

| Package | Language | Registry |
|---------|----------|----------|
| `@ai-provenance-protocol/sdk` | TypeScript | npm |
| `ai-provenance-protocol` | Python | PyPI |

### Related Projects

| Project | Relationship |
|---------|-------------|
| [C2PA / Content Credentials](https://c2pa.org/) | Complementary — image/video/audio provenance |
| [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) | Complementary — AI-to-tool connectivity |
| [Schema.org](https://schema.org/) | Interoperable — `CreativeWork` metadata |
| [W3C PROV](https://www.w3.org/TR/prov-overview/) | Foundational — general provenance ontology |

---

## Contributing

We welcome contributions from the community. Please read our [Contributing Guide](./CONTRIBUTING.md) before submitting a pull request.

- **Specification changes**: Open an issue for discussion before submitting a PR
- **Documentation improvements**: PRs welcome
- **SDK contributions**: Follow the coding standards in the contributing guide
- **Bug reports**: Use GitHub Issues with the appropriate template

---

## Governance

APP follows a phased governance model:

- **Phase 1 (Current)**: Bootstrap — rapid iteration on the v1.0 specification
- **Phase 2**: Steering Committee — once 3+ independent implementations exist
- **Phase 3**: Standards Body submission (IETF / W3C)

---

## License

- **Specification**: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
- **SDKs and Tools**: [Apache License 2.0](./LICENSE)
- **Website Content**: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)

---

<p align="center">
  <strong>AI Provenance Protocol</strong> · <a href="https://aiprovenanceprotocol.io">Website</a> · <a href="./spec/v1.0/spec.md">Specification</a> · <a href="https://github.com/AI-Provenance-Protocol/ai-provenance-protocol/discussions">Discussions</a>
</p>
