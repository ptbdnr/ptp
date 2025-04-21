from __future__ import annotations

import logging
import os
from typing import Optional

import boto3
import boto3.session
import dotenv
import requests

logging.basicConfig(
    format="%(asctime)s,%(msecs)03d %(levelname)-8s [%(filename)s:%(lineno)d] %(message)s",
    datefmt="%Y-%m-%d:%H:%M:%S",
    level=logging.DEBUG,
)
logger = logging.getLogger(__name__)

dotenv.load_dotenv(".env.local")

class ObjectStoreClient:
    """Vultr Object Storage."""

    hostname: str
    client: any

    def __init__(
            self,
            hostname: Optional[str] = None,
            access_key: Optional[str] = None,
            secret_key: Optional[str] = None,
    ) -> None:
        """Initialize instance."""
        self.hostname = hostname or os.environ.get("VULTR_OBJECT_STORAGE_HOSTNAME")
        access_key = access_key or os.environ.get("VULTR_OBJECT_STORAGE_ACCESS_KEY")
        secret_key = secret_key or os.environ.get("VULTR_OBJECT_STORAGE_SECRET_KEY")
        logger.debug("Vultr Object Store parameters: %s", {
            "hostname": self.hostname,
            "access_key": access_key,
            "secret_key": secret_key,
        })

        session = boto3.session.Session()
        self.client = session.client(
            "s3",
            region_name=self.hostname.split(".")[0],
            endpoint_url="https://" + self.hostname,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            config=boto3.session.Config(signature_version="s3v4"),
        )
        logger.info("S3 client created")

    def create_bucket(
            self,
            bucket_name: str,
            access_level: str = "public-read",
            *,
            drop_old_bucket: bool = False,
    ) -> str:
        """Create an object store bucket."""
        # Check if bucket exists
        bucket_list = self.client.list_buckets()
        bucket_exists = False
        for bucket in bucket_list["Buckets"]:
            if bucket["Name"] == bucket_name:
                bucket_exists = True
                break
        if bucket_exists:
            logger.info("Bucket %s already exists", bucket_name)
            if drop_old_bucket:
                self.client.delete_bucket(Bucket=bucket_name)
                logger.info("Bucket %s deleted", bucket_name)
                self.client.create_bucket(Bucket=bucket_name, ACL=access_level)
                logger.info("Bucket %s created", bucket_name)
            return bucket_name
        logger.info("Bucket %s does not exist", bucket_name)
        self.client.create_bucket(Bucket=bucket_name, ACL=access_level)
        logger.info("Bucket %s created", bucket_name)
        return bucket_name

    def insert(
            self,
            bucket_name: str,
            object_key: str,
            content: bytes,
            access_level: str = "public-read",
    ) -> dict:
        """Insert a payload."""
        signed_url = self.client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": bucket_name,
                "Key": object_key,
                "ACL": access_level,
            },
            ExpiresIn=300,
        )

        # Upload using signed URL
        response = requests.put(
            signed_url,
            data=content,
            headers={
                # "Content-Type": "image/png",
                "x-amz-acl": access_level,
            },
            timeout=30000,
        )
        response.raise_for_status()

        logger.info("Object %s uploaded to bucket %s", object_key, bucket_name)
        return f"https://{bucket_name}.{self.hostname}/{object_key}"
