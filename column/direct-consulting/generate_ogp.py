import os
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

W, H = 1200, 630
img = Image.new("RGB", (W, H), "#ffffff")
draw = ImageDraw.Draw(img)

draw.rectangle([0, 0, W, 6], fill="#00AFCC")
draw.rectangle([0, H - 6, W, H], fill="#00AFCC")

font_title = ImageFont.truetype("C:/Windows/Fonts/NotoSansJP-VF.ttf", 42)
font_sub = ImageFont.truetype("C:/Windows/Fonts/NotoSansJP-VF.ttf", 20)

lines = [
    "フリーランスコンサルタントの探し方",
    "エージェント型と直接契約型を",
    "比較する",
]
y = 160
for line in lines:
    bbox = draw.textbbox((0, 0), line, font=font_title)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, y), line, fill="#1f2937", font=font_title)
    y += 64

sub = "ARROW pro"
bbox = draw.textbbox((0, 0), sub, font=font_sub)
tw = bbox[2] - bbox[0]
draw.text(((W - tw) // 2, H - 80), sub, fill="#00AFCC", font=font_sub)

img.save(os.path.join(OUTPUT_DIR, "ogp.png"))
print("OGP saved")
