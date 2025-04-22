import json
import logging
import os
from textwrap import dedent

import dotenv

from src.ai_capability.test_to_media import generate_media
from src.ai_capability.textgen import textgen
from src.models.ingredients import Ingredient, Ingredients
from src.models.meals import Meal, MealImages, MealPreview, MealVideos
from src.models.preferences import UserPreferences
from src.store.nosql import NoSQLMongoClient
from src.store.object_store import ObjectStoreClient

logging.basicConfig(
    format="%(asctime)s,%(msecs)03d %(levelname)-8s [%(filename)s:%(lineno)d] %(message)s",
    datefmt="%Y-%m-%d:%H:%M:%S",
    level=logging.DEBUG,
)
logger = logging.getLogger(__name__)

dotenv.load_dotenv(".env.local")

# constants
BUCKET_NAME_MEAL_IMAGES = os.getenv("VULTR_OBJECT_STORAGE_BUCKET_NAME_MEAL_IMAGES")
BUCKET_NAME_MEAL_VIDEOS = os.getenv("VULTR_OBJECT_STORAGE_BUCKET_NAME_MEAL_VIDEOS")
COLLECTION_NAME = os.getenv("MONGODB_COLLECTION_NAME_MEALS")

class MealDetailer:
    """Orchestrator for meal details."""

    nosql_client: NoSQLMongoClient
    objstore_client: ObjectStoreClient

    def __init__(self) -> None:
        """Initialize an instance."""
        self.nosql_client = NoSQLMongoClient()
        self.nosql_client.create_collection(
            collection_name=COLLECTION_NAME,
            drop_old_collection=False,
        )
        self.objstore_client = ObjectStoreClient()
        self.objstore_client.create_bucket(
            bucket_name=BUCKET_NAME_MEAL_IMAGES,
            access_level="public-read",
            drop_old_bucket=False,
        )
        self.objstore_client.create_bucket(
            bucket_name=BUCKET_NAME_MEAL_VIDEOS,
            access_level="public-read",
            drop_old_bucket=False,
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

        logger.debug("Store in noSQL: %s", meal_preview)
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

        logger.debug("Generate ingredients for meal %s", meal_preview)
        ingredients: list[Ingredient] = self.get_ingredients(
            name=name,
            description=description,
            placeholder_emoji=placeholder_emoji,
        )
        meal.ingredients = ingredients
        self.save_meal(meal=meal)

        logger.debug("Generate instructions for meal %s", meal_preview)
        instructions: str = self.get_instructions(
            name=name,
            description=description,
            ingredients=ingredients,
        )
        meal.instructions = instructions
        self.save_meal(meal=meal)

        logger.debug("Generate hero image and video for meal %s", meal_preview)
        image_hero_url: str = self.get_hero_image_url(
            name=name,
            description=description,
            ingredients=ingredients,
            instructions=instructions,
        )
        meal.images.hero_url = image_hero_url
        self.save_meal(meal=meal)

        logger.debug("Generate hero video for meal %s", meal_preview)
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
        system_msg="As a customer focused chef, you recommend ingredients for a meal."
        prompt_template=dedent("""
            Given a meal name: {meal_name}
            and a meal description: {meal_description}
            with the selected emoji: {meal_emoji}
            List the required ingredients.
            The ingredients should be healthy, delicious, and accessible.
            Extract the ingredients in short JSON object. Don't include any other information. Be concise.
            The JSON object should be in the following format:
            {schema_str}
        """)
        schema = Ingredients.model_json_schema(by_alias=False)
        prompt = prompt_template.format(
            meal_name=name,
            meal_description=description,
            meal_emoji=placeholder_emoji,
            schema_str=json.dumps(schema),
        )
        logger.debug("Prompt: %s", prompt)
        data_obj = textgen(
            provider="hosted_ai",
            model_name=os.getenv("HOSTED_AI_MODEL_NAME"),
            api_key="DUMMY",
            endpoint=f"http://{os.getenv('HOSTED_AI_IP')}:{os.getenv('HOSTED_AI_PORT')}",
            system_msg=system_msg,
            prompt=prompt,
            schema=schema,
        )
        ingredients = Ingredients(**data_obj)
        list_of_ingredients = ingredients.ingredients
        logger.debug("list_of_ingredients (%s): %s", type(list_of_ingredients), list_of_ingredients)
        return list_of_ingredients

    def get_instructions(
        self,
        name: str,
        description: str,
        ingredients: list[Ingredient],
    ) -> str:
        """Get instructions for a meal."""
        system_msg="As a customer focused chef, you recommend cooking instructions for a meal."
        prompt_template=dedent("""
            Given a meal name: {meal_name}
            and a meal description: {meal_description}
            with the ingredients: {meal_ingredients}
            Create the required cooking instructions in markdown format.
            The cooking instructions should be safe, healthy, and accessible.
            Don't include any other information. Be concise.
        """)
        prompt = prompt_template.format(
            meal_name=name,
            meal_description=description,
            meal_ingredients=";".join([json.dumps(i.model_dump()) for i in ingredients]),
        )
        logger.debug("Prompt: %s", prompt)
        response = textgen(
            provider="hosted_ai",
            model_name=os.getenv("HOSTED_AI_MODEL_NAME"),
            api_key="DUMMY",
            endpoint=f"http://{os.getenv('HOSTED_AI_IP')}:{os.getenv('HOSTED_AI_PORT')}",
            system_msg=system_msg,
            prompt=prompt,
        )
        logger.debug("instructions response (%s): %s", type(response), response)
        return response.get("content")

    def get_hero_image_url(
        self,
        name: str,
        description: str,
        ingredients: list[Ingredient],
        instructions: str,
    ) -> str:
        """Get hero image URL for a meal."""
        prompt_template=dedent("""
            Given a meal name: {meal_name}
            with a meal description: {meal_description}
            with the ingredients: {meal_ingredients}
            with the instructions: {meal_instructions}
            Generate an image about the meal without any text.
        """)
        prompt = prompt_template.format(
            meal_name=name,
            meal_description=description,
            meal_ingredients=";".join([json.dumps(i.model_dump()) for i in ingredients]),
            meal_instructions=instructions,
        )
        logger.debug("Prompt: %s", prompt)
        media_bytes, media_id = generate_media(
            prompt=prompt,
            aspect_ratio="16:9",
            output_format="jpg",
        )
        return self.objstore_client.insert(
            bucket_name=BUCKET_NAME_MEAL_IMAGES,
            object_key=f"{media_id}.jpg",
            content=media_bytes,
        )

    def get_hero_video_url(
        self,
        name: str,
        description: str,
        ingredients: list[Ingredient],
        instructions: str,
    ) -> str:
        """Get hero video URL for a meal."""
        prompt_template=dedent("""
            Given a meal name: {meal_name}
            with a meal description: {meal_description}
            with the ingredients: {meal_ingredients}
            with the instructions: {meal_instructions}
            Generate a video about the meal without any text.
        """)
        prompt = prompt_template.format(
            meal_name=name,
            meal_description=description,
            meal_ingredients=";".join([json.dumps(i.model_dump()) for i in ingredients]),
            meal_instructions=instructions,
        )
        media_bytes, media_id = generate_media(
            prompt=prompt,
            aspect_ratio="16:9",
            output_format="mp4",
        )
        return self.objstore_client.insert(
            bucket_name=BUCKET_NAME_MEAL_VIDEOS,
            object_key=f"{media_id}.mp4",
            content=media_bytes,
        )

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
