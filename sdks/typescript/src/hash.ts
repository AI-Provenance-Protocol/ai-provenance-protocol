import { createHash } from 'node:crypto'
import type { HashAlgorithm } from './types.js'

/**
 * Produce the canonical string representation of a JSON object for hashing.
 * Removes the `_ai_provenance` key and sorts all object keys recursively.
 */
export function canonicalize(content: object): string {
  return JSON.stringify(sortKeys(removeAppKey(content)))
}

/**
 * Compute a content hash for integrity verification.
 * For JSON objects, uses canonical form (sorted keys, no _ai_provenance key).
 * For strings, hashes the raw UTF-8 bytes.
 *
 * Returns a string in the format `{algorithm}:{hex}`.
 */
export function hashContent(
  content: object | string,
  algorithm: HashAlgorithm = 'sha256'
): string {
  const data = typeof content === 'string' ? content : canonicalize(content)
  const hex = createHash(algorithm).update(data, 'utf8').digest('hex')
  return `${algorithm}:${hex}`
}

function removeAppKey(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(removeAppKey)
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      if (k !== '_ai_provenance') result[k] = removeAppKey(v)
    }
    return result
  }
  return value
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as object)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, sortKeys(v)])
    )
  }
  return value
}
