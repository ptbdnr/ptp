import asyncio
from lumagen import LumaImageGenerator

async def main():
    try:
        # Initialize the generator
        generator = LumaImageGenerator()
        
        # Generate an image
        result = await generator.generate_image(
            "A futuristic cityscape at sunset"
        )
        
        # Print the results
        print("Image generated successfully!")
        print(f"URL: {result['image_url']}")
        print(f"Width: {result['image_width']}px")
        print(f"Height: {result['image_height']}px")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
