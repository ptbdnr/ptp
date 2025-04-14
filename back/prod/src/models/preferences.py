from __future__ import annotations

from pydantic import BaseModel


class UserPreferences(BaseModel):
    """Model for user dietary and budget preferences."""

    preferences: list[str]
