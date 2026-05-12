"""channels.pptx の2ページ目（クライアント視点）をPNGエクスポート"""
import os
from pathlib import Path
import comtypes.client

PPTX = r"C:\Users\idash\OneDrive - 株式会社Swallo\02_ARROW pro\04'_マーケティング\SEO_GEO\channels.pptx"
OUT = Path(r"C:\Projects\ds_lp\arrowpro-sub-contents\column\what-is-freelance-consultant\channels-client.png")

# 記事4と同じサイズ
WIDTH = 2879
HEIGHT = 1020

OUT.parent.mkdir(parents=True, exist_ok=True)

powerpoint = comtypes.client.CreateObject("PowerPoint.Application")
powerpoint.Visible = 1
presentation = powerpoint.Presentations.Open(PPTX, WithWindow=False)
try:
    slide = presentation.Slides[2]  # 1-indexed, 2ページ目
    slide.Export(str(OUT), "PNG", WIDTH, HEIGHT)
    print(f"保存: {OUT}")
finally:
    presentation.Close()
    powerpoint.Quit()
