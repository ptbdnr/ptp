from __future__ import annotations

import uuid
import os
import logging
from datetime import date
from typing import Annotated, Optional, cast, List, Dict
from fastapi import FastAPI, Form, HTTPException, Path, Request, WebSocket, WebSocketDisconnect
import asyncio
import json
from fastapi.responses import StreamingResponse

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

DEFAULT_USER_ID = "kxsb"

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
async def get_ingredients(
    userId: Annotated[str, Path()],
) -> Ingredients:
    """Get user inventory."""
    if userId not in db["users"]:
        raise HTTPException(status_code=404, detail="User not found")
    ingredients: Ingredients = cast(Ingredients, db["users"][userId]["ingredients"])
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
    equipments: Equipments = cast(Equipments, db["users"][userId]["equipments"])
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
    userId: str = Path(...)
) -> UserPreferences:
    """Get user dietary and budget preferences."""
    if userId not in db["users"]:
        raise HTTPException(status_code=404, detail="User not found")
    user_preferences: UserPreferences = cast(UserPreferences, db["users"][userId]["preferences"])
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

@app.get("/users/{userId}/text2ingredients")
async def text2ingredients(
    request: Request,
    userId: Annotated[str, Path()],
    text: str,
) -> Ingredients:
    """Convert text to ingredients."""
    logger.info("=" * 50)
    logger.info("Request received for text2ingredients", extra={
        "userId": userId,
        "text": text,
        "headers": dict(request.headers),
        "query_params": dict(request.query_params),
    })

    try:
        # For demo purposes, return mock data
        logger.info("Generating mock ingredients")
        ingredients = Ingredients(ingredients=[
            Ingredient(name="Tomato", quantity=3, unit="pieces"),
            Ingredient(name="Pasta", quantity=200, unit="grams"),
            Ingredient(name="Olive oil", quantity=2, unit="tablespoons"),
        ])

        logger.info("Successfully generated ingredients", extra={
            "ingredients_count": len(ingredients.ingredients),
            "ingredients": [i.dict() for i in ingredients.ingredients]
        })
        return ingredients

    except Exception as e:
        logger.error("Error processing text2ingredients request", exc_info=True, extra={
            "error": str(e),
            "error_type": type(e).__name__,
        })
        raise HTTPException(status_code=500, detail=str(e))

# Add WebSocket chat endpoint
@app.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket):
    """Handle WebSocket connections for streaming chat."""
    await websocket.accept()
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            messages = data.get("messages", [])
            stream = data.get("stream", True)
            
            if stream:
                # Stream mock response
                mock_response = "This is a sample chat response. In production, this would be generated by an AI model."
                for chunk in mock_response.split():
                    await websocket.send_text(chunk + " ")
                    await asyncio.sleep(0.1)  # Simulate streaming
                # Send end marker
                await websocket.send_json({"type": "end"})
            else:
                # Send complete mock response
                mock_response = "This is a sample chat response. In production, this would be generated by an AI model."
                await websocket.send_text(mock_response)
    except WebSocketDisconnect:
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        await websocket.close()

# Add HTTP chat endpoint
@app.post("/api/chat")
async def chat(
    request: Request
) -> StreamingResponse:
    """Handle regular HTTP chat requests."""
    try:
        # Get the request body
        body = await request.json()
        messages = body.get("messages", [])
        
        logger.info(f"[Backend] Received request with messages: {json.dumps(messages, indent=2)}")
        
        if not messages:
            logger.error("[Backend] No messages provided")
            raise HTTPException(status_code=400, detail="No messages provided")
        
        # Create a streaming response
        async def generate():
            response_text = "This is a sample chat response. In production, this would be generated by an AI model."
            logger.info(f"[Backend] Streaming response text: {response_text}")
            
            # Split into larger chunks for smoother streaming
            chunks = [response_text[i:i+10] for i in range(0, len(response_text), 10)]
            
            for chunk in chunks:
                chunk_message = {
                    "content": chunk
                }
                logger.info(f"[Backend] Sending chunk: {json.dumps(chunk_message, indent=2)}")
                yield f"data: {json.dumps(chunk_message)}\n\n"
                await asyncio.sleep(0.1)  # Simulate streaming delay
            
            # Send done marker
            logger.info("[Backend] Sending [DONE] marker")
            yield "data: [DONE]\n\n"
        
        return StreamingResponse(
            generate(),
            media_type="text/event-stream"
        )
    except Exception as e:
        logger.error(f"[Backend] Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
