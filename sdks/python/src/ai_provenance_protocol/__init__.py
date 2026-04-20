"""AI Provenance Protocol — Python SDK.

Quickstart::

    from ai_provenance_protocol import APP

    metadata = APP.create(
        generator={"platform": "my-platform", "model": "gpt-4o"},
        verification_uri="https://api.example.com/v1/verify",
    )
    output = APP.embed({"reply": "Hello, world!"}, metadata)

All public functions are also importable directly::

    from ai_provenance_protocol import create, embed, extract, validate
"""
from __future__ import annotations

from types import SimpleNamespace

from ._create import create
from ._embed import embed, extract
from ._hash import attach_hash, canonicalize, hash_content
from ._review import review
from ._types import (
    AppInput,
    AppMetadata,
    ContentHash,
    Generator,
    MatchResult,
    ReviewRecord,
    UsageStats,
    ValidationResult,
    VerifyResult,
)
from ._validate import validate
from ._verify import match, match_sync, verify, verify_sync

__version__ = "1.0.0"
__all__ = [
    # Namespace convenience
    "APP",
    # Core functions
    "create",
    "embed",
    "extract",
    "hash_content",
    "canonicalize",
    "attach_hash",
    "validate",
    "review",
    "verify",
    "verify_sync",
    "match",
    "match_sync",
    # Types
    "AppMetadata",
    "Generator",
    "ReviewRecord",
    "UsageStats",
    "ContentHash",
    "AppInput",
    "ValidationResult",
    "VerifyResult",
    "MatchResult",
]

APP = SimpleNamespace(
    create=create,
    embed=embed,
    extract=extract,
    hash_content=hash_content,
    canonicalize=canonicalize,
    attach_hash=attach_hash,
    validate=validate,
    review=review,
    verify=verify,
    verify_sync=verify_sync,
    match=match,
    match_sync=match_sync,
)
