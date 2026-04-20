# `ai-provenance-protocol` — Python SDK

Official Python SDK for the [AI Provenance Protocol (APP)](https://aiprovenanceprotocol.io) — an open standard for recording, embedding, and verifying the provenance of AI-generated content.

[![PyPI version](https://img.shields.io/pypi/v/ai-provenance-protocol)](https://pypi.org/project/ai-provenance-protocol/)
[![Python versions](https://img.shields.io/pypi/pyversions/ai-provenance-protocol)](https://pypi.org/project/ai-provenance-protocol/)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](../../LICENSE)

## Installation

```bash
pip install ai-provenance-protocol
```

## Quick Start

```python
from ai_provenance_protocol import APP

# 1. Create metadata after your AI call
metadata = APP.create(
    generator={"platform": "my-platform", "model": "gpt-4o"},
    verification_uri="https://api.example.com/v1/verify",
)

# 2. Embed it in your JSON response
output = APP.embed({"reply": "Hello, world!"}, metadata)
# output == {"reply": "Hello, world!", "_ai_provenance": {...}}

# 3. Validate it
result = APP.validate(metadata)
# result == {"valid": True, "errors": []}
```

## API Reference

### `APP.create()`

Creates a new APP metadata record.

```python
metadata = APP.create(
    generator={"platform": "acme-ai", "model": "acme/text-v3"},
    verification_uri="https://api.acme.com/verify",
    # Optional
    inputs=[{"type": "prompt", "value": "Write a product description"}],
    generation_id="550e8400-e29b-41d4-a716-446655440000",  # auto-generated if omitted
    parent_generation_id="...",
    extensions={"io.acme": {"tenant_id": "t_123"}},
)
```

### `APP.embed()` / `APP.extract()`

Embed metadata into any dict, or pull it back out.

```python
output = APP.embed({"answer": "42"}, metadata)

content, meta = APP.extract(output)
# content == {"answer": "42"}
# meta    == {...}  or  None if no metadata present
```

### `APP.validate()`

Validate any dict against the APP v1.0 JSON Schema (bundled — no network call).

```python
result = APP.validate(metadata)
if not result["valid"]:
    for err in result["errors"]:
        print(err)
```

### `APP.review()`

Record a human review decision.

```python
approved = APP.review(
    metadata,
    human_reviewed=True,
    reviewer_role="editor",
    review_type="approved_without_changes",
)
```

### `APP.hash_content()`

Compute a deterministic SHA-256 hash of content (canonical JSON, sorted keys).

```python
h = APP.hash_content({"answer": "42"})
# h == {"algorithm": "sha256", "value": "<hex>"}

metadata_with_hash = APP.attach_hash(metadata, content)
```

### `APP.verify()` / `APP.verify_sync()`

Level 1 verification — look up a generation ID at the verification endpoint.

```python
# Async
result = await APP.verify(
    metadata["generation_id"],
    metadata["verification_uri"],
)

# Sync
result = APP.verify_sync(
    metadata["generation_id"],
    metadata["verification_uri"],
)

# result == {"found": True, "metadata": {...}}
```

### `APP.match()` / `APP.match_sync()`

Level 2 verification — match content by hash at the verification endpoint.

```python
h = APP.hash_content(content)
result = APP.match_sync(h["value"], metadata["verification_uri"])
# result == {"match": True, "generation_id": "..."}
```

## Direct imports

All functions are also importable directly from the package:

```python
from ai_provenance_protocol import create, embed, extract, validate, review
from ai_provenance_protocol import hash_content, attach_hash, canonicalize
from ai_provenance_protocol import verify, verify_sync, match, match_sync
```

## Type hints

Full `TypedDict` types are exported for use in type-checked code:

```python
from ai_provenance_protocol import AppMetadata, Generator, ValidationResult
```

## Live example

[merchi.ai](https://merchi.ai) is the first conformant reference implementation. You can verify a live generation:

```bash
pip install ai-provenance-protocol httpx
python -c "
from ai_provenance_protocol import APP
result = APP.verify_sync(
    'a6986899-bb06-461b-bbf7-c689cad09cbd',
    'https://app.merchi.ai/api/functions/v1/verify',
)
print(result)
"
```

## License

Apache 2.0 — see [LICENSE](../../LICENSE).
