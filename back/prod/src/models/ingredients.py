from __future__ import annotations

from datetime import date
from typing import List, Optional  # noqa: UP035

from pydantic import BaseModel, Field


class Ingredient(BaseModel):
    """Model for an ingredient."""

    name: str
    quantity: float
    unit: str
    expiry_date: Optional[date] = Field(None)


class Ingredients(BaseModel):
    """Model for a list of ingredients."""

    ingredients: List[Ingredient]  # noqa: UP006
