import type { AppMetadata, Review, ReviewOptions } from './types.js'

/**
 * Record a human review on an existing APP metadata object.
 * Returns a new metadata object with the review field set.
 */
export function review(metadata: AppMetadata, options: ReviewOptions): AppMetadata {
  const reviewObj: Review = {
    human_reviewed: options.human_reviewed,
    reviewed_at: options.reviewed_at ?? new Date().toISOString(),
  }

  if (options.reviewer_role) reviewObj.reviewer_role = options.reviewer_role
  if (options.review_type) reviewObj.review_type = options.review_type
  if (options.review_notes) reviewObj.review_notes = options.review_notes

  return { ...metadata, review: reviewObj }
}
