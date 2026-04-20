import type { AppMetadata, EmbeddedOutput, ExtractResult } from './types.js'

/**
 * Embed APP metadata into a JSON output object under the `_ai_provenance` key.
 */
export function embed<T extends object>(
  content: T,
  metadata: AppMetadata
): EmbeddedOutput<T> {
  return { ...content, _ai_provenance: metadata }
}

/**
 * Extract APP metadata from a JSON output object.
 * Returns the content without the `_ai_provenance` key and the metadata separately.
 */
export function extract<T extends object>(
  output: T
): ExtractResult<Omit<T, '_ai_provenance'>> {
  const { _ai_provenance, ...content } = output as T & {
    _ai_provenance?: AppMetadata
  }
  return {
    content: content as Omit<T, '_ai_provenance'>,
    app: _ai_provenance ?? null,
  }
}
