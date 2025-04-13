import os
import uuid
import logging
import asyncio
import aiohttp
import boto3
import base64
import hashlib
import requests
from io import BytesIO
from PIL import Image
from dotenv import load_dotenv
from lumaai import AsyncLumaAI

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LumaImageGenerator:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        self.luma_api_key = os.getenv("LUMAAI_API_KEY")
        self.vultr_hostname = os.getenv("VULTR_OBJECT_STORAGE_HOSTNAME")
        self.vultr_access_key = os.getenv("VULTR_OBJECT_STORAGE_ACCESS_KEY")
        self.vultr_secret_key = os.getenv("VULTR_OBJECT_STORAGE_SECRET_KEY")
        
        # Validate required environment variables
        if not all([self.luma_api_key, self.vultr_hostname, 
                   self.vultr_access_key, self.vultr_secret_key]):
            raise ValueError("Missing required environment variables")
            
        # Initialize Luma AI client
        self.luma_client = AsyncLumaAI(auth_token=self.luma_api_key)
        
        # Initialize Vultr S3 client
        self.s3_client = boto3.client(
            "s3",
            region_name=self.vultr_hostname.split(".")[0],
            endpoint_url=f"https://{self.vultr_hostname}",
            aws_access_key_id=self.vultr_access_key,
            aws_secret_access_key=self.vultr_secret_key
        )

    async def generate_image(self, prompt: str) -> dict:
        try:
            # Step 1: Generate image with Luma AI
            logger.info("Generating image with prompt: %s", prompt)
            generation = await self.luma_client.generations.image.create(
                prompt=prompt
            )
            
            # Step 2: Poll for completion
            completed = False
            while not completed:
                generation = await self.luma_client.generations.get(id=generation.id)
                if generation.state == "completed":
                    completed = True
                elif generation.state == "failed":
                    raise RuntimeError(f"Generation failed: {generation.failure_reason}")
                logger.info("Generation in progress...")
                await asyncio.sleep(2)
            
            # Step 3: Extract image details
            image_url = generation.assets.image
            image_width = None
            image_height = None
            
            # Step 3: Download the image
            async with aiohttp.ClientSession() as session:
                async with session.get(image_url) as resp:
                    if resp.status != 200:
                        raise Exception(f"Failed to download image: {resp.status}")
                    image_content = await resp.read()
            
            # Step 4: Get dimensions if not provided
            if not all([image_width, image_height]):
                with Image.open(BytesIO(image_content)) as img:
                    image_width, image_height = img.size
            
            # Step 5: Check if bucket exists, create if not
            bucket_name = "luma-images"
            bucket_exists = False
            try:
                self.s3_client.head_bucket(Bucket=bucket_name)
                bucket_exists = True
            except:
                pass
            
            if not bucket_exists:
                self.s3_client.create_bucket(
                    Bucket=bucket_name,
                    ACL="public-read"
                )
                logger.info(f"Created bucket: {bucket_name}")
            
            # Step 6: Upload to Vultr S3 using requests with signed URL
            object_key = f"{uuid.uuid4()}.png"
            url = f"https://{bucket_name}.{self.vultr_hostname}/{object_key}"
            
            # Create signed URL
            try:
                signed_url = self.s3_client.generate_presigned_url(
                    'put_object',
                    Params={
                        'Bucket': bucket_name,
                        'Key': object_key,
                        'ContentType': 'image/png',
                        'ACL': 'public-read'
                    },
                    ExpiresIn=300
                )
                
                # Upload using signed URL
                headers = {
                    "Content-Type": "image/png",
                    "x-amz-acl": "public-read"
                }
                
                response = requests.put(
                    signed_url,
                    data=image_content,
                    headers=headers
                )
                response.raise_for_status()
            except Exception as e:
                logger.error("Failed to upload image to S3: %s", str(e))
                raise
            
            # Step 6: Return metadata
            return {
                "image_url": f"https://{self.vultr_hostname}/luma2S3/{object_key}",
                "image_width": image_width,
                "image_height": image_height
            }
            
        except Exception as e:
            logger.error("Error generating image: %s", str(e))
            raise
