from __future__ import annotations

import logging
import os
from datetime import date
from typing import Annotated, cast

import dotenv
from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.models.equipments import Equipment, Equipments
from src.models.ingredients import Ingredient, Ingredients
from src.models.meals import Meals, MealPreview
from src.models.preferences import UserPreferences
from src.recommender.meal_generator import MealGenerator
from src.text_to_img.meal_image import MealImageGenerator
from src.text_to_schema.ingredient_parser import IngredientParser

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

dotenv.load_dotenv("./.env.local")

DEFAULT_USER_ID = "kxsb"

# Create FastAPI app
app = FastAPI(
    title="Picture-to-Palatable API",
    description="AI-Powered Home Cooking Assistant API",
    version="1.0.0",
)

# Get allowed origins from environment variable or use default
allowed_origins = os.environ.get("CORS_ORIGINS", "*").split(",")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database for demo purposes
# In a real application, you would use a proper database
db = {
    "users": {
        # Sample user data
        DEFAULT_USER_ID: {
            "ingredients": Ingredients(ingredients=[
                Ingredient(id="1", name="Tomato", quantity=5, unit="pieces"),
                Ingredient(id="1", name="Onion", quantity=3, unit="pieces"),
            ]),
            "equipments": Equipments(equipments=[
                Equipment(id="1", name="Knife", quantity=2),
                Equipment(id="2", name="Pan", quantity=1),
            ]),
            "preferences": UserPreferences(preferences=["vegetarian", "gluten-free"]),
        },
    },
}

class RecommendRequestBody(BaseModel):
    userId: str
    dietaryPreferences: list[str]
    maxPrepTime: int
    ingredients: list[Ingredient] = []

# Routes implementation
@app.post("/recommend", response_model=Meals)
async def recommend_meal(
    request_body: RecommendRequestBody,
) -> Meals:
    """Recommend meals based on user inventory and preferences."""
    # Check if user exists
    user_id = request_body.userId
    dietary_preferences = request_body.dietaryPreferences
    max_prep_time = request_body.maxPrepTime
    ingredients = request_body.ingredients
    logger.info("Received request: %s", request_body)

    recommender = MealGenerator(provider="openai")
    meals: Meals = recommender.recommend(
        model=MealPreview,
        dietary_preferences=dietary_preferences,
        max_prep_time=max_prep_time,
        ingredients=ingredients,
        min_num_meals=3,
        max_num_meals=5,
    )
    return meals

    # if user_id not in db["users"]:
    #     # Create new user with empty data
    #     db["users"][user_id] = {
    #         "ingredients": Ingredients(ingredients=[]),
    #         "equipments": Equipments(equipments=[]),
    #         "preferences": UserPreferences(preferences=[]),
    #     }

    # # Generate a sample recommendation
    # return Meals(
    #     meals=[
    #         Meal(
    #             id=str(uuid.uuid4()),
    #             name="Tomato Pasta",
    #             description="A simple and delicious tomato pasta dish.",
    #             ingredients=[
    #                 Ingredient(name="Tomato", quantity=3, unit="pieces"),
    #                 Ingredient(name="Pasta", quantity=200, unit="grams"),
    #                 Ingredient(name="Olive oil", quantity=2, unit="tablespoons"),
    #             ],
    #             required_equipment=["Pot", "Pan", "Knife"],
    #         ),
    #     ],
    # )

@app.get("/users/{userId}/ingredients", response_model=Ingredients)
async def get_ingredients(
    userId: Annotated[str, Path()],
) -> Ingredients:
    """Get user inventory."""
    if userId not in db["users"]:
        raise HTTPException(status_code=404, detail="User not found")
    ingredients: Ingredients = cast("Ingredients", db["users"][userId]["ingredients"])
    return ingredients

@app.post("/users/{userId}/ingredients")
async def upsert_ingredients(
    userId: Annotated[str, Path()],
    ingredients: Ingredients,
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
    userId: str = Path(...),
) -> Equipments:
    """Get user kitchen equipment."""
    if userId not in db["users"]:
        raise HTTPException(status_code=404, detail="User not found")
    equipments: Equipments = cast("Equipments", db["users"][userId]["equipments"])
    return equipments

@app.post("/users/{userId}/equipments")
async def upsert_equipment(
    userId: Annotated[str, Path()],
    equipments: Equipments,
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
    userId: str = Path(...),
) -> UserPreferences:
    """Get user dietary and budget preferences."""
    if userId not in db["users"]:
        raise HTTPException(status_code=404, detail="User not found")
    user_preferences: UserPreferences = cast("UserPreferences", db["users"][userId]["preferences"])
    return user_preferences

@app.post("/users/{userId}/preferences")
async def upsert_dietary(
    userId: Annotated[str, Path()],
    preferences: UserPreferences,
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

@app.get("/users/{userId}/text2img")
async def text2img(
    userId: Annotated[str, Path()],
    title: str,
    description: str,
    aspect_ratio: str = "16:9",
) -> dict:
    """Generate an image based on text input."""
    img_generator = MealImageGenerator(
        s3_hostname=os.getenv("VULTR_OBJECT_STORAGE_HOSTNAME"),
        s3_access_key=os.getenv("VULTR_OBJECT_STORAGE_ACCESS_KEY"),
        s3_secret_key=os.getenv("VULTR_OBJECT_STORAGE_SECRET_KEY"),
        s3_bucket_name=os.getenv("VULTR_OBJECT_STORAGE_BUCKET_NAME_MEAL_IMAGES"),
        luma_api_key=os.getenv("LUMAAI_API_KEY"),
    )
    return img_generator.generate_image(
        title=title,
        description=description,
        aspect_ratio=aspect_ratio,
    )

@app.get("/users/{userId}/text2ingredients")
async def text2ingredients(
    userId: Annotated[str, Path()],
    text: str,
) -> Ingredients:
    """Generate an image based on text input."""
    parser = IngredientParser(provider="openai")
    return parser.text_to_ingredients(text=text)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
