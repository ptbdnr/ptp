from __future__ import annotations

import json
import logging
from typing import Optional

import requests
from mistralai import Mistral
from openai import OpenAI

logging.basicConfig(
    format="%(asctime)s,%(msecs)03d %(levelname)-8s [%(filename)s:%(lineno)d] %(message)s",
    datefmt="%Y-%m-%d:%H:%M:%S",
    level=logging.DEBUG,
)
logger = logging.getLogger(__name__)

ENDPOINT_ROUTE = "/v1/chat/completions"

def textgen(
        provider: str,
        model_name: str,
        api_key: str,
        endpoint: str,
        system_msg: str,
        prompt: str,
        schema: Optional[dict] = None,
) -> dict:
    """Route the request to the appropriate provider."""
    if provider == "openai":
        return openai_textgen(
            model_name=model_name,
            api_key=api_key,
            system_msg=system_msg,
            prompt=prompt,
            schema=schema,
        )
    if provider == "mistral":
        return mistral_textgen(
            model_name=model_name,
            api_key=api_key,
            system_msg=system_msg,
            prompt=prompt,
            schema=schema,
        )
    if provider == "hosted_ai":
        return hosted_ai_textgen(
            endpoint=endpoint,
            model_name=model_name,
            system_msg=system_msg,
            prompt=prompt,
            schema=schema,
        )
    msg = f"Unknown provider: {provider}"
    logger.error(msg)
    raise ValueError(msg)

def mistral_textgen(
        api_key: str,
        model_name: str,
        system_msg: str,
        prompt: str,
        schema: Optional[dict] = None,
) -> dict:
    """Handle request with Mistral API."""
    mistral_client = Mistral(api_key=api_key)

    logger.debug("Using model: %s with respose format: %s", model_name, schema)

    chat_response = mistral_client.chat.complete(
        model = model_name,
        messages = [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": prompt},
        ],
        response_format = {"type": "json_object"} if schema else None,
        temperature = 0,
    )
    logger.debug("Mistral chat response: %s", chat_response)
    content = chat_response.choices[0].message.content
    return json.loads(content) if schema else {"content": content}

def openai_textgen(
        api_key: str,
        model_name: str,
        system_msg: str,
        prompt: str,
        schema: Optional[dict] = None,
) -> dict:
    """Handle request with OpenAI API."""
    openai_client = OpenAI(api_key=api_key)

    response = openai_client.responses.create(
        model=model_name,
        input=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": prompt},
        ],
        text={
            "format": {
                "type": "json_schema",
                "name": "meals",
                "schema": schema,
            } if schema else None,
        },
    )
    logger.debug("OpenAI response: %s", response)
    content = response.output_text
    return json.loads(content) if schema else {"content": content}

def hosted_ai_textgen(
        endpoint: str,
        model_name: str,
        system_msg: str,
        prompt: str,
        schema: Optional[dict] = None,
) -> dict:
    """Handle request with Hosted API."""
    model_name = model_name
    logger.debug("Using model: %s with respose format: %s", model_name, schema)
    response = requests.post(
        f"{endpoint}{ENDPOINT_ROUTE}",
        headers={
            "Content-Type": "application/json",
        },
        json={
            "model": model_name,
            "messages": [
                {"role": "system", "content": system_msg},
                {"role": "user", "content": prompt},
            ],
            "max_tokens": 2000,
        },
        timeout=300,
    )
    logger.debug("Hosted AI response: %s", response.text)
    content = response.json().get("choices", [{}])[0].get("message", {}).get("content", "")
    return json.loads(content) if schema else {"content": content}
