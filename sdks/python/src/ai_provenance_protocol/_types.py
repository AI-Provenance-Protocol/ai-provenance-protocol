"""TypedDict definitions for the AI Provenance Protocol."""
from __future__ import annotations

from typing import Any, Dict, Literal, Optional
from typing_extensions import NotRequired, TypedDict


class Generator(TypedDict):
    platform: NotRequired[str]
    model: NotRequired[str]
    version: NotRequired[str]


class ReviewRecord(TypedDict):
    human_reviewed: bool
    reviewer_role: NotRequired[str]
    review_type: NotRequired[Literal["approved_without_changes", "approved_with_changes", "redacted", "pending"]]
    reviewed_at: NotRequired[str]


class UsageStats(TypedDict):
    prompt_tokens: NotRequired[int]
    completion_tokens: NotRequired[int]
    total_tokens: NotRequired[int]


class ContentHash(TypedDict):
    algorithm: str
    value: str


class AppInput(TypedDict, total=False):
    type: Literal["text", "structured", "multimodal", "code", "other"]
    description: str
    value: Any


class AppMetadata(TypedDict):
    app_version: str
    ai_generated: bool
    generator: Generator
    generated_at: str
    generation_id: str
    inputs: NotRequired[AppInput]
    review: NotRequired[ReviewRecord]
    usage: NotRequired[UsageStats]
    verification_uri: NotRequired[str]
    parent_generation_id: NotRequired[str]
    content_hash: NotRequired[ContentHash]
    extensions: NotRequired[Dict[str, Any]]


class ValidationResult(TypedDict):
    valid: bool
    errors: List[str]


class VerifyResult(TypedDict):
    found: bool
    metadata: NotRequired[AppMetadata]


class MatchResult(TypedDict):
    match: bool
    generation_id: NotRequired[str]
