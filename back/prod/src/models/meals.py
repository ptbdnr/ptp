from __future__ import annotations

from typing import TYPE_CHECKING

from pydantic import BaseModel

if TYPE_CHECKING:
    from models.ingredients import Ingredient


class Meal(BaseModel):
    """Model for a meal."""

    id: str
    name: str
    description: str
    ingredients: list[Ingredient]
    required_equipment: list[str]

class Meals(BaseModel):
    """Model for meals."""

    meals: list[Meal]
