from __future__ import annotations

from typing import TYPE_CHECKING, Optional

from pydantic import BaseModel, Field

if TYPE_CHECKING:
    from datetime import date

class Ingredient(BaseModel):
    """Model for an ingredient."""

    name: str
    quantity: float
    unit: str
    expiry_date: Optional[date] = Field(None)


class Ingredients(BaseModel):
    """Model for a list of ingredients."""

    ingredients: list[Ingredient]
