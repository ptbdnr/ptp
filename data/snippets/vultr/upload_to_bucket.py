import logging

import boto3

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

PROFILE = "****"
S3_BUCKET_NAME = "****"
S3_TARGET_BUCKET_NAME = "****"
REGION = "eu-west-1"

PREFIX = "****"
KEY = "****"
DOWNLOAD_DIR = "download"

session = boto3.session.Session(profile_name=PROFILE)
s3 = boto3.client("s3", REGION)
s3_resource = boto3.resource("s3", REGION)

def upload_object(file_path, bucket_name, object_key):
    try:
        s3.upload_file(file_path, bucket_name, object_key)
        logger.info(f"Successfully uploaded {file_path} to {bucket_name}/{object_key}")
    except Exception as e:
        logger.error(f"Failed to upload {file_path} to {bucket_name}/{object_key}: {e}")

# Example usage
file_path = "path/to/your/file.txt"
object_key = "your/object/key.txt"
upload_object(file_path, S3_BUCKET_NAME, object_key)