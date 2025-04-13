import json
import logging
import os
from pathlib import Path

import boto3
import dotenv

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

dotenv.load_dotenv(".env.local")

# Constants
HOSTNAME = os.environ.get("VULTR_OBJECT_STORAGE_HOSTNAME")
ACCESS_KEY = os.environ.get("VULTR_OBJECT_STORAGE_ACCESS_KEY")
SECRET_KEY = os.environ.get("VULTR_OBJECT_STORAGE_SECRET_KEY")
BUCKET_NAME_USER_IMAGES = os.environ.get("VULTR_OBJECT_STORAGE_BUCKET_NAME_USER_IMAGES")
BUCKET_NAME_MEAL_IMAGES = os.environ.get("VULTR_OBJECT_STORAGE_BUCKET_NAME_MEAL_IMAGES")
ACCESS_LEVEL = "public-read"

# Print env variables
logger.info("HOSTNAME: %s", HOSTNAME)
logger.info("ACCESS_KEY len: %d", len(ACCESS_KEY))
logger.info("SECRET_KEY len: %d", len(SECRET_KEY))

# Connect to Vultr Object Storage
session = boto3.session.Session()
client = session.client(
        "s3",
        region_name=HOSTNAME.split(".")[0],
        endpoint_url="https://" + HOSTNAME,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
    )

for bucket_name in [
    BUCKET_NAME_USER_IMAGES,
    BUCKET_NAME_MEAL_IMAGES,
]:
    # List buckets
    bucket_list = client.list_buckets()
    logger.info("Buckets %s", json.dumps(client.list_buckets(), indent=2, default=str))

    # Check if bucket exists
    bucket_exists = False
    for bucket in bucket_list["Buckets"]:
        if bucket["Name"] == bucket_name:
            bucket_exists = True
            break
    if not bucket_exists:
        logger.info("Bucket %s does not exist", bucket_name)
        client.create_bucket(Bucket=bucket_name, ACL=ACCESS_LEVEL)
        logger.info("Bucket %s created", bucket_name)
