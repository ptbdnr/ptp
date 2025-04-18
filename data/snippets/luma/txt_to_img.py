from __future__ import annotations

import json
import logging
import os
import time
from pathlib import Path
from textwrap import dedent

import dotenv
import requests
from lumaai import LumaAI

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

dotenv.load_dotenv(".env.local")

TMP_DIR = Path("./.tmp")

LUMA_API_KEY = os.getenv("LUMALAB_API_KEY")


def text_to_filename(text: str) -> str:
    """Convert text to a valid filename."""
    # Remove invalid characters and replace spaces with underscores
    filename = text.replace(" ", "_").replace("/", "_").replace("\\", "_")
    # Limit the filename length to 255 characters
    return filename[:200]

def generate_image(
    title: str,
    description: str,
    aspect_ratio: str = "16:9",
) -> dict:
    """Generate image with AI store on Vultr and return metadata."""
    logger.debug("Start generating image with title: %s and description: %s", title, description)

    prompt_template = dedent("""
        Generate and image that would be titled as:
        {title}

        and described as:
        {description}
    """)
    prompt = prompt_template.format_map({
        "title": title,
        "description": description,
    })
    logger.debug("Generating image with prompt: %s", prompt)

    # Initialize luma client
    luma_client = LumaAI(auth_token=LUMA_API_KEY)
    logger.debug("Luma AI client initialized")

    # Start asynchronous image generation
    luma_task = luma_client.generations.image.create(
        prompt=prompt,
        aspect_ratio=aspect_ratio,
    )
    logger.debug("Image generation task created with ID: %s", luma_task.id)

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

    # Download the image
    image_url = luma_task.assets.image
    response = requests.get(image_url, stream=True, timeout=60)
    logger.debug("Image downloaded successfully")

    # Save the image locally
    if not TMP_DIR.exists():
        TMP_DIR.mkdir(parents=True, exist_ok=True)
    with Path(f"{TMP_DIR}/{text_to_filename(title)}_{luma_task.id}.jpg").open("wb") as file:
        file.write(response.content)
    logger.debug("Image saved locally as %s", f"{luma_task.id}.jpg")


with Path(f"{TMP_DIR}/mockupMeals.json").open("r") as fp:
    mockup_meals = json.load(fp)
    for meal in mockup_meals:
        title = meal["name"]
        description = meal["description"]
        logger.debug(title)
        logger.debug(description)

        generate_image(
            title=title,
            description=description,
            aspect_ratio="16:9",
        )
