from __future__ import annotations

from typing import List, Optional, Union  # noqa: UP035

from pydantic import BaseModel, ConfigDict

from src.models.ingredients import Ingredient


class MealImages(BaseModel):
    """Model for meal images."""

    model_config = ConfigDict(extra="forbid")
    placeholder_emoji: str

class MealPreview(BaseModel):
    """Model for meal preview."""

    model_config = ConfigDict(extra="forbid")
    id: str
    name: str
    description: str
    images: MealImages

class Meal(MealPreview):
    """Model for a meal."""

    ingredients: Optional[List[Ingredient]]  # noqa: UP006

class Meals(BaseModel):
    """Model for meals."""

    meals: List[Union[Meal, MealPreview]]   # noqa: UP006


Meal.model_rebuild()
Meals.model_rebuild()
