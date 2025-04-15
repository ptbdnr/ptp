from __future__ import annotations

from typing import List  # noqa: UP035

from pydantic import BaseModel
from src.models.ingredients import Ingredient


class Meal(BaseModel):
    """Model for a meal."""

    id: str
    name: str
    description: str
    ingredients: List[Ingredient]  # noqa: UP006
    required_equipment: List[str]   # noqa: UP006

class Meals(BaseModel):
    """Model for meals."""

    meals: List[Meal]   # noqa: UP006


Meal.model_rebuild()
Meals.model_rebuild()
