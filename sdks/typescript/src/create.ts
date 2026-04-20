import { randomUUID } from 'node:crypto'
import type { AppMetadata, CreateOptions } from './types.js'

/**
 * Create a new APP metadata object for a generation event.
 * Automatically sets app_version, generated_at, and generation_id.
 */
export function create(options: CreateOptions): AppMetadata {
  const metadata: AppMetadata = {
    app_version: '1.0.0',
    ai_generated: options.ai_generated ?? true,
    generator: options.generator,
    generated_at: new Date().toISOString(),
    generation_id: randomUUID(),
  }

  if (options.inputs) metadata.inputs = options.inputs
  if (options.review) metadata.review = options.review
  if (options.usage) metadata.usage = options.usage
  if (options.verification_uri) metadata.verification_uri = options.verification_uri
  if (options.parent_generation_id) metadata.parent_generation_id = options.parent_generation_id
  if (options.extensions) metadata.extensions = options.extensions

  return metadata
}
