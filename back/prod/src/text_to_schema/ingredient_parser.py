from __future__ import annotations

import json
import logging
import os
from textwrap import dedent
from typing import Literal, Optional

from src.ai_capability.textgen import textgen

from src.models.ingredients import Ingredient, Ingredients

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)


class IngredientParser:
    """Generate meal images using AI and store them in Object Storage."""

    provider: Literal["openai", "mistral", "hosted_ai"]
    model_name: str
    endpoint: str
    api_key: str

    def __init__(
        self,
        api_key: Optional[str] = None,
        model_name: Optional[str] = None,
        provider: Optional[Literal["openai", "mistral", "hosted_ai"]] = None,
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

    def text_to_ingredients(
        self,
        text: str,
    ) -> dict:
        """Convert text to ingredients."""
        schema = Ingredient.model_json_schema(by_alias=False)
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

        data_obj = textgen(
            provider=self.provider,
            endpoint=self.endpoint,
            api_key=self.api_key,
            model_name=self.model_name,
            prompt=prompt,
            system_msg=system_msg,
            schema=schema,
        )

        if not isinstance(data_obj, list):
            data_obj = [data_obj]
        logger.debug("Parsed data (%s): %s", type(data_obj), [json.dumps(d) for d in data_obj])
        ingredients : Ingredients = Ingredients(ingredients=data_obj)

        return ingredients


