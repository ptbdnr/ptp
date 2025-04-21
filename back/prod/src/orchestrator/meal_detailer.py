import logging

from pydantic import ValidationError

from src.models.ingredients import Ingredient
from src.models.meals import Meal, MealImages, MealImagesPreview, MealPreview, MealVideos
from src.models.preferences import UserPreferences
from src.store.nosql import NoSQLMongoClient

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

# constants
COLLECTION_NAME = "meals"

class MealDetailer:

    nosql_client: NoSQLMongoClient

    def __init__(self) -> None:
        """Initialize an instance."""
        self.nosql_client = NoSQLMongoClient()
        self.nosql_client.create_collection(
            collection_name=COLLECTION_NAME,
            drop_old_collection=True,
        )

    async def orchestrate(
        self,
        meal_preview: MealPreview,
        user_preferences: UserPreferences,
    ) -> Meal:
        """Detail a meal."""
        name = meal_preview.name
        description = meal_preview.description
        placeholder_emoji = meal_preview.images.placeholder_emoji

        meal_images = MealImages(
            placeholder_emoji=placeholder_emoji,
        )
        meal = Meal(
            id=meal_preview.id,
            name=name,
            description=description,
            ingredients=[],
            images=meal_images,
            videos=MealVideos(),
        )
        logger.debug("meal: %s", meal)
        self.save_meal(meal=meal)

        ingredients: list[Ingredient] = self.get_ingredients(
            name=name,
            description=description,
            placeholder_emoji=placeholder_emoji,
        )
        meal.ingredients = ingredients
        self.save_meal(meal=meal)

        instructions: str = self.get_instructions(
            name=name,
            description=description,
            ingredients=ingredients,
        )
        meal.instructions = instructions
        self.save_meal(meal=meal)

        image_hero_url: str = self.get_hero_image_url(
            name=name,
            description=description,
            ingredients=ingredients,
            instructions=instructions,
        )
        meal.images.hero_url = image_hero_url
        self.save_meal(meal=meal)

        video_hero_url: str = self.get_hero_video_url(
            name=name,
            description=description,
            ingredients=ingredients,
            instructions=instructions,
        )
        meal.videos.hero_url = video_hero_url
        self.save_meal(meal=meal)

    def get_ingredients(
        self,
        name: str,
        description: str,
        placeholder_emoji: str,
    ) -> list[Ingredient]:
        """Get ingredients for a meal."""
        return [
            Ingredient(
                id="1",
                name="apple",
                quantity=1,
                unit="piece",
            ),
        ]

    def get_instructions(
        self,
        name: str,
        description: str,
        ingredients: list[Ingredient],
    ) -> str:
        """Get instructions for a meal."""
        return "1. Cut the apple in half.\n2. Enjoy your meal!"

    def get_hero_image_url(
        self,
        name: str,
        description: str,
        ingredients: list[Ingredient],
        instructions: str,
    ) -> str:
        """Get hero image URL for a meal."""
        return "https://example.com/hero_image.jpg"

    def get_hero_video_url(
        self,
        name: str,
        description: str,
        ingredients: list[Ingredient],
        instructions: str,
    ) -> str:
        """Get hero video URL for a meal."""
        return "https://example.com/hero_video.mp4"

    def save_meal(
        self,
        meal: Meal,
    ) -> None:
        """Save a meal."""
        item = {
            "_id": meal.id,
            "name": meal.name,
            "description": meal.description,
            "ingredients": [i.model_dump_json() for i in meal.ingredients],
            "instructions": meal.instructions,
            "images": meal.images.model_dump_json(),
            "videos": meal.videos.model_dump_json(),
        }
        response = self.nosql_client.insert(
            collection_name=COLLECTION_NAME,
            payload=item,
        )
        logger.debug("Inserted item %s", response)
