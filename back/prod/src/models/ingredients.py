from __future__ import annotations

from datetime import date
from typing import List, Optional  # noqa: UP035

from pydantic import BaseModel, Field, ConfigDict


class Ingredient(BaseModel):
    """Model for an ingredient."""

    model_config = ConfigDict(extra="forbid")
    name: str
    quantity: float
    unit: str


class Ingredients(BaseModel):
    """Model for a list of ingredients."""

    model_config = ConfigDict(extra="forbid")
    ingredients: List[Ingredient]  # noqa: UP006
