import { Command } from 'commander'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import Ajv from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import pc from 'picocolors'
import schema from './schema/app-metadata.schema.json'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
const validateFn = ajv.compile(schema)

const program = new Command()

program
  .name('app-validator')
  .description('AI Provenance Protocol — metadata validator and verifier')
  .version('1.0.0')

// ─── validate ────────────────────────────────────────────────────────────────

program
  .command('validate <file>')
  .description('Validate APP metadata in a JSON file')
  .option('--extract', 'Extract _ai_provenance from a larger JSON document')
  .option('--json', 'Output results as JSON')
  .action((file: string, opts: { extract?: boolean; json?: boolean }) => {
    let raw: string
    try {
      raw = readFileSync(file, 'utf8')
    } catch {
      error(`Cannot read file: ${file}`)
      process.exit(2)
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      error('File is not valid JSON')
      process.exit(2)
    }

    let target = parsed
    if (opts.extract) {
      const doc = parsed as Record<string, unknown>
      if (!doc._ai_provenance) {
        error('No _ai_provenance key found in document')
        process.exit(2)
      }
      target = doc._ai_provenance
    }

    const valid = validateFn(target)

    if (opts.json) {
      const out = {
        valid,
        errors: valid
          ? []
          : (validateFn.errors ?? []).map(e => ({
              field: e.instancePath || '(root)',
              message: e.message,
            })),
      }
      console.log(JSON.stringify(out, null, 2))
      process.exit(valid ? 0 : 1)
    }

    if (valid) {
      const meta = target as Record<string, unknown>
      const gen = meta.generator as Record<string, string> | undefined
      console.log()
      console.log(pc.green('✓') + ' ' + pc.bold('Valid APP metadata'))
      console.log()
      row('generation_id', String(meta.generation_id ?? ''))
      row('generator', gen ? `${gen.model} (${gen.platform})` : '')
      row('generated_at', String(meta.generated_at ?? ''))
      row('ai_generated', String(meta.ai_generated))
      const rev = meta.review as Record<string, unknown> | undefined
      row('reviewed', rev ? String(rev.human_reviewed) : 'false')
      if (meta.verification_uri) row('verification_uri', String(meta.verification_uri))
      if (meta.content_hash) row('content_hash', String(meta.content_hash))
      console.log()
      process.exit(0)
    } else {
      const count = validateFn.errors?.length ?? 0
      console.log()
      console.log(
        pc.red('✗') + ' ' + pc.bold(`Invalid APP metadata`) +
        pc.dim(` (${count} error${count !== 1 ? 's' : ''})`)
      )
      console.log()
      for (const err of validateFn.errors ?? []) {
        const field = err.instancePath || '(root)'
        console.log(`  ${pc.yellow(field.padEnd(20))}  ${err.message}`)
      }
      console.log()
      process.exit(1)
    }
  })

// ─── verify ──────────────────────────────────────────────────────────────────

program
  .command('verify <generation-id> <verification-uri>')
  .description('Verify a generation ID against a platform verification endpoint')
  .option('--json', 'Output results as JSON')
  .action(async (generationId: string, verificationUri: string, opts: { json?: boolean }) => {
    const url = `${verificationUri.replace(/\/$/, '')}/${generationId}`

    let data: Record<string, unknown>
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/app+json, application/json' },
      })
      if (!res.ok) {
        error(`Endpoint returned ${res.status} ${res.statusText}`)
        process.exit(2)
      }
      data = (await res.json()) as Record<string, unknown>
    } catch (e) {
      error(`Request failed: ${(e as Error).message}`)
      process.exit(2)
    }

    if (opts.json) {
      console.log(JSON.stringify(data, null, 2))
      process.exit(data.found ? 0 : 1)
    }

    console.log()
    if (data.found) {
      const gen = data.generator as Record<string, string> | undefined
      const rev = data.review as Record<string, unknown> | undefined
      console.log(pc.green('✓') + ' ' + pc.bold('Generation found'))
      console.log()
      row('generation_id', generationId)
      if (gen) {
        row('platform', gen.platform)
        row('model', gen.model)
      }
      row('generated_at', String(data.generated_at ?? ''))
      row('ai_generated', String(data.ai_generated ?? ''))
      row('reviewed', rev ? String(rev.human_reviewed) : 'unknown')
      console.log()
      process.exit(0)
    } else {
      console.log(pc.red('✗') + ' ' + pc.bold('Generation not found'))
      console.log()
      process.exit(1)
    }
  })

// ─── hash ────────────────────────────────────────────────────────────────────

program
  .command('hash <file>')
  .description('Compute a canonical SHA-256 content hash for a JSON file')
  .option('--algorithm <alg>', 'Hash algorithm: sha256, sha384, sha512', 'sha256')
  .option('--extract', 'Hash only the content, excluding the _ai_provenance key')
  .action((file: string, opts: { algorithm: string; extract?: boolean }) => {
    let raw: string
    try {
      raw = readFileSync(file, 'utf8')
    } catch {
      error(`Cannot read file: ${file}`)
      process.exit(2)
    }

    let content: unknown
    try {
      content = JSON.parse(raw)
    } catch {
      // Not JSON — hash raw bytes
      const hex = createHash(opts.algorithm).update(raw, 'utf8').digest('hex')
      console.log(`${opts.algorithm}:${hex}`)
      process.exit(0)
    }

    if (opts.extract && typeof content === 'object' && content !== null) {
      const { _ai_provenance, ...rest } = content as Record<string, unknown>
      void _ai_provenance
      content = rest
    }

    const canonical = JSON.stringify(sortKeys(content))
    const hex = createHash(opts.algorithm).update(canonical, 'utf8').digest('hex')
    console.log(`${opts.algorithm}:${hex}`)
    process.exit(0)
  })

// ─── helpers ─────────────────────────────────────────────────────────────────

function row(label: string, value: string) {
  console.log(`  ${pc.dim(label.padEnd(18))}  ${value}`)
}

function error(msg: string) {
  console.error(pc.red('error') + ' ' + msg)
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

program.parse()
