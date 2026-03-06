# Getting Started with APP

This guide walks you through implementing the AI Provenance Protocol in your application. By the end, your system will produce machine-readable provenance metadata for every piece of AI-generated content.

## Prerequisites

- Familiarity with JSON and REST APIs
- An application that generates content using AI models

## Step 1: Generate APP Metadata

Every time your application generates content using an AI model, create an APP metadata object:

```json
{
  "app_version": "1.0.0",
  "ai_generated": true,
  "generator": {
    "platform": "your-platform-name",
    "model": "provider/model-name"
  },
  "generated_at": "2026-03-06T14:22:00Z",
  "generation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

Key requirements:
- `generation_id` must be a UUID v4, unique per generation event
- `generated_at` must be an ISO 8601 timestamp (UTC recommended)
- `model` should follow the format `"provider/model-name"` (e.g., `"anthropic/claude-sonnet-4"`)

## Step 2: Choose an Embedding Mode

### Option A: Inline Embedding (for JSON APIs)

Add the metadata as an `_app` key in your JSON response:

```json
{
  "product_title": "Premium Leather Wallet",
  "product_description": "Handcrafted from full-grain leather...",
  "_app": {
    "app_version": "1.0.0",
    "ai_generated": true,
    "generator": {
      "platform": "your-platform",
      "model": "anthropic/claude-sonnet-4"
    },
    "generated_at": "2026-03-06T14:22:00Z",
    "generation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

### Option B: HTTP Headers (for non-JSON responses)

Add `X-APP-*` headers to your HTTP response:

```http
HTTP/1.1 200 OK
Content-Type: text/html
X-APP-Version: 1.0.0
X-APP-AI-Generated: true
X-APP-Generation-Id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
X-APP-Generator-Platform: your-platform
X-APP-Generator-Model: anthropic/claude-sonnet-4
X-APP-Generated-At: 2026-03-06T14:22:00Z
```

### Option C: Linked Metadata (for any content type)

Point to a hosted metadata document:

```http
Link: <https://your-platform.com/v1/metadata/a1b2c3d4-...>; rel="ai-provenance"; type="application/app+json"
```

## Step 3: Record Human Review (Optional but Recommended)

When a human reviews AI-generated content, update the metadata:

```json
{
  "review": {
    "human_reviewed": true,
    "reviewer_role": "editor",
    "reviewed_at": "2026-03-06T15:30:00Z",
    "review_type": "approved_without_changes"
  }
}
```

This is especially important for EU AI Act compliance — Article 50(4) provides a disclosure exemption for human-reviewed content.

## Step 4: Add Content Hash (Optional)

For integrity verification, compute a SHA-256 hash of the generated content:

```json
{
  "content_hash": "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

For JSON content, hash the canonical representation (keys sorted, no whitespace, UTF-8, excluding the `_app` key).

## Step 5: Implement Verification (Recommended)

Expose a public endpoint where third parties can verify generation claims:

```
GET https://your-platform.com/v1/verify/{generation_id}
```

Response:
```json
{
  "found": true,
  "ai_generated": true,
  "generator": {
    "platform": "your-platform",
    "model": "anthropic/claude-sonnet-4"
  },
  "generated_at": "2026-03-06T14:22:00Z"
}
```

No authentication required. Return provenance metadata only — never the content itself.

## Step 6: Validate Your Metadata

Validate your APP metadata against the [JSON Schema](https://aiprovenanceprotocol.io/schema/v1.0/app-metadata.schema.json) to ensure conformance.

## What's Next?

- Read the [full specification](../spec/v1.0/spec.md) for complete details
- Explore [embedding modes](./embedding-modes.md) in depth
- Understand the [verification protocol](./verification-protocol.md)
- See how APP maps to [EU AI Act obligations](./regulatory-mapping.md)
- Learn about [MCP integration](./mcp-integration.md) if you use the Model Context Protocol
