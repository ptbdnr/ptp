from __future__ import annotations

import json
import logging
import os
from textwrap import dedent
from typing import Optional

import dotenv

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

dotenv.load_dotenv(".env.local")g

HOSTED_AI_IP = os.getenv("HOSTED_AI_IP")
HOSTED_AI_PORT = os.getenv("HOSTED_AI_PORT")
HOSTED_AI_MODEL_NAME = os.getenv("HOSTED_AI_MODEL_NAME")


def generate_idea(
    dietary_preferences: list[str],
    schema: dict,
    max_prep_time: Optional[int] = 90,
    ingredients: Optional[list[dict]] = None,
    min_num_meals: Optional[int] = 3,
    max_num_meals: Optional[int] = 5,
) -> dict:
    """Convert text to ingredients."""
    ingredients = ingredients or []
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

    data_obj = _hosted_ai(
        system_msg=system_msg,
        prompt=prompt,
        schema=schema,
    )

    if not isinstance(data_obj, list):
        data_obj = [data_obj]
    return data_obj


def _hosted_ai(
        system_msg: str,
        prompt: str,
        schema: dict,
) -> dict:
    """Call mistral API."""
    logger.debug("Mistral client initialized")
    model_name = MISTRAL_MODEL_NAME
    logger.debug("Using model: %s with respose format: %s", model_name, schema)
    response = requests.post(
        f"http://{HOSTED_AI_IP}:{HOSTED_AI_PORT}/v1/chat/completions",
        headers={
            "Content-Type": "application/json",
        },
        json={
            "model": HOSTED_AI_MODEL_NAME,
            "messages": [
                {"role": "system", "content": system_msg},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 500,
        },
    )
    logger.debug("Chat response: %s", chat_response)

    logger.debug(chat_response.choices[0].message.content)
    return json.loads(chat_response.choices[0].message.content)


if __name__ == "__main__":
    # Example usage
    dietary_preferences = ["vegetarian", "gluten-free"]
    schema = {
        "name": "string",
        "description": "str,ing",
        "ingredients": ["string"],
        "preparation_time": "integer",
        "cooking_time": "integer",
        "instructions": "string",
    }
    meals = generate_idea(
        dietary_preferences=dietary_preferences,
        schema=schema,
        max_prep_time=30,
    )
    logger.info(meals)
