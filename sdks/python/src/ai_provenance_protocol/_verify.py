"""Verification protocol — Level 1 (lookup) and Level 2 (content-hash match)."""
from __future__ import annotations

from typing import Any, Dict, Optional

import httpx

from ._types import AppMetadata, MatchResult, VerifyResult

DEFAULT_TIMEOUT = 10.0  # seconds


# ---------------------------------------------------------------------------
# Level 1 — generation lookup
# ---------------------------------------------------------------------------


async def verify(
    generation_id: str,
    verification_uri: str,
    *,
    timeout: float = DEFAULT_TIMEOUT,
) -> VerifyResult:
    """Async Level 1 verification: look up a generation by ID.

    Makes a ``GET {verification_uri}/{generation_id}`` request.

    Args:
        generation_id: The ``generation_id`` from the APP metadata.
        verification_uri: The ``verification_uri`` from the APP metadata.
        timeout: Request timeout in seconds.

    Returns:
        A :class:`VerifyResult` with ``found`` (bool) and optionally
        ``metadata`` if the server returns the full record.

    Example::

        result = await APP.verify(
            metadata["generation_id"],
            metadata["verification_uri"],
        )
    """
    url = f"{verification_uri.rstrip('/')}/{generation_id}"
    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.get(url)

    if response.status_code == 404:
        return {"found": False}

    response.raise_for_status()
    data: Dict[str, Any] = response.json()
    return {"found": True, "metadata": data}  # type: ignore[typeddict-item]


def verify_sync(
    generation_id: str,
    verification_uri: str,
    *,
    timeout: float = DEFAULT_TIMEOUT,
) -> VerifyResult:
    """Synchronous Level 1 verification. See :func:`verify` for details."""
    url = f"{verification_uri.rstrip('/')}/{generation_id}"
    with httpx.Client(timeout=timeout) as client:
        response = client.get(url)

    if response.status_code == 404:
        return {"found": False}

    response.raise_for_status()
    data: Dict[str, Any] = response.json()
    return {"found": True, "metadata": data}  # type: ignore[typeddict-item]


# ---------------------------------------------------------------------------
# Level 2 — content-hash match
# ---------------------------------------------------------------------------


async def match(
    content_hash: str,
    verification_uri: str,
    *,
    algorithm: str = "sha256",
    timeout: float = DEFAULT_TIMEOUT,
) -> MatchResult:
    """Async Level 2 verification: match content by hash.

    Makes a ``POST {verification_uri}/match`` request with
    ``{"content_hash": {"algorithm": ..., "value": ...}}``.

    Args:
        content_hash: The hex-encoded hash value.
        verification_uri: The ``verification_uri`` from the APP metadata.
        algorithm: Hash algorithm (default ``"sha256"``).
        timeout: Request timeout in seconds.

    Returns:
        A :class:`MatchResult` with ``match`` (bool) and optionally
        ``generation_id`` if a match was found.
    """
    url = f"{verification_uri.rstrip('/')}/match"
    payload = {"content_hash": {"algorithm": algorithm, "value": content_hash}}
    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.post(url, json=payload)

    response.raise_for_status()
    return response.json()


def match_sync(
    content_hash: str,
    verification_uri: str,
    *,
    algorithm: str = "sha256",
    timeout: float = DEFAULT_TIMEOUT,
) -> MatchResult:
    """Synchronous Level 2 verification. See :func:`match` for details."""
    url = f"{verification_uri.rstrip('/')}/match"
    payload = {"content_hash": {"algorithm": algorithm, "value": content_hash}}
    with httpx.Client(timeout=timeout) as client:
        response = client.post(url, json=payload)

    response.raise_for_status()
    return response.json()
