from __future__ import annotations

import json
import logging
import os
from textwrap import dedent
from typing import Optional

from mistralai import Mistral, ResponseFormat
from src.models.ingredients import Ingredient, Ingredients

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)


class IngredientParser:
    """Generate meal images using AI and store them in Object Storage."""

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

    def text_to_ingredients(
        self,
        text: str,
    ) -> dict:
        """Convert text to ingredients."""
        schema = Ingredient.model_json_schema(by_alias=False)
        response_format : ResponseFormat = ResponseFormat(
            schema = [schema],
            response_format = "json",
        )
        system_msg = "Extract the ingredients information."
        prompt_template = dedent("""
            {text}.
            Extract the ingredients in short JSON object. Don't include any other information. Be concise.
            The JSON object should be in the following format:
            {schema_str}
        """)
        prompt = prompt_template.format(
            text=text,
            schema_str=json.dumps(schema),
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
        ingredients : Ingredients = Ingredients(ingredients=json.loads(chat_response.choices[0].message.content))

        return ingredients
