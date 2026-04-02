"""記事1のOGP画像を生成（1200x630）"""

import os
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

def generate_ogp():
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), "#ffffff")
    draw = ImageDraw.Draw(img)

    # ヘッダーライン（ティールブルー）
    draw.rectangle([0, 0, W, 6], fill="#00AFCC")

    # タイトルテキスト
    title_lines = [
        "フリーランスコンサルタントとは",
        "報酬の相場から探し方まで、",
        "発注企業向けに解説",
    ]

    # フォント（Noto Sans JP がなければデフォルト）
    font_title = ImageFont.truetype("C:/Windows/Fonts/NotoSansJP-VF.ttf", 42)
    font_sub = ImageFont.truetype("C:/Windows/Fonts/NotoSansJP-VF.ttf", 20)

    # タイトル描画
    y = 160
    for line in title_lines:
        bbox = draw.textbbox((0, 0), line, font=font_title)
        tw = bbox[2] - bbox[0]
        x = (W - tw) // 2
        draw.text((x, y), line, fill="#1f2937", font=font_title)
        y += 64

    # サブテキスト（ARROW pro）
    sub_text = "ARROW pro"
    bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, H - 80), sub_text, fill="#00AFCC", font=font_sub)

    # フッターライン
    draw.rectangle([0, H - 6, W, H], fill="#00AFCC")

    filepath = os.path.join(OUTPUT_DIR, "ogp.png")
    img.save(filepath)
    print(f"Saved: {filepath} ({W}x{H})")

if __name__ == "__main__":
    generate_ogp()
