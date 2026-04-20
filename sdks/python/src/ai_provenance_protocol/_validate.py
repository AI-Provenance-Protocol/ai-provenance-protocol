"""Validate APP metadata against the official JSON Schema."""
from __future__ import annotations

import json
import pathlib
from functools import lru_cache
from typing import Any, Dict

import jsonschema
from jsonschema import Draft202012Validator

from ._types import AppMetadata, ValidationResult

_SCHEMA_PATH = pathlib.Path(__file__).parent / "schema" / "app-metadata.schema.json"


@lru_cache(maxsize=1)
def _get_validator() -> Draft202012Validator:
    schema = json.loads(_SCHEMA_PATH.read_text(encoding="utf-8"))
    return Draft202012Validator(schema)


def validate(metadata: Any) -> ValidationResult:
    """Validate *metadata* against the APP v1.0 JSON Schema.

    Args:
        metadata: The metadata object to validate — typically the
            ``_ai_provenance`` value extracted from content.

    Returns:
        A :class:`ValidationResult` with ``valid`` (bool) and ``errors``
        (list of human-readable error strings).

    Example::

        result = APP.validate(metadata)
        if not result["valid"]:
            for err in result["errors"]:
                print(err)
    """
    validator = _get_validator()
    errors = sorted(validator.iter_errors(metadata), key=lambda e: e.path)

    if not errors:
        return {"valid": True, "errors": []}

    messages = [
        f"{'.'.join(str(p) for p in e.absolute_path) or '(root)'}: {e.message}"
        for e in errors
    ]
    return {"valid": False, "errors": messages}
