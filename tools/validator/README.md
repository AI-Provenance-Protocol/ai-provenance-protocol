# app-validator

CLI tool for validating and verifying [AI Provenance Protocol](https://aiprovenanceprotocol.io) metadata.

## Usage

```bash
npx app-validator <command>
```

Or install globally:

```bash
npm install -g app-validator
```

## Commands

### `validate <file>`

Validate APP metadata in a JSON file.

```bash
# Validate a standalone APP metadata object
npx app-validator validate metadata.json

# Extract and validate _ai_provenance from a larger JSON document
npx app-validator validate product.json --extract

# Output as JSON (useful for CI pipelines)
npx app-validator validate metadata.json --json
```

**Exit codes:** `0` = valid, `1` = invalid, `2` = file/parse error

**Example output:**
```
✓ Valid APP metadata

  generation_id       a1b2c3d4-e5f6-7890-abcd-ef1234567890
  generator           anthropic/claude-sonnet-4 (my-platform)
  generated_at        2026-03-06T14:22:00Z
  ai_generated        true
  reviewed            false
  verification_uri    https://verify.example.com/v1/verify
```

**Example invalid output:**
```
✗ Invalid APP metadata (2 errors)

  /generation_id        must match format "uuid"
  /generator            must have required property 'model'
```

---

### `verify <generation-id> <verification-uri>`

Level 1 verification: confirm a generation ID exists at a platform's endpoint.

```bash
npx app-validator verify a1b2c3d4-e5f6-7890-abcd-ef1234567890 https://verify.example.com/v1/verify

# JSON output
npx app-validator verify <id> <uri> --json
```

**Exit codes:** `0` = found, `1` = not found, `2` = request error

---

### `hash <file>`

Compute a canonical content hash for a JSON file (for use with the `content_hash` field).

```bash
# Hash a JSON file
npx app-validator hash content.json

# Hash only the content, excluding _ai_provenance
npx app-validator hash output.json --extract

# Use a different algorithm
npx app-validator hash content.json --algorithm sha512
```

Output: `sha256:e3b0c44298fc1c149afbf4c8996fb924...`

---

## CI integration

```yaml
# GitHub Actions example
- name: Validate APP metadata
  run: npx app-validator validate ./output/metadata.json --json
```

## License

Apache 2.0 — see [LICENSE](../../LICENSE)
