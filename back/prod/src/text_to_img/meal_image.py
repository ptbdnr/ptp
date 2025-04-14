from __future__ import annotations

import json
import logging
import os
import time
import uuid
from pathlib import Path
from textwrap import dedent
from typing import Optional

import boto3
import requests
from botocore.config import Config
from lumaai import LumaAI

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

TMP_DIR = Path("./tmp_data")

class MealImageGenerator:
    """Generate meal images using AI and store them in Object Storage."""

    s3_client: boto3.client
    s3_hostname: str
    s3_bucket_name: str
    luma_client: LumaAI
    access_level: str = "public-read"

    def __init__(
        self,
        s3_hostname: Optional[str] = None,
        s3_access_key: Optional[str] = None,
        s3_secret_key: Optional[str] = None,
        s3_bucket_name: Optional[str] = None,
        luma_api_key: Optional[str] = None,
    ) -> None:
        """Initialize the instance."""
        self.s3_hostname = s3_hostname or os.getenv("VULTR_OBJECT_STORAGE_HOSTNAME")
        s3_access_key = s3_access_key or os.getenv("VULTR_OBJECT_STORAGE_ACCESS_KEY")
        s3_secret_key = s3_secret_key or os.getenv("VULTR_OBJECT_STORAGE_SECRET_KEY")
        self.s3_bucket_name = s3_bucket_name or os.getenv("VULTR_OBJECT_STORAGE_BUCKET_NAME")

        luma_api_key = luma_api_key or os.getenv("LUMALAB_API_KEY")

        # Initialize S3 client
        session = boto3.session.Session()
        self.s3_client = session.client(
            "s3",
            region_name=self.s3_hostname.split(".")[0],
            endpoint_url=f"https://{self.s3_hostname}",
            aws_access_key_id=s3_access_key,
            aws_secret_access_key=s3_secret_key,
            config=Config(signature_version="s3v4"),
        )
        logger.debug("S3 client initialized with bucket: %s", self.s3_bucket_name)
        # List buckets
        bucket_list = self.s3_client.list_buckets()
        logger.debug("Buckets %s", json.dumps(bucket_list, indent=2, default=str))

        self.luma_client = LumaAI(auth_token=luma_api_key)
        logger.debug("Luma AI client initialized")

    def generate_image(
        self,
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

        # Start asynchronous image generation
        luma_task = self.luma_client.generations.image.create(
            prompt=prompt,
            aspect_ratio=aspect_ratio,
        )
        logger.debug("Image generation task created with ID: %s", luma_task.id)

        # Poll for completion
        completed = False
        luma_task_id = luma_task.id
        while not completed:
            luma_task = self.luma_client.generations.get(id=luma_task_id)
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
        # if not TMP_DIR.exists():
        #     TMP_DIR.mkdir(parents=True, exist_ok=True)
        # with Path(f"{TMP_DIR}/{luma_task.id}.jpg").open("wb") as file:
        #     file.write(response.content)
        # logger.debug("Image saved locally as %s", f"{luma_task.id}.jpg")

        # Upload the image to S3
        object_key = f"{uuid.uuid4()}.jpg"
        # with Path(f"{TMP_DIR}/{luma_task.id}.jpg").open("rb") as file:
        #     file_content = file.read()
        #     response = self.s3_client.put_object(
        #         Bucket=self.s3_bucket_name,
        #         Key=object_key,
        #         Body=file_content,
        #         ContentType="image/jpeg",
        #         ACL=self.access_level,
        #     )
        signed_url = self.s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": self.s3_bucket_name,
                "Key": object_key,
                "ContentType": "image/png",
                "ACL": "public-read",
            },
            ExpiresIn=300,
        )

        # Upload using signed URL
        response = requests.put(
            signed_url,
            data=response.content,
            headers={
                "Content-Type": "image/png",
                "x-amz-acl": "public-read",
            },
            timeout=60,
        )
        response.raise_for_status()

        return {
            "image_url": f"https://{self.s3_bucket_name}.{self.s3_hostname}/{object_key}",
            "image_height": aspect_ratio.split(":")[0],
            "image_width": aspect_ratio.split(":")[1],
        }
