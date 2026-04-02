"""記事1（フリーランスコンサルタントとは）のアイキャッチ画像を生成"""

import os
import base64
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_IMAGE_API_KEY"])

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

def generate_image(prompt: str, filename: str):
    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"],
        ),
    )
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            filepath = os.path.join(OUTPUT_DIR, filename)
            with open(filepath, "wb") as f:
                f.write(part.inline_data.data)
            print(f"Saved: {filepath}")
            return filepath
    print("No image generated")
    return None

if __name__ == "__main__":
    prompt = """Generate a clean, professional illustration for a Japanese business article about freelance consultants.

Style requirements:
- Flat, minimal illustration style (not photorealistic)
- Color palette: primarily #00AFCC (teal blue) and #1f2937 (dark gray), with white background
- No text in the image
- Aspect ratio: 16:9 (wide)
- Clean, modern Japanese business media aesthetic

Scene: A professional meeting between a business person (client) and a consultant, sitting across a table with laptops. The atmosphere should be collaborative and direct (no intermediary). Simple office background with minimal details.

IMPORTANT: The image MUST be wide landscape format, 16:9 aspect ratio (e.g. 1200x675 pixels). Do NOT generate a square image.
"""
    generate_image(prompt, "hero.png")
