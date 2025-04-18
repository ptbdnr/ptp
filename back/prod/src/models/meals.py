from __future__ import annotations

from typing import List, Optional, Union  # noqa: UP035

from pydantic import BaseModel, ConfigDict

from src.models.ingredients import Ingredient


# docscrigs are above the class definition
# becase the scema will use the docsring stored inside the class
"""Model for meal images."""
class MealImages(BaseModel):

    model_config = ConfigDict(extra="forbid")
    placeholder_emoji: str

"""Model for meal preview."""
class MealPreview(BaseModel):

    model_config = ConfigDict(extra="forbid")
    id: str
    name: str
    description: str
    images: MealImages

"""Model for a meal."""
class Meal(MealPreview):

    ingredients: Optional[List[Ingredient]]  # noqa: UP006

class Meals(BaseModel):
    """Model for meals."""

    meals: List[Union[Meal, MealPreview]]   # noqa: UP006


Meal.model_rebuild()
Meals.model_rebuild()
