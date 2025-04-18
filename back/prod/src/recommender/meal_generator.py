from __future__ import annotations

import json
import logging
import os
from textwrap import dedent
from typing import Literal, Optional

from mistralai import Mistral, ResponseFormat
from openai import OpenAI

from src.models.ingredients import Ingredient
from src.models.meals import Meal, MealPreview, Meals

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)


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
        self.provider = provider or "mistral"
        self.api_key = api_key or (
            os.getenv("MISTRAL_API_KEY")
            if self.provider == "mistral"
            else os.getenv("OPENAI_API_KEY")
        )
        self.model_name = model_name or (
            os.getenv("MISTRAL_MODEL_NAME")
            if self.provider == "mistral"
            else os.getenv("OPENAI_MODEL_NAME")
        )
        logger.debug("MealGenerator initialized with provider: %s", self.provider)
        logger.debug("Model name: %s", self.model_name)

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

        if self.provider == "openai":
            data_obj = self._openai(
                system_msg=system_msg,
                prompt=prompt,
                schema=schema,
            )
        elif self.provider == "mistral":
            data_obj = self._mistral(
                system_msg=system_msg,
                prompt=prompt,
                schema=schema,
            )
        else:
            msg = f"Unknown provider: {self.provider}"
            logger.error(msg)
            raise ValueError(msg)

        if not isinstance(data_obj, list):
            data_obj = [data_obj]
        return Meals(meals=data_obj)

    def _mistral(
            self,
            system_msg: str,
            prompt: str,
            schema: dict,
    ) -> dict:
        """Call mistral API."""
        mistral_client = Mistral(api_key=self.api_key)
        logger.debug("Mistral client initialized")
        response_format : ResponseFormat = ResponseFormat(
            schema = [schema],
            response_format = "json",
        )
        model_name = self.model_name
        logger.debug("Using model: %s with respose format: %s", model_name, response_format.__dict__)
        chat_response = mistral_client.chat.complete(
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
        return json.loads(chat_response.choices[0].message.content)

    def _openai(
            self,
            system_msg: str,
            prompt: str,
            schema: dict,
    ) -> dict:
        """Call OpenAI API."""
        openai_client = OpenAI(api_key=self.api_key)

        response = openai_client.responses.create(
            model=self.model_name,
            input=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": prompt},
            ],
            text={
                "format": {
                    "type": "json_schema",
                    "name": "meals",
                    "schema": schema,
                },
            },
        )
        logger.debug("OpenAI response: %s", response)

        return json.loads(response.output_text)
