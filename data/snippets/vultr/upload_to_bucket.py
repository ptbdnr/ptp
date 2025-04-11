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
BUCKET_NAME = "ptpbcktdist01"

FILEPATH = "./tmp_data/ptp-20250411t1610.mp4"
OBJECT_KEY = "ptp20250411t1610.mp4"
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

# List buckets
bucket_list = client.list_buckets()
logger.info("Buckets %s", json.dumps(client.list_buckets(), indent=2, default=str))

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
with Path(FILEPATH).open("rb") as file:
    response = client.put_object(
        Bucket=BUCKET_NAME,
        Key=OBJECT_KEY,
        Body=file,
        ACL=ACCESS_LEVEL,
)
logger.info(response)
