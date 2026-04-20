# @ai-provenance-protocol/sdk

Official TypeScript/JavaScript SDK for the [AI Provenance Protocol](https://aiprovenanceprotocol.io).

## Installation

```bash
npm install @ai-provenance-protocol/sdk
```

## Quick start

```typescript
import { APP } from '@ai-provenance-protocol/sdk'

// Create metadata for a generation event
const metadata = APP.create({
  generator: {
    platform: 'my-platform',
    model: 'anthropic/claude-sonnet-4',
  },
})

// Embed in your JSON output
const output = APP.embed(
  { title: 'Premium Leather Wallet', description: 'Handcrafted from full-grain leather...' },
  metadata
)
// { title: '...', description: '...', _ai_provenance: { ... } }

// Extract from received output
const { content, app } = APP.extract(output)

// Validate metadata
const result = APP.validate(metadata)
// { valid: true, errors: [] }

// Record a human review
const reviewed = APP.review(metadata, {
  human_reviewed: true,
  reviewer_role: 'editor',
  review_type: 'approved_without_changes',
})

// Add a content hash for integrity verification
const hash = APP.hashContent({ title: 'Premium Leather Wallet', description: '...' })
// 'sha256:e3b0c44...'

// Verify a generation against a platform endpoint
const verification = await APP.verify(metadata.generation_id, 'https://verify.example.com/v1/verify')
// { found: true, ai_generated: true, generator: { ... }, ... }
```

## API

### `APP.create(options)` / `create(options)`

Creates a new APP metadata object. Automatically sets `app_version`, `generated_at` (current UTC time), and `generation_id` (UUID v4).

```typescript
const metadata = APP.create({
  generator: { platform: 'my-platform', model: 'openai/gpt-4o' },
  verification_uri: 'https://verify.example.com/v1/verify',
})
```

### `APP.embed(content, metadata)` / `embed(content, metadata)`

Embeds APP metadata into a JSON object under the `_ai_provenance` key.

```typescript
const output = APP.embed({ text: 'Hello world' }, metadata)
// { text: 'Hello world', _ai_provenance: { ... } }
```

### `APP.extract(output)` / `extract(output)`

Extracts APP metadata from an embedded JSON object, returning content and metadata separately.

```typescript
const { content, app } = APP.extract(output)
// content: { text: 'Hello world' }
// app: AppMetadata | null
```

### `APP.validate(metadata)` / `validate(metadata)`

Validates APP metadata against the v1.0 JSON Schema. Useful for validating metadata received from external systems.

```typescript
const result = APP.validate(unknownData)
if (!result.valid) {
  result.errors.forEach(e => console.error(`${e.field}: ${e.message}`))
}
```

### `APP.review(metadata, options)` / `review(metadata, options)`

Records a human review on an existing metadata object. Returns a new object — does not mutate the original.

```typescript
const reviewed = APP.review(metadata, {
  human_reviewed: true,
  reviewer_role: 'editor',
  review_type: 'edited',
  review_notes: 'Adjusted tone for brand guidelines.',
})
```

### `APP.hashContent(content, algorithm?)` / `hashContent(content, algorithm?)`

Computes a content hash for integrity verification. For JSON objects, uses canonical form (sorted keys, `_ai_provenance` excluded). Default algorithm is `sha256`.

```typescript
const hash = APP.hashContent({ title: 'My Article', body: '...' })
// 'sha256:e3b0c44298fc...'

const sha512Hash = APP.hashContent('plain text content', 'sha512')
// 'sha512:cf83e135...'
```

### `APP.verify(generationId, verificationUri)` / `verify(generationId, verificationUri)`

Level 1 verification: look up a generation ID at the platform's verification endpoint.

```typescript
const result = await APP.verify(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'https://verify.example.com/v1/verify'
)
if (result.found) {
  console.log('Verified:', result.generator?.model)
}
```

### `APP.match(contentHash, verificationUri, contentType?)` / `match(...)`

Level 2 verification: find generations matching a content hash.

```typescript
const result = await APP.match(
  'sha256:e3b0c44298fc...',
  'https://verify.example.com/v1/verify',
  'application/json'
)
console.log(`${result.matches.length} matching generation(s) found`)
```

## Named exports

All functions are also available as named exports for tree-shaking:

```typescript
import { create, embed, extract, validate, review, hashContent, verify, match } from '@ai-provenance-protocol/sdk'
```

## Types

All TypeScript types are exported:

```typescript
import type { AppMetadata, Generator, Review, ValidationResult } from '@ai-provenance-protocol/sdk'
```

## License

Apache 2.0 — see [LICENSE](../../LICENSE)
