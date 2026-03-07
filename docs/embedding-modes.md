# Embedding Modes

APP metadata can be associated with AI-generated content using three modes. This document provides detailed guidance on choosing and implementing each mode.

## Choosing a Mode

| Mode | Best for | Limitations |
|------|----------|-------------|
| **Inline** | JSON APIs, structured data | Only works with JSON output |
| **HTTP Headers** | REST APIs, HTML responses | Cannot carry full metadata (inputs, extensions) |
| **Linked** | Any content type (PDF, images, HTML) | Requires hosting a metadata endpoint |

You can combine modes. For example, use HTTP headers for quick detection and linked metadata for full provenance details.

---

## Mode 1: Inline Embedding

Embed the `_ai_provenance` key directly in JSON output.

### Implementation

```json
{
  "title": "Premium Leather Wallet",
  "description": "Handcrafted from full-grain leather...",
  "_ai_provenance": {
    "app_version": "1.0.0",
    "ai_generated": true,
    "generator": {
      "platform": "example-platform",
      "model": "anthropic/claude-sonnet-4"
    },
    "generated_at": "2026-03-06T14:22:00Z",
    "generation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "verification_uri": "https://verify.example.com/v1/verify",
    "review": {
      "human_reviewed": false
    }
  }
}
```

### Rules

- The key MUST be `_ai_provenance` at the top level of the JSON object
- The underscore prefix signals "this is metadata, not content"
- Systems that don't understand APP should ignore the `_ai_provenance` key
- When computing content hashes, exclude the `_ai_provenance` key

### When to Use

- Your API returns JSON responses
- Downstream systems can receive and process the `_ai_provenance` key
- You want the metadata to travel with the content through JSON pipelines

### Extracting Metadata

```typescript
function extractAppMetadata(content: unknown): { data: unknown; app: AppMetadata | null } {
  if (typeof content === 'object' && content !== null && '_ai_provenance' in content) {
    const { _ai_provenance, ...data } = content as Record<string, unknown>;
    return { data, app: _ai_provenance as AppMetadata };
  }
  return { data: content, app: null };
}
```

---

## Mode 2: HTTP Headers

Transmit APP metadata as HTTP response headers.

### Implementation

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
X-APP-Version: 1.0.0
X-APP-AI-Generated: true
X-APP-Generation-Id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
X-APP-Generator-Platform: example-platform
X-APP-Generator-Model: anthropic/claude-sonnet-4
X-APP-Generated-At: 2026-03-06T14:22:00Z
X-APP-Verification-URI: https://verify.example.com/v1/verify
X-APP-Human-Reviewed: false
```

### Header Reference

| Header | Required | Maps to |
|--------|----------|---------|
| `X-APP-Version` | Yes | `app_version` |
| `X-APP-AI-Generated` | Yes | `ai_generated` |
| `X-APP-Generation-Id` | Yes | `generation_id` |
| `X-APP-Generator-Platform` | Yes | `generator.platform` |
| `X-APP-Generator-Model` | Yes | `generator.model` |
| `X-APP-Generated-At` | Yes | `generated_at` |
| `X-APP-Verification-URI` | No | `verification_uri` |
| `X-APP-Human-Reviewed` | No | `review.human_reviewed` |
| `X-APP-Content-Hash` | No | `content_hash` |
| `X-APP-Parent-Generation-Id` | No | `parent_generation_id` |

### When to Use

- Your API returns non-JSON content (HTML, plain text, XML)
- You need lightweight detection without modifying the response body
- You want to add APP metadata to existing APIs with minimal changes

### Limitations

HTTP headers cannot carry the full APP metadata object (inputs, extensions, detailed review). For full metadata, combine with Mode 3 (linked metadata).

---

## Mode 3: Linked Metadata

Point to a hosted APP metadata document via HTTP `Link` header or HTML `<link>` element.

### HTTP Link Header

```http
HTTP/1.1 200 OK
Content-Type: application/pdf
Link: <https://verify.example.com/v1/metadata/a1b2c3d4-e5f6-7890-abcd-ef1234567890>; rel="ai-provenance"; type="application/app+json"
```

### HTML Link Element

```html
<head>
  <link rel="ai-provenance"
        href="https://verify.example.com/v1/metadata/a1b2c3d4-e5f6-7890-abcd-ef1234567890"
        type="application/app+json" />
</head>
```

### Linked Document Format

The linked URL must return a complete APP metadata object:

```json
{
  "app_version": "1.0.0",
  "ai_generated": true,
  "generator": {
    "platform": "example-platform",
    "model": "anthropic/claude-sonnet-4"
  },
  "generated_at": "2026-03-06T14:22:00Z",
  "generation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "verification_uri": "https://verify.example.com/v1/verify",
  "inputs": {
    "type": "multimodal",
    "items": [
      { "kind": "image", "ref": "product-photo.jpg" },
      { "kind": "data", "ref": "product_attributes" }
    ]
  },
  "review": {
    "human_reviewed": true,
    "reviewer_role": "editor",
    "reviewed_at": "2026-03-06T15:30:00Z",
    "review_type": "edited"
  }
}
```

### When to Use

- Your content is not JSON (PDFs, images, HTML pages)
- You need to carry full metadata including inputs and extensions
- You want to update metadata after initial delivery (the linked document can be updated)
- You want a single metadata source of truth

---

## Combining Modes

Modes can be combined for maximum interoperability. A common pattern:

1. **HTTP headers** for quick automated detection
2. **Linked metadata** for full provenance details

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
X-APP-AI-Generated: true
X-APP-Generation-Id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
Link: <https://verify.example.com/v1/metadata/a1b2c3d4-...>; rel="ai-provenance"; type="application/app+json"
```

This allows lightweight consumers to detect AI-generated content via headers, while advanced consumers can follow the link for full provenance details.
