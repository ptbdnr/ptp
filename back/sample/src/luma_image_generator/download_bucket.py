import boto3
import os
from dotenv import load_dotenv

def download_bucket_contents():
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

    # Create downloads directory if it doesn't exist
    download_dir = os.path.join(os.path.dirname(__file__), "downloads")
    os.makedirs(download_dir, exist_ok=True)

    try:
        # List and download objects
        response = s3.list_objects_v2(Bucket=bucket_name)
        if 'Contents' in response:
            print(f"Downloading contents from bucket '{bucket_name}':")
            for obj in response['Contents']:
                file_name = obj['Key']
                download_path = os.path.join(download_dir, file_name)
                
                print(f"- Downloading {file_name}...")
                s3.download_file(bucket_name, file_name, download_path)
                print(f"  Saved to {download_path}")
        else:
            print(f"The bucket '{bucket_name}' is empty.")
    except Exception as e:
        print(f"Error downloading bucket contents: {str(e)}")

if __name__ == "__main__":
    download_bucket_contents()
