import asyncio
import sys
from lumagen import LumaImageGenerator

async def main(prompt):
    # Initialize the generator
    generator = LumaImageGenerator()
    
    try:
        # Generate image with the provided prompt
        result = await generator.generate_image(prompt)
        print("Image generated successfully!")
        print(f"URL: {result['image_url']}")
        print(f"Width: {result['image_width']}px")
        print(f"Height: {result['image_height']}px")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_image.py \"Your prompt here\"")
        sys.exit(1)
        
    prompt = sys.argv[1]
    asyncio.run(main(prompt))
