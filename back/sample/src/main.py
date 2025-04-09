from __future__ import annotations

import uuid
from datetime import date
from typing import Annotated, Optional, cast

from fastapi import FastAPI, Form, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DEFAULT_USER_ID = "joedoe"

# Define the models based on the OpenAPI specification
class Ingredient(BaseModel):
    """Model for an ingredient."""

    name: str
    quantity: float
    unit: str
    expiry_date: Optional[date] = None

class Ingredients(BaseModel):
    """Model for a list of ingredients."""

    ingredients: list[Ingredient]

class Equipment(BaseModel):
    """Model for a kitchen equipment."""

    name: str
    quantity: float

class Equipments(BaseModel):
    """Model for a list of kitchen equipments."""

    equipments: list[Equipment]

class UserPreferences(BaseModel):
    """Model for user dietary and budget preferences."""

    preferences: list[str]

class Recipe(BaseModel):
    """Model for a recipe."""

    id: str
    name: str
    description: str
    ingredients: list[Ingredient]
    required_equipment: list[str]

class RecommendedRecipes(BaseModel):
    """Model for recommended recipes."""

    recipes: list[Recipe]
    missing_ingredients: list[str]
    missing_equipment: list[str]

# Create FastAPI app
app = FastAPI(
    title="Picture-to-Palatable API",
    description="AI-Powered Home Cooking Assistant API",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database for demo purposes
# In a real application, you would use a proper database
db = {
    "users": {
        # Sample user data
        "user123": {
            "ingredients": Ingredients(ingredients=[
                Ingredient(name="Tomato", quantity=5, unit="pieces", expiry_date=date(2025, 4, 15)),
                Ingredient(name="Onion", quantity=3, unit="pieces", expiry_date=date(2025, 4, 20)),
            ]),
            "equipments": Equipments(equipments=[
                Equipment(name="Knife", quantity=2),
                Equipment(name="Pan", quantity=1),
            ]),
            "preferences": UserPreferences(preferences=["vegetarian", "gluten-free"]),
        },
    },
}

# Routes implementation
@app.post("/recommend", response_model=RecommendedRecipes)
async def recommend_recipe(
    userId: Annotated[str, Form()] = DEFAULT_USER_ID,
    text: Annotated[str, Form()] = "foo",
) -> RecommendedRecipes:
    """Recommend recipes based on user inventory and preferences."""
    # In a real application, this would call an AI model for recommendations
    # For demo purposes, return mock data

    # Check if user exists
    if userId not in db["users"]:
        # Create new user with empty data
        db["users"][userId] = {
            "ingredients": Ingredients(ingredients=[]),
            "equipments": Equipments(equipments=[]),
            "preferences": UserPreferences(preferences=[]),
        }

    # Generate a sample recommendation
    return RecommendedRecipes(
        recipes=[
            Recipe(
                id=str(uuid.uuid4()),
                name="Tomato Pasta",
                description="A simple and delicious tomato pasta dish.",
                ingredients=[
                    Ingredient(name="Tomato", quantity=3, unit="pieces"),
                    Ingredient(name="Pasta", quantity=200, unit="grams"),
                    Ingredient(name="Olive oil", quantity=2, unit="tablespoons"),
                ],
                required_equipment=["Pot", "Pan", "Knife"],
            ),
        ],
        missing_ingredients=["Pasta", "Olive oil"],
        missing_equipment=["Pot"],
    )

@app.get("/users/{userId}/ingredients", response_model=Ingredients)
async def get_inventory(
    userId: Annotated[str, Path()] = DEFAULT_USER_ID,
) -> Ingredients:
    """Get user inventory."""
    if userId not in db["users"]:
        raise HTTPException(status_code=404, detail="User not found")
    ingredients: Ingredients = cast(Ingredients, db["users"][userId]["ingredients"])
    return ingredients

@app.post("/users/{userId}/ingredients")
async def upsert_inventory(
    ingredients: Ingredients,
    userId: Annotated[str, Path()] = DEFAULT_USER_ID,
) -> dict:
    """Update user inventory."""
    if userId not in db["users"]:
        db["users"][userId] = {
            "ingredients": ingredients,
            "equipments": Equipments(equipments=[]),
            "preferences": UserPreferences(preferences=[]),
        }
    else:
        db["users"][userId]["ingredients"] = ingredients
    return {"message": "Inventory updated successfully"}

@app.get("/users/{userId}/equipments", response_model=Equipments)
async def get_equipment(
    userId: str = Path(...)
) -> Equipments:
    """Get user kitchen equipment."""
    if userId not in db["users"]:
        raise HTTPException(status_code=404, detail="User not found")
    equipments: Equipments = cast(Equipments, db["users"][userId]["equipments"])
    return equipments

@app.post("/users/{userId}/equipments")
async def upsert_equipment(
    equipments: Equipments,
    userId: Annotated[str, Path()] = DEFAULT_USER_ID,
) -> dict:
    """Update user kitchen equipment."""
    if userId not in db["users"]:
        db["users"][userId] = {
            "ingredients": Ingredients(ingredients=[]),
            "equipments": equipments,
            "preferences": UserPreferences(preferences=[]),
        }
    else:
        db["users"][userId]["equipments"] = equipments
    return {"message": "Equipment updated successfully"}

@app.get("/users/{userId}/preferences", response_model=UserPreferences)
async def get_dietary(
    userId: str = Path(...)
) -> UserPreferences:
    """Get user dietary and budget preferences."""
    if userId not in db["users"]:
        raise HTTPException(status_code=404, detail="User not found")
    user_preferences: UserPreferences = cast(UserPreferences, db["users"][userId]["preferences"])
    return user_preferences

@app.post("/users/{userId}/preferences")
async def upsert_dietary(
    preferences: UserPreferences,
    userId: Annotated[str, Path()] = DEFAULT_USER_ID,
) -> dict:
    """Update user dietary and budget preferences."""
    if userId not in db["users"]:
        db["users"][userId] = {
            "ingredients": Ingredients(ingredients=[]),
            "equipments": Equipments(equipments=[]),
            "preferences": preferences,
        }
    else:
        db["users"][userId]["preferences"] = preferences
    return {"message": "Dietary preferences updated successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
