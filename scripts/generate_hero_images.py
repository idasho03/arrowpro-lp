"""記事5・6用 hero画像をGemini APIで生成（記事1テイストに統一・自動16:9クロップ）"""
import os, base64, urllib.request, urllib.error, json, io
from pathlib import Path
from PIL import Image

API_KEY = os.environ.get('GEMINI_IMAGE_API_KEY')
if not API_KEY:
    raise SystemExit('GEMINI_IMAGE_API_KEY 未設定')

MODEL = 'gemini-2.5-flash-image'
URL = f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent'

# 記事1 hero.png のテイストを参照したスタイル指示
STYLE = (
    'CRITICAL STYLE: 100% FLAT vector illustration with SOLID COLOR FILLS only. '
    'NO line-art outlines on bodies or figures. NO sketchy or hand-drawn texture. '
    'NOT a coloring-book style. NOT manga or comic style. NOT AI-generated looking. '
    'Style is a polished editorial vector illustration like a corporate Japanese business magazine. '
    'Color palette: muted teal-gray (around #7CA8A8 / #5A8B8B), warm gray for suits (#7A7A7A), '
    'dark gray-blue hair (#3A4A5A), white background only. '
    'Figures wear business suits rendered as flat solid color shapes — the suit is one solid teal '
    'shape, the shirt one white shape, no shading, no outlines visible on the suit itself. '
    'CRITICAL FACE RULE: Faces are smooth oval skin-tone shapes with ABSOLUTELY NO eyes, NO mouth, '
    'NO nose, NO eyebrows, NO facial features at all. Just a plain skin-color oval. '
    'Hair is a simple solid dark shape on top of the face. '
    'Environment: minimal office elements (a desk, a window with simple geometric shapes inside, '
    'optionally a bookshelf or plant) — all rendered as flat solid shapes with no outlines. '
    'Composition: figures take up most of the frame, tight composition, side or 3/4 view. '
    'Wide landscape format, aspect ratio 16:9. '
    'The result should look like a polished stock vector illustration you would see on a '
    'Japanese business media website (e.g., NewsPicks, Diamond, Toyo Keizai).'
)

PROMPTS = {
    'freelance-consultant-rate': (
        'A single freelance consultant sitting at an office desk, viewed from the side, '
        'thoughtfully looking at a laptop. The laptop screen shows a simple flat bar chart '
        '(just abstract teal bars, no readable text). Behind the figure: a window made of '
        'simple flat rectangles, a bookshelf as a flat shape with rectangular book spines. '
        'The consultant wears a teal business suit (solid flat color, no shading), white shirt. '
        'Face: smooth oval skin-tone shape with absolutely no facial features. '
        'Hair: simple solid dark shape. '
        'No visible English or Japanese text anywhere. No currency symbols. '
        'Tight composition, the figure and desk fill most of the frame. ' + STYLE
    ),
    'direct-contract': (
        'Two business figures standing and shaking hands across a small office desk, viewed from '
        'the side. Their hands meet firmly in the middle, symbolizing a direct contract. '
        'Each figure faces the other in side profile. '
        'Behind them: a window made of simple flat rectangles, a potted plant as flat shapes. '
        'Both figures wear teal business suits (solid flat color, no shading), white shirts. '
        'Faces: smooth oval skin-tone shapes with absolutely no facial features. '
        'Hair: simple solid dark shapes. '
        'No visible text anywhere. '
        'Tight side-view composition, the two figures and the handshake fill most of the wide frame. '
        'The handshake is the visual focal point. ' + STYLE
    ),
}

OUT_DIR = Path(r'C:\Projects\ds_lp\arrowpro-sub-contents\column')


def generate_and_crop(slug: str, prompt: str):
    body = {
        'contents': [{'parts': [{'text': prompt}]}],
        'generationConfig': {'responseModalities': ['IMAGE']},
    }
    req = urllib.request.Request(
        URL,
        data=json.dumps(body).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'x-goog-api-key': API_KEY},
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            data = json.loads(r.read())
    except urllib.error.HTTPError as e:
        print(f'[{slug}] HTTPError: {e.code} {e.read().decode()[:300]}')
        return False
    parts = data.get('candidates', [{}])[0].get('content', {}).get('parts', [])
    for p in parts:
        b = p.get('inlineData', {})
        if b.get('mimeType', '').startswith('image/'):
            raw = base64.b64decode(b['data'])
            img = Image.open(io.BytesIO(raw))
            w, h = img.size
            # 16:9 にセンタークロップ（余白削減）
            target_ratio = 16 / 9
            current_ratio = w / h
            if current_ratio > target_ratio:
                # 横が長すぎる → 横を削る
                new_w = int(h * target_ratio)
                left = (w - new_w) // 2
                img = img.crop((left, 0, left + new_w, h))
            else:
                # 縦が長すぎる → 縦を削る（上下を均等にクロップ）
                new_h = int(w / target_ratio)
                top = (h - new_h) // 2
                img = img.crop((0, top, w, top + new_h))
            out = OUT_DIR / slug / 'hero.png'
            out.parent.mkdir(parents=True, exist_ok=True)
            img.save(out, format='PNG', optimize=True)
            print(f'[{slug}] 保存: {out} (元 {w}x{h} → クロップ後 {img.size[0]}x{img.size[1]})')
            return True
    print(f'[{slug}] 画像データ取得失敗: {data}')
    return False


import sys
target_slugs = sys.argv[1:] if len(sys.argv) > 1 else list(PROMPTS.keys())
for slug in target_slugs:
    if slug in PROMPTS:
        generate_and_crop(slug, PROMPTS[slug])
