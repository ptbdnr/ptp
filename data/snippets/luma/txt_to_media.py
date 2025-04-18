from __future__ import annotations

import logging
import os
import time
from typing import Literal

import dotenv
import requests
from lumaai import LumaAI

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

dotenv.load_dotenv(".env.local")

LUMA_API_KEY = os.getenv("LUMALAB_API_KEY")

def generate_content(
    prompt: str,
    aspect_ratio: str = "16:9",
    output_format: str = Literal["jpg", "mp4"],
) -> tuple[bytes, str]:
    """Generate img/video content with AI."""
    logger.debug("Start generating content with prompt: %s", prompt)

    # Initialize luma client
    luma_client = LumaAI(auth_token=LUMA_API_KEY)
    logger.debug("Luma AI client initialized")

    # Start asynchronous generation
    luma_task = None
    if output_format == "mp4":
        luma_task = luma_client.generations.create(
            prompt=prompt,
            aspect_ratio=aspect_ratio,
        )
    elif output_format == "jpg":
        luma_task = luma_client.generations.image.create(
            prompt=prompt,
            aspect_ratio=aspect_ratio,
        )
    else:
        msg = f"Unsupported output format: {output_format}"
        logger.error(msg)
        raise ValueError(msg)
    logger.debug("Generation task created with ID: %s", luma_task.id)

    # Poll for completion
    completed = False
    luma_task_id = luma_task.id
    while not completed:
        luma_task = luma_client.generations.get(id=luma_task_id)
        if luma_task.state == "completed":
            completed = True
            logger.info("Generation completed successfully")
        elif luma_task.state == "failed":
            msg = f"Generation failed with reason: {luma_task.failure_reason}"
            raise RuntimeError(msg)
        logger.info("Generation in progress...")
        time.sleep(2)

    # Download the content
    if output_format == "jpg":
        content_url = luma_task.assets.image
    elif output_format == "mp4":
        content_url = luma_task.assets.video
    else:
        msg = f"Unsupported output format: {output_format}"
        logger.error(msg)
        raise ValueError(msg)

    response = requests.get(content_url, stream=True, timeout=60)
    logger.debug("Content downloaded successfully")

    return response.content, luma_task_id
