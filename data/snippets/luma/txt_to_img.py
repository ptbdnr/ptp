from __future__ import annotations

import json
import logging
from pathlib import Path
from textwrap import dedent

import dotenv
from txt_to_media import generate_content

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

dotenv.load_dotenv(".env.local")

TMP_DIR = Path("./.tmp")
OUTPUT_FORMAT = "jpg"


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
    """Generate with AI."""
    logger.debug("Start generating with title: %s and description: %s", title, description)


    prompt_template = dedent("""
        Generate content that could be titled as:
        {title}

        and described as:
        {description}
    """)
    prompt = prompt_template.format_map({
        "title": title,
        "description": description,
    })
    logger.debug("Generating with prompt: %s", prompt)

    content, luma_id = generate_content(
        prompt=prompt,
        aspect_ratio=aspect_ratio,
        output_format=OUTPUT_FORMAT,
    )  # tuple[bytes, str]

    # Save the image locally
    if not TMP_DIR.exists():
        TMP_DIR.mkdir(parents=True, exist_ok=True)
    with Path(f"{TMP_DIR}/{text_to_filename(title)}_{luma_id}.{OUTPUT_FORMAT}").open("wb") as file:
        file.write(content)
    logger.debug("Image saved locally as %s", f"{luma_id}.{OUTPUT_FORMAT}")


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
