export type HashAlgorithm = 'sha256' | 'sha384' | 'sha512'

export interface Generator {
  platform: string
  model: string
  platform_version?: string
}

export type InputType = 'text' | 'structured' | 'multimodal' | 'code' | 'other'

export type InputItemKind =
  | 'text'
  | 'image'
  | 'data'
  | 'code'
  | 'audio'
  | 'video'
  | 'document'
  | 'other'

export interface InputItem {
  kind: InputItemKind
  ref?: string
  hash?: string
  fields?: string[]
}

export interface Inputs {
  type: InputType
  description?: string
  items?: InputItem[]
  prompt_ref?: string
}

export type ReviewType =
  | 'approved_without_changes'
  | 'edited'
  | 'rejected'
  | 'pending'

export interface Review {
  human_reviewed: boolean
  reviewer_role?: string
  reviewed_at?: string
  review_type?: ReviewType
  review_notes?: string
}

export interface Usage {
  input_tokens?: number
  output_tokens?: number
  total_tokens?: number
  duration_ms?: number
}

export interface AppMetadata {
  app_version: string
  ai_generated: boolean
  generator: Generator
  generated_at: string
  generation_id: string
  inputs?: Inputs
  review?: Review
  usage?: Usage
  verification_uri?: string
  parent_generation_id?: string
  content_hash?: string
  extensions?: Record<string, Record<string, unknown>>
}

export interface CreateOptions {
  generator: Generator
  ai_generated?: boolean
  inputs?: Inputs
  review?: Review
  usage?: Usage
  verification_uri?: string
  parent_generation_id?: string
  extensions?: Record<string, Record<string, unknown>>
}

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export interface ReviewOptions {
  human_reviewed: boolean
  reviewer_role?: string
  review_type?: ReviewType
  review_notes?: string
  reviewed_at?: string
}

export interface VerificationResult {
  found: boolean
  app_version?: string
  ai_generated?: boolean
  generator?: Generator
  generated_at?: string
  review?: Review
  [key: string]: unknown
}

export interface MatchResult {
  matches: Array<{
    generation_id: string
    ai_generated: boolean
    generator: Generator
    generated_at: string
  }>
}

export type EmbeddedOutput<T> = T & { _ai_provenance: AppMetadata }

export interface ExtractResult<T> {
  content: T
  app: AppMetadata | null
}
