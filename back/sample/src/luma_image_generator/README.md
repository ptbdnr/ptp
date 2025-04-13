# Luma Image Generator

This project provides a complete solution for generating images using Luma AI and managing them in Vultr S3 storage. It includes both command-line tools and a Python API for programmatic usage.

## Setup

### 1. Environment Configuration
Create a `.env` file in the project root with your credentials:
```dotenv
LUMAAI_API_KEY=your_luma_api_key
VULTR_OBJECT_STORAGE_HOSTNAME=ams1.vultrobjects.com
VULTR_OBJECT_STORAGE_ACCESS_KEY=your_vultr_access_key
VULTR_OBJECT_STORAGE_SECRET_KEY=your_vultr_secret_key
```

### 2. Install Dependencies
Install required Python packages:
```bash
pip install -r requirements.txt
```

## Scripts

### 1. generate_image.py
Generates images using Luma AI and stores them in Vultr S3.

**Usage:**
```bash
python generate_image.py "Your prompt here"
```

**Example:**
```bash
python generate_image.py "A futuristic cityscape at sunset"
```

**Output:**
- Prints the image URL and dimensions
- Stores the image in your S3 bucket

### 2. list_bucket.py
Lists all files in your S3 bucket.

**Usage:**
```bash
python list_bucket.py
```

**Output:**
- Lists all files with their names, sizes, and last modified dates

### 3. download_bucket.py
Downloads all files from your S3 bucket to local storage.

**Usage:**
```bash
python download_bucket.py
```

**Output:**
- Downloads files to `C:\luma_image_generator\downloads`
- Prints the save location of each file

## Core Components

### lumagen.py
The main Python class that handles all image generation and storage operations.

**Key Features:**
- Asynchronous image generation using Luma AI
- Automatic S3 bucket creation if needed
- Secure file uploads using signed URLs
- Comprehensive error handling and logging

**Example Usage:**
```python
from lumagen import LumaImageGenerator
import asyncio

async def main():
    generator = LumaImageGenerator()
    result = await generator.generate_image("A beautiful landscape")
    print(result)

asyncio.run(main())
```

### example.py
Demonstrates basic usage of the LumaImageGenerator class.

**Purpose:**
- Shows how to initialize the generator
- Demonstrates image generation with a sample prompt
- Handles errors gracefully

**Usage:**
```bash
python example.py
```

## Directory Structure
```
luma_image_generator/
├── downloads/            # Downloaded images
├── .env                  # Environment variables
├── requirements.txt      # Python dependencies
├── lumagen.py            # Main image generator class
├── generate_image.py     # Image generation script
├── list_bucket.py        # S3 bucket listing script
├── download_bucket.py    # S3 download script
├── example.py            # Example usage
└── README.md             # This documentation
```

## Requirements
- Python 3.8+
- boto3
- aiohttp
- Pillow
- python-dotenv
- lumaai

## Best Practices
1. Always keep your `.env` file secure and never commit it to version control
2. Use descriptive prompts for better image generation results
3. Regularly check your S3 bucket storage usage
4. Handle exceptions properly in your code when using the LumaImageGenerator class
