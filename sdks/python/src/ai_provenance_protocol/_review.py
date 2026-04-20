"""Record a human review against an existing APP metadata record."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal, Optional

from ._types import AppMetadata, ReviewRecord

ReviewType = Literal[
    "approved_without_changes",
    "approved_with_changes",
    "redacted",
    "pending",
]


def review(
    metadata: AppMetadata,
    *,
    human_reviewed: bool,
    reviewer_role: Optional[str] = None,
    review_type: Optional[ReviewType] = None,
    reviewed_at: Optional[str] = None,
) -> AppMetadata:
    """Return a copy of *metadata* with a review record attached.

    Args:
        metadata: The original APP metadata record.
        human_reviewed: Whether a human reviewed the output.
        reviewer_role: The role of the reviewer (e.g. ``"editor"``).
        review_type: One of ``"approved_without_changes"``,
            ``"approved_with_changes"``, ``"redacted"``, or ``"pending"``.
        reviewed_at: ISO 8601 timestamp of the review. Defaults to now.

    Returns:
        A new :class:`AppMetadata` dict with the ``review`` field set.

    Example::

        approved = APP.review(
            metadata,
            human_reviewed=True,
            reviewer_role="editor",
            review_type="approved_without_changes",
        )
    """
    record: ReviewRecord = {"human_reviewed": human_reviewed}

    if reviewer_role is not None:
        record["reviewer_role"] = reviewer_role
    if review_type is not None:
        record["review_type"] = review_type

    record["reviewed_at"] = reviewed_at or datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    return {**metadata, "review": record}  # type: ignore[misc]
