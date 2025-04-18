from __future__ import annotations

from typing import List  # noqa: UP035

from pydantic import BaseModel, ConfigDict


class Equipment(BaseModel):
    """Model for a kitchen equipment."""

    model_config = ConfigDict(extra="forbid")
    id: str
    name: str
    quantity: float

class Equipments(BaseModel):
    """Model for a list of kitchen equipments."""

    equipments: List[Equipment]  # noqa: UP006
