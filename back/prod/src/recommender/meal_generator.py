from __future__ import annotations

import json
import logging
import os
import uuid
from textwrap import dedent
from typing import Literal, Optional

from src.ai_capability.textgen import textgen
from src.models.ingredients import Ingredient
from src.models.meals import Meal, MealImagesPreview, MealPreview, Meals

logging.basicConfig(
    format="%(asctime)s,%(msecs)03d %(levelname)-8s [%(filename)s:%(lineno)d] %(message)s",
    datefmt="%Y-%m-%d:%H:%M:%S",
    level=logging.DEBUG,
)
logger = logging.getLogger(__name__)

UNIQUE_MEAL_ID_REQUIRED = True

class MealGenerator:
    """Generate meal using AI."""

    provider: Literal["openai", "mistral"]
    model_name: str
    api_key: str

    def __init__(
        self,
        api_key: Optional[str] = None,
        model_name: Optional[str] = None,
        provider: Optional[Literal["openai", "mistral"]] = None,
    ) -> None:
        """Initialize the instance."""
        self.provider = provider or "hosted_ai"
        logger.debug("Selected provider: %s", self.provider)
        if self.provider == "mistral":
            self.endpoint = "STUB"
            self.model_name = model_name or os.getenv("MISTRAL_MODEL_NAME")
            self.api_key = api_key or os.getenv("MISTRAL_API_KEY")
        elif self.provider == "openai":
            self.endpoint = "STUB"
            self.model_name = model_name or os.getenv("OPENAI_MODEL_NAME")
            self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        elif self.provider == "hosted_ai":
            self.endpoint = f"http://{os.getenv('HOSTED_AI_IP')}:{os.getenv('HOSTED_AI_PORT')}"
            self.model_name = model_name or os.getenv("HOSTED_AI_MODEL_NAME")
            self.api_key = api_key or "STUB"
        else:
            msg = f"Unknown provider: {self.provider}"
            logger.error(msg)
            raise ValueError(msg)
        logger.debug("Endpoint: %s", self.endpoint)
        logger.debug("Model name: %s", self.model_name)

    def recommend(
        self,
        model: Literal[Meal, MealPreview],
        dietary_preferences: list[str],
        max_prep_time: Optional[int] = 90,
        ingredients: Optional[list[Ingredient]] = None,
        min_num_meals: Optional[int] = 1,
        max_num_meals: Optional[int] = 2,
    ) -> Meals:
        """Convert text to ingredients."""
        ingredients = ingredients or []
        schema = model.model_json_schema(by_alias=False)
        system_msg = "As a customer focused chef, you recommend meals."
        prompt_template = dedent("""
            Given the dietary preferences:
            {dietary_preferences}
            and the maximum preparation time:
            {max_prep_time} minutes,
            and the ingredients:
            {ingredients}
            Create min {min_num_meals} max {max_num_meals} meals.
            The meals should be healthy, delicious, and easy to prepare.
            Extract the meals in short JSON object. Don't include any other information. Be concise.
            The JSON object should be in the following format:
            {schema_str}
        """)
        prompt = prompt_template.format(
            dietary_preferences=dietary_preferences,
            max_prep_time=max_prep_time,
            ingredients=[ingredient.model_dump() for ingredient in ingredients],
            schema_str=json.dumps(schema),
            min_num_meals=min_num_meals,
            max_num_meals=max_num_meals,
        )
        logger.debug("Prompt: %s", prompt)

        data_obj = textgen(
            provider=self.provider,
            endpoint=self.endpoint,
            api_key=self.api_key,
            model_name=self.model_name,
            prompt=prompt,
            system_msg=system_msg,
            schema=schema,
        )

        if UNIQUE_MEAL_ID_REQUIRED:
            meals_with_any_id = []
            if "meals" in data_obj:
                meals_with_any_id = data_obj["meals"]
            logger.debug("Meals_with_any_id (%s): %s", type(meals_with_any_id), meals_with_any_id)

            meals_with_unique_id = []
            for meal in meals_with_any_id:
                logger.debug("Meal (%s): %s", type(meal), meal)
                images = MealImagesPreview(placeholder_emoji=meal.get("images", {}).get("placeholder_emoji", "🍽️"))
                meal_preview = MealPreview(
                    id=uuid.uuid4().hex,
                    name=meal["name"],
                    description=meal["description"],
                    images=images,
                )
                logger.debug("MealPreview (%s): %s", type(meal_preview), meal_preview)
                meals_with_unique_id.append(meal_preview)
            meals = Meals(meals=meals_with_unique_id)
        else:
            meals = Meals(**data_obj)

        logger.debug("Meals (%s): %s", type(meals), meals)
        return meals
