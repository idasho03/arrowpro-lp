import os
from google import genai
from google.genai import types
from PIL import Image

client = genai.Client(api_key=os.environ["GEMINI_IMAGE_API_KEY"])
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

def generate_image(prompt, filename):
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
            img = Image.open(filepath)
            w, h = img.size
            target_h = int(w * 9 / 16)
            if h > target_h:
                top = (h - target_h) // 2
                img = img.crop((0, top, w, top + target_h))
            img.save(filepath)
            print(f"Saved: {filepath} ({img.size[0]}x{img.size[1]})")
            return
    print("No image generated")

prompt = """Generate a clean, professional illustration comparing two business models side by side.

Style requirements:
- Flat, minimal business illustration
- Line-based drawing with light fills
- Color palette: primarily teal (#00AFCC) and dark gray (#1f2937), white background
- No text in the image
- Simple and restrained tone
- Same style as: two business people sitting across a table with laptops in a meeting

Scene: Left side shows three people in a chain (indirect model with middleman). Center has a "vs" symbol. Right side shows two people directly facing each other (direct model, no middleman). The contrast between indirect and direct should be clear but subtle.

CRITICAL: Do NOT include any text labels, words, or letters in the image. The only text allowed is "vs" in the center. Wide landscape format, 16:9 aspect ratio.
"""

generate_image(prompt, "hero.png")
