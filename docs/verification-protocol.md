# Verification Protocol

The APP verification protocol allows any third party to confirm provenance claims about AI-generated content. This is a key differentiator from metadata-only approaches — it provides a mechanism for independent confirmation.

## Overview

The verification protocol defines two levels:

| Level | Method | Purpose |
|-------|--------|---------|
| **Level 1** | `GET /{generation_id}` | Confirm that a specific generation event occurred |
| **Level 2** | `POST /match` | Find generation events matching a content hash |

Both levels are served from the `verification_uri` specified in the APP metadata.

---

## Level 1: Generation ID Lookup

The simplest verification — confirm that a generation ID exists and retrieve its provenance metadata.

### Request

```
GET {verification_uri}/{generation_id}
```

Example:
```
GET https://verify.example.com/v1/verify/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### Response: Generation Found

```http
HTTP/1.1 200 OK
Content-Type: application/app+json

{
  "found": true,
  "app_version": "1.0.0",
  "ai_generated": true,
  "generator": {
    "platform": "example-platform",
    "model": "anthropic/claude-sonnet-4"
  },
  "generated_at": "2026-03-06T14:22:00Z",
  "review": {
    "human_reviewed": true,
    "reviewer_role": "editor",
    "reviewed_at": "2026-03-06T15:30:00Z",
    "review_type": "approved_without_changes"
  }
}
```

### Response: Generation Not Found

```http
HTTP/1.1 200 OK
Content-Type: application/app+json

{
  "found": false
}
```

### Implementation Notes

- Both found and not-found cases return `200 OK` (the `found` field distinguishes)
- No authentication is required — this is a public endpoint
- The response MUST NOT include the generated content itself
- The response SHOULD include `generator`, `generated_at`, and `review` fields
- Rate limiting (HTTP 429) is recommended

---

## Level 2: Content Hash Verification

Advanced verification — find generation events matching a content hash. This supports the EU AI Act's "detection mechanism" requirement.

### Request

```
POST {verification_uri}/match
Content-Type: application/json

{
  "content_hash": "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "content_type": "application/json"
}
```

### Response: Matches Found

```http
HTTP/1.1 200 OK
Content-Type: application/app+json

{
  "matches": [
    {
      "generation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "ai_generated": true,
      "generator": {
        "platform": "example-platform",
        "model": "anthropic/claude-sonnet-4"
      },
      "generated_at": "2026-03-06T14:22:00Z"
    }
  ]
}
```

### Response: No Matches

```http
HTTP/1.1 200 OK
Content-Type: application/app+json

{
  "matches": []
}
```

### Implementation Notes

- `content_hash` must follow the format `"{algorithm}:{hex-hash}"` (e.g., `"sha256:abc123..."`)
- `content_type` is optional but recommended to narrow matches
- Rate limiting is strongly recommended to prevent enumeration
- The response MUST NOT include generated content

---

## Implementing a Verification Endpoint

### Minimal Implementation (Node.js / Express)

```typescript
import express from 'express';

const app = express();
app.use(express.json());

// In production, use a real database
const generations = new Map<string, AppMetadata>();

// Level 1: Generation ID lookup
app.get('/v1/verify/:generationId', (req, res) => {
  const metadata = generations.get(req.params.generationId);

  if (metadata) {
    res.json({
      found: true,
      app_version: metadata.app_version,
      ai_generated: metadata.ai_generated,
      generator: metadata.generator,
      generated_at: metadata.generated_at,
      review: metadata.review,
    });
  } else {
    res.json({ found: false });
  }
});

// Level 2: Content hash matching
app.post('/v1/verify/match', (req, res) => {
  const { content_hash } = req.body;

  const matches = Array.from(generations.values())
    .filter(m => m.content_hash === content_hash)
    .map(m => ({
      generation_id: m.generation_id,
      ai_generated: m.ai_generated,
      generator: m.generator,
      generated_at: m.generated_at,
    }));

  res.json({ matches });
});
```

---

## Security Considerations

### Rate Limiting

Verification endpoints SHOULD implement rate limiting to prevent:

- **Enumeration attacks**: Iterating through generation IDs to discover metadata
- **Denial of service**: Overwhelming the endpoint with requests
- **Information harvesting**: Systematically extracting generation metadata

Recommended approach: return `HTTP 429 Too Many Requests` with a `Retry-After` header.

### HTTPS

Verification endpoints MUST use HTTPS in production. This prevents:
- Interception of verification queries
- Modification of verification responses
- Leakage of generation IDs in transit

### No Content Exposure

Verification endpoints MUST NOT return the generated content itself. The purpose is to confirm provenance claims, not to serve as a content delivery mechanism.

---

## EU AI Act Compliance

The verification protocol directly supports EU AI Act Article 50(2) requirements:

| Requirement | How APP Verification Addresses It |
|-------------|-----------------------------------|
| Detection mechanisms free of charge | Verification endpoints require no authentication or payment |
| Publicly available interfaces | Endpoints are public HTTPS URLs |
| Machine-readable detection | JSON responses with structured provenance data |
| Marking shall not affect functionality | Verification is a separate service, not embedded in content delivery |
