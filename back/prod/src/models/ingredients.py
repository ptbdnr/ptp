from __future__ import annotations

from typing import List  # noqa: UP035

from pydantic import BaseModel, ConfigDict

# docscrigs are above the class definition
# becase the scema will use the docsring stored inside the class
"""Model for an ingredient."""
class Ingredient(BaseModel):

    model_config = ConfigDict(extra="forbid")
    id: str
    name: str
    quantity: float
    unit: str


"""Model for a list of ingredients."""
class Ingredients(BaseModel):

    model_config = ConfigDict(extra="forbid")
    ingredients: List[Ingredient]  # noqa: UP006
