from __future__ import annotations

import json
import logging
import os
from textwrap import dedent
from typing import Literal, Optional

from mistralai import Mistral, ResponseFormat

from src.models.ingredients import Ingredient
from src.models.meals import Meal, MealPreview, Meals

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)


class MealGenerator:
    """Generate meal using AI."""

    mistral_client: Mistral
    mistral_model_name: str

    def __init__(
        self,
        mistral_api_key: Optional[str] = None,
        mistral_model_name: Optional[str] = None,
    ) -> None:
        """Initialize the instance."""
        mistral_api_key = mistral_api_key or os.getenv("MISTRAL_API_KEY")
        self.mistral_model_name = mistral_model_name or os.getenv("MISTRAL_MODEL_NAME")

        self.mistral_client = Mistral(api_key=mistral_api_key)
        logger.debug("Mistral client initialized")

    def recommend(
        self,
        model: Literal[Meal, MealPreview],
        dietary_preferences: list[str],
        max_prep_time: Optional[int] = 90,
        ingredients: Optional[list[Ingredient]] = None,
        min_num_meals: Optional[int] = 3,
        max_num_meals: Optional[int] = 5,
    ) -> Meals:
        """Convert text to ingredients."""
        ingredients = ingredients or []
        schema = model.model_json_schema(by_alias=False)
        response_format : ResponseFormat = ResponseFormat(
            schema = [schema],
            response_format = "json",
        )
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
        logger.debug("Parsing text with prompt: %s", prompt)

        model_name = self.mistral_model_name  # "ministral-8b-latest"

        logger.debug("Using model: %s with respose format: %s", model_name, response_format.__dict__)
        chat_response = self.mistral_client.chat.complete(
            model = model_name,
            messages = [
                {"role": "system", "content": system_msg},
                {"role": "user", "content": prompt},
            ],
            response_format = {"type": "json_object"},
            temperature = 0,
        )
        logger.debug("Chat response: %s", chat_response)

        logger.debug(chat_response.choices[0].message.content)
        data_obj = json.loads(chat_response.choices[0].message.content)
        if not isinstance(data_obj, list):
            data_obj = [data_obj]
        return Meals(meals=data_obj)
