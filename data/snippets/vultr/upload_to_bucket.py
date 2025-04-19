import json
import logging
import os
from pathlib import Path

import boto3
import dotenv
import requests

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
BUCKET_NAME = "meal-images"
ACCESS_LEVEL = "public-read"

PATH_TO_FILES = "./.tmp"
FILENAMES = [
    "Chickpea_Salad_e26a0743-93d9-4632-98d8-2871ec05a828.jpg",
    "Quinoa_Veggie_Bowl_53d13b2d-b7e3-4691-a66a-811849c7aff4.jpg",
    "Sweet_Potato_Tacos_53629b63-19e1-4910-884e-cd3034b9c602.jpg",
    "Vegan_Buddha_Bowl_21fe6842-d12a-4ede-9023-6237bd120295.jpg",
    "Zucchini_Noodles_cdf08385-40fc-44d2-95b2-d632d7b01712.jpg",
]

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
    config=boto3.session.Config(signature_version="s3v4"),
)

# List buckets
bucket_list = client.list_buckets()
logger.info("Buckets %s", json.dumps(bucket_list, indent=2, default=str))

# Check if bucket exists
bucket_exists = False
for bucket in bucket_list["Buckets"]:
    if bucket["Name"] == BUCKET_NAME:
        bucket_exists = True
        break
if not bucket_exists:
    logger.info("Bucket %s does not exist", BUCKET_NAME)
    # sys.exit(1)
    client.create_bucket(Bucket=BUCKET_NAME, ACL=ACCESS_LEVEL)
    logger.info("Bucket %s created", BUCKET_NAME)

# Upload file to bucket
for filename in FILENAMES:
    # with Path(FILEPATH).open("rb") as file:
    #     response = client.put_object(
    #         Bucket=BUCKET_NAME,
    #         Key=object_key,
    #         Body=file,
    #         ACL=ACCESS_LEVEL,
    # )
    # logger.info(response)

    object_key = filename
    signed_url = client.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": BUCKET_NAME,
            "Key": object_key,
            "ACL": "public-read",
        },
        ExpiresIn=300,
    )

    # Upload using signed URL
    with Path(f"{PATH_TO_FILES}/{filename}").open("rb") as file:
        content = file.read()
        response = requests.put(
            signed_url,
            data=content,
            headers={
                # "Content-Type": "image/png",
                "x-amz-acl": "public-read",
            },
            timeout=30000,
        )
        response.raise_for_status()


    logger.info("File %s uploaded to bucket %s", object_key, BUCKET_NAME)
    url = f"https://{BUCKET_NAME}.{HOSTNAME}/{object_key}"
    logger.info("File URL: %s", url)
