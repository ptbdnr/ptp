from __future__ import annotations

from typing import List  # noqa: UP035

from pydantic import BaseModel, ConfigDict


class Ingredient(BaseModel):
    """Model for an ingredient."""

    model_config = ConfigDict(extra="forbid")
    id: str
    name: str
    quantity: float
    unit: str

class Ingredients(BaseModel):
    """Model for a list of ingredients."""

    model_config = ConfigDict(extra="forbid")
    ingredients: List[Ingredient]  # noqa: UP006
