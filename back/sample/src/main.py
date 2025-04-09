import uuid
from datetime import date
from typing import List, Optional

from fastapi import FastAPI, Form, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# Define the models based on the OpenAPI specification
class Ingredient(BaseModel):
    name: str
    quantity: float
    unit: str
    expiryDate: Optional[date] = None

class Ingredients(BaseModel):
    ingredients: List[Ingredient]

class Equipment(BaseModel):
    name: str
    quantity: float

class Equipments(BaseModel):
    equipments: List[Equipment]

class UserPreferences(BaseModel):
    preferences: List[str]

class Recipe(BaseModel):
    id: str
    name: str
    description: str
    ingredients: List[Ingredient]
    requiredEquipment: List[str]

class RecommendedRecipes(BaseModel):
    recipes: List[Recipe]
    missingIngredients: List[str]
    missingEquipment: List[str]

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
                Ingredient(name="Tomato", quantity=5, unit="pieces", expiryDate=date(2025, 4, 15)),
                Ingredient(name="Onion", quantity=3, unit="pieces", expiryDate=date(2025, 4, 20)),
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
    userId: str = Form(...),
    text: str = Form(...),
):
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
                requiredEquipment=["Pot", "Pan", "Knife"],
            ),
        ],
        missingIngredients=["Pasta", "Olive oil"],
        missingEquipment=["Pot"],
    )

@app.get("/users/{userId}/ingredients", response_model=Ingredients)
async def get_inventory(userId: str = Path(...)):
    if userId not in db["users"]:
        raise HTTPException(status_code=404, detail="User not found")
    return db["users"][userId]["ingredients"]

@app.post("/users/{userId}/ingredients")
async def upsert_inventory(ingredients: Ingredients, userId: str = Path(...)):
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
async def get_equipment(userId: str = Path(...)):
    if userId not in db["users"]:
        raise HTTPException(status_code=404, detail="User not found")
    return db["users"][userId]["equipments"]

@app.post("/users/{userId}/equipments")
async def upsert_equipment(equipments: Equipments, userId: str = Path(...)):
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
async def get_dietary(userId: str = Path(...)):
    if userId not in db["users"]:
        raise HTTPException(status_code=404, detail="User not found")
    return db["users"][userId]["preferences"]

@app.post("/users/{userId}/preferences")
async def upsert_dietary(preferences: UserPreferences, userId: str = Path(...)):
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
