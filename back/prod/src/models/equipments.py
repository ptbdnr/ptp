from __future__ import annotations

from pydantic import BaseModel


class Equipment(BaseModel):
    """Model for a kitchen equipment."""

    name: str
    quantity: float

class Equipments(BaseModel):
    """Model for a list of kitchen equipments."""

    equipments: list[Equipment]
