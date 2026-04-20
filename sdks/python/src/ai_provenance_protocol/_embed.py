"""Embed and extract APP metadata in JSON-serialisable dicts."""
from __future__ import annotations

from typing import Any, Dict, Optional, Tuple

from ._types import AppMetadata

METADATA_KEY = "_ai_provenance"


def embed(content: Dict[str, Any], metadata: AppMetadata) -> Dict[str, Any]:
    """Embed APP metadata into a content dict.

    Adds the ``_ai_provenance`` key to a copy of *content*.

    Args:
        content: The JSON-serialisable dict to annotate.
        metadata: The APP metadata record to embed.

    Returns:
        A new dict that is ``{**content, "_ai_provenance": metadata}``.

    Example::

        output = APP.embed({"reply": "Hello!"}, metadata)
        # output["_ai_provenance"]["generation_id"] == ...
    """
    return {**content, METADATA_KEY: metadata}


def extract(content: Dict[str, Any]) -> Tuple[Dict[str, Any], Optional[AppMetadata]]:
    """Extract APP metadata from a content dict.

    Args:
        content: A dict that may contain a ``_ai_provenance`` key.

    Returns:
        A 2-tuple of ``(content_without_metadata, metadata_or_None)``.

    Example::

        clean, meta = APP.extract(api_response)
        if meta:
            print(meta["generation_id"])
    """
    if METADATA_KEY not in content:
        return content, None

    metadata: AppMetadata = content[METADATA_KEY]
    clean = {k: v for k, v in content.items() if k != METADATA_KEY}
    return clean, metadata
