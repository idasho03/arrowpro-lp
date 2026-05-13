"""記事の Poppins 依存を撤去し、ロゴテキストを SVG 化。
さらに Google Fonts への preconnect/stylesheet 行も削除する。
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "column"
ARTICLES = [d for d in ROOT.iterdir() if d.is_dir() and (d / "index.html").exists() and d.name != "assets"]

OLD_LOGO = (
    '      <img src="../assets/logo.svg" alt="ARROW pro" width="22" height="25">\n'
    '      <span class="col-header__logo-text">ARROW pro</span>'
)
NEW_LOGO = (
    '      <img class="col-header__logo-icon" src="../assets/logo.svg" alt="ARROW pro" width="22" height="24">\n'
    '      <img class="col-header__logo-text-img" src="../assets/logo-text.svg" alt="ARROW pro" width="98" height="20">'
)

FONT_LINES = (
    '  <link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    '  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Poppins:wght@700&display=swap">\n'
)

for art in sorted(ARTICLES):
    p = art / "index.html"
    html = p.read_text(encoding="utf-8")
    before = html
    if OLD_LOGO in html:
        html = html.replace(OLD_LOGO, NEW_LOGO)
    if FONT_LINES in html:
        html = html.replace(FONT_LINES, "")
    if html != before:
        p.write_text(html, encoding="utf-8")
        print(f"updated: {art.name}")
    else:
        print(f"skipped: {art.name}")
