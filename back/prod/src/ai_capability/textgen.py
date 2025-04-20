from __future__ import annotations

import json
import logging

import requests
from mistralai import Mistral
from openai import OpenAI

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

ENDPOINT_ROUTE = "/v1/chat/completions"

def textgen(
        provider: str,
        model_name: str,
        api_key: str,
        endpoint: str,
        system_msg: str,
        prompt: str,
        schema: dict,
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
        schema: dict,
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
        response_format = {"type": "json_object"},
        temperature = 0,
    )
    logger.debug("Chat response: %s", chat_response)

    logger.debug(chat_response.choices[0].message.content)
    return json.loads(chat_response.choices[0].message.content)

def openai_textgen(
        api_key: str,
        model_name: str,
        system_msg: str,
        prompt: str,
        schema: dict,
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
            },
        },
    )
    logger.debug("OpenAI response: %s", response)

    return json.loads(response.output_text)

def hosted_ai_textgen(
        endpoint: str,
        model_name: str,
        system_msg: str,
        prompt: str,
        schema: dict,
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
    logger.debug("response: %s", response.text)
    chat_response = response.json().get("choices", [{}])[0].get("message", {}).get("content", "")
    logger.debug(chat_response)
    return json.loads(chat_response)
