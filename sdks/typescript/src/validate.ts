import type { ValidationResult } from './types.js'
import schema from './schema/app-metadata.schema.json'

// Dynamic imports to avoid ESM/CJS interop issues with ajv's dist paths
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Ajv2020 = require('ajv/dist/2020')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const addFormats = require('ajv-formats')

const AjvConstructor = Ajv2020.default ?? Ajv2020
const ajv = new AjvConstructor({ allErrors: true })
const applyFormats = addFormats.default ?? addFormats
applyFormats(ajv)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateFn = ajv.compile(schema as any)

/**
 * Validate an APP metadata object against the v1.0 JSON Schema.
 * Works on any unknown value — useful for validating parsed JSON from external sources.
 */
export function validate(metadata: unknown): ValidationResult {
  const valid = validateFn(metadata) as boolean
  if (valid) {
    return { valid: true, errors: [] }
  }
  return {
    valid: false,
    errors: (
      (validateFn.errors ?? []) as Array<{
        instancePath: string
        message?: string
      }>
    ).map(err => ({
      field: err.instancePath || '(root)',
      message: err.message ?? 'Unknown validation error',
    })),
  }
}
