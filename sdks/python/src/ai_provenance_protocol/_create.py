"""Create APP metadata records."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from ._types import AppInput, AppMetadata, Generator

APP_VERSION = "1.0.0"


def create(
    *,
    generator: Generator,
    verification_uri: Optional[str] = None,
    inputs: Optional[AppInput] = None,
    generation_id: Optional[str] = None,
    parent_generation_id: Optional[str] = None,
    extensions: Optional[Dict[str, Any]] = None,
) -> AppMetadata:
    """Create a new APP metadata record.

    Args:
        generator: Information about the AI model/platform that generated the content.
        verification_uri: Base URI for verifying this generation.
        inputs: Optional list of inputs used to generate the content.
        generation_id: Override the auto-generated UUID v4 identifier.
        parent_generation_id: ID of the generation this was derived from.
        extensions: Vendor-specific extension data.

    Returns:
        A fully-populated AppMetadata dict ready to embed or store.

    Example::

        metadata = APP.create(
            generator={"platform": "my-platform", "model": "gpt-4o"},
            verification_uri="https://api.example.com/v1/verify",
        )
    """
    record: AppMetadata = {
        "app_version": APP_VERSION,
        "ai_generated": True,
        "generator": generator,
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "generation_id": generation_id or str(uuid.uuid4()),
    }

    if verification_uri is not None:
        record["verification_uri"] = verification_uri
    if inputs is not None:
        record["inputs"] = inputs
    if parent_generation_id is not None:
        record["parent_generation_id"] = parent_generation_id
    if extensions is not None:
        record["extensions"] = extensions

    return record
