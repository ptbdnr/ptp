import boto3
import os
from dotenv import load_dotenv

def list_bucket_contents():
    # Load environment variables
    load_dotenv()
    
    # Get S3 credentials
    hostname = os.getenv("VULTR_OBJECT_STORAGE_HOSTNAME")
    access_key = os.getenv("VULTR_OBJECT_STORAGE_ACCESS_KEY")
    secret_key = os.getenv("VULTR_OBJECT_STORAGE_SECRET_KEY")
    bucket_name = "luma-images"

    # Initialize S3 client
    s3 = boto3.client(
        "s3",
        region_name=hostname.split(".")[0],
        endpoint_url=f"https://{hostname}",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key
    )

    # List objects in the bucket
    try:
        response = s3.list_objects_v2(Bucket=bucket_name)
        if 'Contents' in response:
            print(f"Contents of bucket '{bucket_name}':")
            for obj in response['Contents']:
                print(f"- {obj['Key']} (Size: {obj['Size']} bytes, Last Modified: {obj['LastModified']})")
        else:
            print(f"The bucket '{bucket_name}' is empty.")
    except Exception as e:
        print(f"Error listing bucket contents: {str(e)}")

if __name__ == "__main__":
    list_bucket_contents()
