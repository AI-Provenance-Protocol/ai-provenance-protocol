"""Content hashing utilities."""
from __future__ import annotations

import hashlib
import json
from typing import Any, Dict

from ._types import AppMetadata, ContentHash


def canonicalize(content: Any) -> str:
    """Produce a canonical JSON representation of *content*.

    Keys are sorted and whitespace is stripped so the same logical object
    always produces the same byte string regardless of insertion order.

    Args:
        content: Any JSON-serialisable value.

    Returns:
        A compact, deterministic JSON string.
    """
    return json.dumps(content, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def hash_content(content: Any, *, algorithm: str = "sha256") -> ContentHash:
    """Compute a SHA-256 content hash of the canonical JSON representation.

    Args:
        content: Any JSON-serialisable value.
        algorithm: Hash algorithm identifier (currently only ``"sha256"`` is
            supported by the APP v1.0 specification).

    Returns:
        A :class:`ContentHash` dict with ``algorithm`` and ``value`` fields.

    Example::

        h = APP.hash_content({"reply": "Hello!"})
        # h == {"algorithm": "sha256", "value": "<hex>"}
    """
    if algorithm != "sha256":
        raise ValueError(f"Unsupported algorithm '{algorithm}'. Only 'sha256' is supported.")

    canonical = canonicalize(content)
    digest = hashlib.sha256(canonical.encode("utf-8")).hexdigest()
    return {"algorithm": algorithm, "value": digest}


def attach_hash(metadata: AppMetadata, content: Any) -> AppMetadata:
    """Compute and attach a content hash to an existing metadata record.

    Returns a *new* metadata dict with the ``content_hash`` field populated.

    Args:
        metadata: An existing APP metadata record.
        content: The content to hash (``_ai_provenance`` key is excluded if
            *content* is a dict).

    Returns:
        A new AppMetadata dict with ``content_hash`` set.
    """
    if isinstance(content, dict):
        content = {k: v for k, v in content.items() if k != "_ai_provenance"}

    return {**metadata, "content_hash": hash_content(content)}  # type: ignore[misc]
