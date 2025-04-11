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

# constants
HOSTNAME = os.environ.get("VULTR_OBJECT_STORAGE_HOSTNAME")
ACCESS_KEY = os.environ.get("VULTR_OBJECT_STORAGE_ACCESS_KEY")
SECRET_KEY = os.environ.get("VULTR_OBJECT_STORAGE_SECRET_KEY")
BUCKET_NAME = "ptpbcktdist01"

FILEPATH = "./tmp_data/ptp-20250411t1610.mp4"
OBJECT_KEY = "ptp20250411t1610.mp4"


# print env variables
logger.info(f"HOSTNAME: {HOSTNAME}")
logger.info(f"ACCESS_KEY: {ACCESS_KEY}")
logger.info(f"SECRET_KEY: {SECRET_KEY}")
logger.info(f"BUCKET_NAME: {BUCKET_NAME}")
logger.info(f"FILEPATH: {FILEPATH}")
logger.info(f"OBJECT_KEY: {OBJECT_KEY}")

session = boto3.session.Session()
client = session.client(
    "s3",
    region_name=HOSTNAME.split(".")[0],
    endpoint_url="https://" + HOSTNAME,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
)

with Path(FILEPATH).open("rb") as file:
    response = client.put_object(
        Bucket=BUCKET_NAME,
        Key=OBJECT_KEY,
        Body=file,
        ACL="public-read",
        ChecksumAlgorithm="sha1",
)

logger.info(response)
