import type { MatchResult, VerificationResult } from './types.js'

/**
 * Level 1 verification: look up a generation ID at the platform's verification endpoint.
 */
export async function verify(
  generationId: string,
  verificationUri: string
): Promise<VerificationResult> {
  const base = verificationUri.replace(/\/$/, '')
  const response = await fetch(`${base}/${generationId}`, {
    headers: { Accept: 'application/app+json, application/json' },
  })

  if (!response.ok) {
    throw new Error(
      `Verification endpoint returned ${response.status} ${response.statusText}`
    )
  }

  return response.json() as Promise<VerificationResult>
}

/**
 * Level 2 verification: find generations matching a content hash.
 */
export async function match(
  contentHash: string,
  verificationUri: string,
  contentType?: string
): Promise<MatchResult> {
  const base = verificationUri.replace(/\/$/, '')
  const body: Record<string, string> = { content_hash: contentHash }
  if (contentType) body.content_type = contentType

  const response = await fetch(`${base}/match`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/app+json, application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(
      `Verification endpoint returned ${response.status} ${response.statusText}`
    )
  }

  return response.json() as Promise<MatchResult>
}
