from __future__ import annotations

import os
from typing import Optional
from textwrap import dedent
import logging
import requests
import time
import uuid
from pathlib import Path

import boto3
from lumaai import AsyncLumaAI


logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger.addHandler(logging.StreamHandler(formatter=formatter))


class MealImageGenerator:
    s3_client: boto3.client
    s3_bucket: str
    luma_client: AsyncLumaAI
    access_level: str = "public-read"

    def __init__(
        self,
        s3_hostname: Optional[str] = None,
        s3_access_key: Optional[str] = None,
        s3_secret_key: Optional[str] = None,
        s3_bucket: Optional[str] = None,
        lumna_api_key: Optional[str] = None,
    ) -> None:
        """Initialize the instance."""
        if s3_hostname is None:
            s3_hostname = os.getenv("VULTR_OBJECT_STORAGE_HOSTNAME")
        if s3_access_key is None:
            s3_access_key = os.getenv("VULTR_OBJECT_STORAGE_ACCESS_KEY")
        if s3_secret_key is None:
            s3_secret_key = os.getenv("VULTR_OBJECT_STORAGE_SECRET_KEY")
        self.s3_bucket = s3_bucket or os.getenv("VULTR_OBJECT_STORAGE_BUCKET_NAME")

        if lumna_api_key is None:
            lumna_api_key = os.getenv("LUMAAI_API_KEY")

        # Initialize S3 client
        self.s3_client = boto3.client(
            "s3",
            region_name=s3_hostname.split(".")[0],
            endpoint_url=f"https://{s3_hostname}",
            aws_access_key_id=s3_access_key,
            aws_secret_access_key=s3_secret_key,
        )
        logger.debug("S3 client initialized with bucket: %s", self.s3_bucket)

        self.luma_client = AsyncLumaAI(auth_token=self.luma_api_key)
        logger.debug("Luma AI client initialized")

    async def asyncImage(
        self,
        title: str,
        description: str,
        aspect_ratio: str = "16:9",
    ) -> dict:
        """Generate image with AI store on Vultr and return metadata"""
        logger.debug("Start generating image with title: %s and description: %s", title, description)

        prompt_template = dedent("""
            Generate and image that would be titled as:
            {{title}}

            and described as:
            {{description}}
        """)
        prompt = prompt_template.format(
            title=title,
            description=description,
        )
        logger.info("Generating image with prompt: %s", prompt)

        # Start asynchronous image generation
        luma_task = await self.luma_client.generations.image.create(
            prompt=prompt,
            aspect_ratio=aspect_ratio,
            loop=False,
        )

        # Poll for completion
        completed = False
        luma_task_id = luma_task.id
        while not completed:
            luma_task = await self.luma_client.generations.get(id=luma_task_id)
            if luma_task.state == "completed":
                completed = True
            elif luma_task.state == "failed":
                raise RuntimeError(f"Generation failed: {luma_task.failure_reason}")
            logger.info("Generation in progress...")
            await time.sleep(2)

        # Download the image
        image_url = luma_task.assets.image
        response = requests.get(image_url, stream=True)

        object_key = f"{uuid.uuid4()}.png"
        response = self.s3_client.put_object(
            Bucket=self.s3_bucket,
            Key=object_key,
            Body=response.content,
            ACL=self.access_level,
        )

        return {
            "image_url": f"https://{self.s3_bucket}.{self.s3_client.meta.endpoint_url}/{object_key}",
            "image_height": aspect_ratio.split(":")[0],
            "image_width": aspect_ratio.split(":")[1],
        }
