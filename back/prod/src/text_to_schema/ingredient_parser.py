from __future__ import annotations

import json
import logging
import os
from textwrap import dedent
from typing import Literal, Optional

from openai import OpenAI

from src.models.ingredients import Ingredient, Ingredients

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

ENDPOINT_ROUTE = "/v1/chat/completions"

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
        self.provider = provider or "mistral"
        logger.debug("MealGenerator initialized with provider: %s", self.provider)
        if self.provider == "mistral":
            self.model_name = model_name or os.getenv("MISTRAL_MODEL_NAME")
            self.api_key = api_key or os.getenv("MISTRAL_API_KEY")
        elif self.provider == "openai":
            self.model_name = model_name or os.getenv("OPENAI_MODEL_NAME")
            self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        elif self.provider == "hosted_ai":
            self.model_name = model_name or os.getenv("HOSTED_AI_MODEL_NAME")
            endpoint_ip = os.getenv("HOSTED_AI_IP")
            endpoint_port = os.getenv("HOSTED_AI_PORT")
            self.endpoint = f"http://{endpoint_ip}:{endpoint_port}/{ENDPOINT_ROUTE}"
            logger.debug("Endpoint: %s", self.endpoint)
        else:
            msg = f"Unknown provider: {self.provider}"
            logger.error(msg)
            raise ValueError(msg)
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
        ingredients : Ingredients = Ingredients(ingredients=data_obj)

        return ingredients

    def _mistral(
            self,
            system_msg: str,
            prompt: str,
            schema: dict,
    ) -> dict:
        model_name = self.mistral_model_name  # "ministral-8b-latest"

        logger.debug("Using model: %s with respose format: %s", model_name, schema)
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

    def _hosted_ai(
            self,
            system_msg: str,
            prompt: str,
            schema: dict,
    ) -> dict:
        """Call mistral API."""
        model_name = self.model_name
        logger.debug("Using model: %s with respose format: %s", model_name, schema)
        response = requests.post(
            f"{self.endpoint}/v1/chat/completions",
            headers={
                "Content-Type": "application/json",
            },
            json={
                "model": HOSTED_AI_MODEL_NAME,
                "messages": [
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": prompt},
                ],
                "max_tokens": 2000,
            },
            timeout=300,
        )
        logger.debug("response: %s", response.text)
        chat_response = response.json().get("choices", [{}])[0].get("message", {}).get("content", "")
        logger.debug(chat_response)
        return json.loads(chat_response)
