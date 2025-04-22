from __future__ import annotations

import json
import logging
import os
from textwrap import dedent
from typing import Literal, Optional

from src.ai_capability.textgen import textgen
from src.models.ingredients import Ingredients

logging.basicConfig(
    format="%(asctime)s,%(msecs)03d %(levelname)-8s [%(filename)s:%(lineno)d] %(message)s",
    datefmt="%Y-%m-%d:%H:%M:%S",
    level=logging.DEBUG,
)
logger = logging.getLogger(__name__)


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
        schema = Ingredients.model_json_schema(by_alias=False)
        system_msg = "Extract ingredients into a concise JSON object matching the schema."
        prompt_template = dedent("""
            Given the following text:
            {text}

            Extract the ingredients as a JSON object, following these rules:
            - The JSON must strictly conform to this schema: {schema_str}
            - The "quantity" field must be numeric only (no words).
            - Adjectives or descriptors must be part of the "name" field.
            - The "unit" field should reflect any unit mentioned; if missing, use "piece" as default.
            Do not include any other information or explanatory text.
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

        logger.debug("Parsed data (%s): %s", type(data_obj), json.dumps(data_obj))
        return Ingredients(**data_obj)


