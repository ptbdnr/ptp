from __future__ import annotations

from typing import List  # noqa: UP035

from pydantic import BaseModel


class UserPreferences(BaseModel):
    """Model for user dietary and budget preferences."""

    preferences: List[str]  # noqa: UP006
