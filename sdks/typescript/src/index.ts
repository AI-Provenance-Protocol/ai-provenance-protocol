export { create } from './create.js'
export { embed, extract } from './embed.js'
export { hashContent, canonicalize } from './hash.js'
export { validate } from './validate.js'
export { review } from './review.js'
export { verify, match } from './verify.js'
export type {
  AppMetadata,
  CreateOptions,
  EmbeddedOutput,
  ExtractResult,
  Generator,
  HashAlgorithm,
  InputItem,
  InputItemKind,
  InputType,
  Inputs,
  MatchResult,
  Review,
  ReviewOptions,
  ReviewType,
  Usage,
  ValidationError,
  ValidationResult,
  VerificationResult,
} from './types.js'

// Convenience namespace — import { APP } from '@ai-provenance-protocol/sdk'
import { create } from './create.js'
import { embed, extract } from './embed.js'
import { hashContent, canonicalize } from './hash.js'
import { validate } from './validate.js'
import { review } from './review.js'
import { verify, match } from './verify.js'

export const APP = {
  create,
  embed,
  extract,
  hashContent,
  canonicalize,
  validate,
  review,
  verify,
  match,
} as const
