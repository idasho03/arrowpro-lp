"""各記事のOGP画像（1200×630）を生成（ミニマル版：ロゴ＋ビジュアル大＋短いキャッチ）"""
import base64
from pathlib import Path
from html2image import Html2Image

BASE = Path(r"C:\Projects\ds_lp\arrowpro-sub-contents\column")
OUT_TMP = Path(r"C:\Projects\ds_lp\arrowpro-sub-contents\scripts\_ogp_tmp")
OUT_TMP.mkdir(exist_ok=True)


def img_to_data_uri(path: Path) -> str:
    data = base64.b64encode(path.read_bytes()).decode()
    return f"data:image/png;base64,{data}"


# ARROW pro 矢羽根ロゴ（濃いめのダークグレーに変更）
LOGO_SVG = """<svg width="32" height="36" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.8469 0.185568C26.1105 0.250496 24.3701 0.165191 22.6349 0.231283C21.9352 0.275539 21.3574 1.14112 21.6671 1.88648C21.8642 2.50403 22.481 2.71312 23.0165 2.69024C24.0803 2.6585 25.1454 2.67277 26.2097 2.64132C21.3412 8.08868 16.4531 13.5145 11.597 18.9752C11.368 19.2236 11.1967 19.6661 10.8109 19.5626C8.63012 19.5742 6.44744 19.548 4.26774 19.5772C3.51002 19.6537 3.0823 20.4501 2.56378 20.969C1.78298 21.9595 0.774425 22.7302 0.142928 23.8613C-0.249104 24.5183 0.219598 25.4401 0.890905 25.5355C1.70416 25.6953 2.5348 25.5209 3.35544 25.5739C4.14129 25.5722 4.92718 25.5797 5.71296 25.5652C5.11812 26.2918 4.36969 26.8719 3.8838 27.7028C3.53789 28.264 3.76279 29.0331 4.26376 29.368C4.66518 29.7542 5.24266 29.5855 5.58786 29.1983C6.21577 28.6158 6.76479 27.9373 7.3402 27.2928C7.34645 28.8043 7.30857 30.3183 7.35739 31.8283C7.37511 32.5356 7.88269 33.2306 8.55097 33.1811C9.30868 33.0172 9.72077 32.1815 10.2649 31.6517C10.9788 30.8003 11.7807 30.0344 12.4348 29.1248C12.8421 28.382 12.6363 27.4609 12.6903 26.6387C12.6947 24.8692 12.6804 23.0995 12.6878 21.3301C13.38 20.4246 14.2173 19.6711 14.9431 18.7988C19.0344 14.2235 23.1376 9.66151 27.2069 5.06249C27.387 4.86392 27.5623 4.66011 27.7338 4.45231C27.7674 5.87561 27.7437 7.30039 27.7608 8.72316C27.7702 9.37276 28.1604 10.1008 28.8013 10.0943C29.4094 10.1677 30.0137 9.61143 29.9858 8.90755C30.0103 6.39565 29.9999 3.88141 29.979 1.3698C30.0194 0.708344 29.4372 0.306616 28.9137 0.249054C28.5622 0.178594 28.2028 0.180327 27.8469 0.185568ZM5.40461 22.0568C6.52431 22.0551 7.64388 22.0713 8.76354 22.0771C8.44625 22.3992 8.17101 22.8265 7.82939 23.0845C6.5021 23.125 5.17445 23.0728 3.847 23.0787C4.15712 22.7369 4.45612 22.3681 4.80086 22.0749C5.00159 22.0603 5.20341 22.0626 5.40461 22.0568ZM10.4365 25.3416C10.4217 26.1888 10.46 27.0553 10.4118 27.8906C10.1297 28.2433 9.83199 28.5803 9.52556 28.9066C9.54327 27.5138 9.52428 26.1208 9.53025 24.728C9.79302 24.3424 10.1185 24.0175 10.4324 23.6853C10.4337 24.2374 10.4352 24.7895 10.4365 25.3416Z" fill="#00AFCC"/>
</svg>"""


COMMON_CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1200px; height: 630px; background: #fff;
       font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif;
       color: #1f2937; overflow: hidden; }
.wrap { width: 1200px; height: 630px; padding: 28px 48px 24px;
        display: flex; flex-direction: column; position: relative; }
.brand { display: flex; align-items: center; gap: 10px; }
.brand-text { font-size: 18px; font-weight: 800; color: #00AFCC; letter-spacing: -0.01em; }
.brand-meta { font-size: 13px; font-weight: 600; color: #888; margin-left: 4px; }
.visual { flex: 1; display: flex; align-items: center; justify-content: center;
          margin: 8px 0; }
.catch { font-size: 22px; font-weight: 800; color: #1f2937; line-height: 1.4;
         border-top: 1px solid #e5e5e5; padding-top: 16px; }
.marker { background: linear-gradient(transparent 60%, rgba(0,175,204,0.32) 60%);
          padding: 0 2px; }
.marker-warn { background: linear-gradient(transparent 60%, rgba(255,122,82,0.32) 60%);
               padding: 0 2px; }
.footer { position: absolute; right: 48px; bottom: 22px; font-size: 12px; color: #aaa; }
"""


def shell(visual_html: str, catch: str) -> str:
    return f"""<!DOCTYPE html><html><head><meta charset='UTF-8'><style>{COMMON_CSS}</style></head>
<body><div class='wrap'>
  <div class='brand'>{LOGO_SVG}<span class='brand-text'>ARROW pro</span><span class='brand-meta'>コラム</span></div>
  <div class='visual'>{visual_html}</div>
  <div class='catch'>{catch}</div>
  <div class='footer'>arrowpro.jp/column</div>
</div></body></html>"""


# ---- 各記事のOGP ----

# 記事1: ランク別ピラミッド
ART1_SVG = """
<svg viewBox="0 0 1100 420" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1100px;height:auto;">
  <polygon points="290,20 350,20 386,100 254,100" fill="#4b5563"/>
  <polygon points="254,100 386,100 422,180 218,180" fill="#4b5563"/>
  <polygon points="218,180 422,180 458,260 182,260" fill="#4b5563"/>
  <polygon points="182,260 458,260 494,340 146,340" fill="#4b5563"/>
  <polygon points="146,340 494,340 530,420 110,420" fill="#4b5563"/>
  <g font-family="'Noto Sans JP','Hiragino Sans',sans-serif">
    <rect x="180" y="36" width="280" height="48" rx="6" fill="#fff" stroke="#4b5563" stroke-width="1.5"/>
    <text x="320" y="58" text-anchor="middle" font-size="16" font-weight="700" fill="#1f2937">シニアマネージャー以上</text>
    <text x="320" y="76" text-anchor="middle" font-size="12" fill="#555">経営層のアドバイザリー</text>
    <rect x="180" y="116" width="280" height="48" rx="6" fill="#fff" stroke="#4b5563" stroke-width="1.5"/>
    <text x="320" y="138" text-anchor="middle" font-size="16" font-weight="700" fill="#1f2937">マネージャー</text>
    <text x="320" y="156" text-anchor="middle" font-size="12" fill="#555">プロジェクト全体の設計・進行</text>
    <rect x="180" y="196" width="280" height="48" rx="6" fill="#fff" stroke="#4b5563" stroke-width="1.5"/>
    <text x="320" y="218" text-anchor="middle" font-size="16" font-weight="700" fill="#1f2937">シニアコンサルタント</text>
    <text x="320" y="236" text-anchor="middle" font-size="12" fill="#555">担当領域の責任者</text>
    <rect x="180" y="276" width="280" height="48" rx="6" fill="#fff" stroke="#4b5563" stroke-width="1.5"/>
    <text x="320" y="298" text-anchor="middle" font-size="16" font-weight="700" fill="#1f2937">コンサルタント</text>
    <text x="320" y="316" text-anchor="middle" font-size="12" fill="#555">担当領域の実務推進</text>
    <rect x="180" y="356" width="280" height="48" rx="6" fill="#fff" stroke="#4b5563" stroke-width="1.5"/>
    <text x="320" y="378" text-anchor="middle" font-size="16" font-weight="700" fill="#1f2937">アナリスト</text>
    <text x="320" y="396" text-anchor="middle" font-size="12" fill="#555">リサーチ・データ分析</text>
  </g>
  <g font-family="'Noto Sans JP',sans-serif">
    <text x="560" y="68" font-size="32" font-weight="800" fill="#00AFCC">200〜350万円</text>
    <text x="560" y="148" font-size="32" font-weight="800" fill="#00AFCC">200〜300万円</text>
    <text x="560" y="228" font-size="32" font-weight="800" fill="#00AFCC">180〜250万円</text>
    <text x="560" y="308" font-size="32" font-weight="800" fill="#00AFCC">150〜200万円</text>
    <text x="560" y="388" font-size="32" font-weight="800" fill="#00AFCC">120〜170万円</text>
  </g>
</svg>
"""
art1_html = shell(
    ART1_SVG,
    "ファーム出身者の報酬は<span class='marker'>月額150〜250万円</span>がボリュームゾーン",
)

# 記事2: 3経路図
ch2 = img_to_data_uri(BASE / "what-is-freelance-consultant" / "channels-client.png")
ART2_VISUAL = f'<img src="{ch2}" style="max-width:100%;max-height:460px;object-fit:contain;" />'
art2_html = shell(
    ART2_VISUAL,
    "<span class='marker'>知人・紹介／エージェント／ダイレクトプラットフォーム</span>の3経路を比較",
)

# 記事3: チェックリスト
ART3_VISUAL = """
<div style="display:flex; gap:20px; width:100%; max-width:1080px;">
  <div style="flex:1; background:#f0f8ff; border:1px solid #e0f2f8; border-radius:8px; padding:22px 24px;">
    <div style="font-size:15px;font-weight:800;color:#1f2937;border-left:4px solid #00AFCC;padding-left:10px;margin-bottom:14px;">Step 1：プロフィール</div>
    <ul style="margin:0; padding-left:20px; font-size:15px; line-height:1.9; color:#1f2937;">
      <li>出身ファーム・在籍期間</li>
      <li>最終ランクと<b>昇格の有無</b></li>
      <li>所属部門・PJ領域</li>
      <li>稼働率・開始時期</li>
    </ul>
  </div>
  <div style="flex:1; background:#f0f8ff; border:1px solid #e0f2f8; border-radius:8px; padding:22px 24px;">
    <div style="font-size:15px;font-weight:800;color:#1f2937;border-left:4px solid #00AFCC;padding-left:10px;margin-bottom:14px;">Step 2：面談</div>
    <ul style="margin:0; padding-left:20px; font-size:15px; line-height:1.9; color:#1f2937;">
      <li>過去PJの役割・アウトプット</li>
      <li><b>仮説ベースで答えられるか</b></li>
      <li>建設的な質問が出るか</li>
      <li>相互フィットを確認</li>
    </ul>
  </div>
  <div style="flex:1; background:#fff5f0; border:1px solid #ffe0d0; border-radius:8px; padding:22px 24px;">
    <div style="font-size:15px;font-weight:800;color:#1f2937;border-left:4px solid #ff7a52;padding-left:10px;margin-bottom:14px;">Step 3：注意サイン</div>
    <ul style="margin:0; padding-left:20px; font-size:15px; line-height:1.9; color:#1f2937;">
      <li>在籍1〜2年で離脱</li>
      <li>高ランクのまま昇格なし</li>
      <li>仮説が出てこない</li>
      <li>候補者から質問なし</li>
    </ul>
  </div>
</div>
"""
art3_html = shell(
    ART3_VISUAL,
    "<span class='marker'>スクリーニング・面談・注意サイン</span>の選定チェックリスト",
)

# 記事4: 3チャネル図（プロ視点）
ch4 = img_to_data_uri(BASE / "how-to-become-freelance-consultant" / "channels.png")
ART4_VISUAL = f'<img src="{ch4}" style="max-width:100%;max-height:460px;object-fit:contain;" />'
art4_html = shell(
    ART4_VISUAL,
    "独立準備と<span class='marker'>3つの案件獲得チャネル</span>",
)

# 記事5: テーマ別バーチャート
ART5_SVG = """
<svg viewBox="0 0 1100 430" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1100px;height:auto;">
  <text x="550" y="20" text-anchor="middle" font-size="15" font-weight="700" fill="#1f2937">プロジェクトテーマ別 月額単価レンジ（万円）</text>
  <g font-size="13">
    <rect x="720" y="34" width="16" height="13" fill="#00AFCC" rx="2"/>
    <text x="744" y="46" fill="#1f2937">直接契約</text>
    <rect x="830" y="34" width="16" height="13" fill="#ff7a52" rx="2"/>
    <text x="854" y="46" fill="#1f2937">仲介経由</text>
  </g>
  <g stroke="#e5e5e5" stroke-width="1">
    <line x1="100" y1="390" x2="1060" y2="390"/>
    <line x1="100" y1="328" x2="1060" y2="328" stroke-dasharray="2,2"/>
    <line x1="100" y1="252" x2="1060" y2="252" stroke-dasharray="2,2"/>
    <line x1="100" y1="176" x2="1060" y2="176" stroke-dasharray="2,2"/>
    <line x1="100" y1="100" x2="1060" y2="100" stroke-dasharray="2,2"/>
  </g>
  <g font-size="12" fill="#666" text-anchor="end">
    <text x="92" y="394">100</text>
    <text x="92" y="332">150</text>
    <text x="92" y="256">200</text>
    <text x="92" y="180">250</text>
    <text x="92" y="104">320</text>
  </g>
  <!-- 戦略 200-320 / 仲介 140-220 -->
  <rect x="170" y="74" width="40" height="216" fill="#00AFCC" rx="2"/>
  <rect x="216" y="206" width="40" height="146" fill="#ff7a52" rx="2"/>
  <text x="190" y="66" text-anchor="middle" font-size="13" font-weight="800" fill="#1f2937">320</text>
  <text x="190" y="306" text-anchor="middle" font-size="11" fill="#666">200</text>
  <text x="236" y="198" text-anchor="middle" font-size="13" font-weight="800" fill="#ff7a52">220</text>
  <text x="236" y="368" text-anchor="middle" font-size="11" fill="#ff7a52">140</text>
  <!-- SAP・ERP 170-240 / 仲介 120-170 -->
  <rect x="340" y="158" width="40" height="132" fill="#00AFCC" rx="2"/>
  <rect x="386" y="252" width="40" height="100" fill="#ff7a52" rx="2"/>
  <text x="360" y="150" text-anchor="middle" font-size="13" font-weight="800" fill="#1f2937">240</text>
  <text x="360" y="306" text-anchor="middle" font-size="11" fill="#666">170</text>
  <text x="406" y="244" text-anchor="middle" font-size="13" font-weight="800" fill="#ff7a52">170</text>
  <text x="406" y="370" text-anchor="middle" font-size="11" fill="#ff7a52">120</text>
  <!-- AI・DX 150-220 / 仲介 110-150 -->
  <rect x="510" y="198" width="40" height="124" fill="#00AFCC" rx="2"/>
  <rect x="556" y="268" width="40" height="74" fill="#ff7a52" rx="2"/>
  <text x="530" y="190" text-anchor="middle" font-size="13" font-weight="800" fill="#1f2937">220</text>
  <text x="530" y="338" text-anchor="middle" font-size="11" fill="#666">150</text>
  <text x="576" y="260" text-anchor="middle" font-size="13" font-weight="800" fill="#ff7a52">150</text>
  <text x="576" y="358" text-anchor="middle" font-size="11" fill="#ff7a52">110</text>
  <!-- 業務改善 140-200 / 仲介 100-140 -->
  <rect x="680" y="228" width="40" height="106" fill="#00AFCC" rx="2"/>
  <rect x="726" y="284" width="40" height="76" fill="#ff7a52" rx="2"/>
  <text x="700" y="220" text-anchor="middle" font-size="13" font-weight="800" fill="#1f2937">200</text>
  <text x="700" y="350" text-anchor="middle" font-size="11" fill="#666">140</text>
  <text x="746" y="276" text-anchor="middle" font-size="13" font-weight="800" fill="#ff7a52">140</text>
  <text x="746" y="376" text-anchor="middle" font-size="11" fill="#ff7a52">100</text>
  <!-- IT・システム導入 120-180 / 仲介 80-130 -->
  <rect x="850" y="258" width="40" height="106" fill="#00AFCC" rx="2"/>
  <rect x="896" y="298" width="40" height="78" fill="#ff7a52" rx="2"/>
  <text x="870" y="250" text-anchor="middle" font-size="13" font-weight="800" fill="#1f2937">180</text>
  <text x="870" y="380" text-anchor="middle" font-size="11" fill="#666">120</text>
  <text x="916" y="290" text-anchor="middle" font-size="13" font-weight="800" fill="#ff7a52">130</text>
  <text x="916" y="392" text-anchor="middle" font-size="11" fill="#ff7a52">80</text>
  <g font-size="13" fill="#1f2937" text-anchor="middle">
    <text x="213" y="416">戦略</text>
    <text x="383" y="416">SAP・ERP</text>
    <text x="553" y="416">AI・DX</text>
    <text x="723" y="416">業務改善</text>
    <text x="893" y="416">IT・システム導入</text>
  </g>
</svg>
"""
art5_html = shell(
    ART5_SVG,
    "テーマ別レンジと<span class='marker-warn'>仲介経由で30〜40%目減りする手取り差</span>",
)

# 記事6: 課金構造比較
ART6_VISUAL = """
<table style="width:100%; max-width:1080px; border-collapse:collapse; font-size:17px;">
  <thead>
    <tr style="background:#f5f7fa;">
      <th style="padding:18px 20px; text-align:left; font-size:15px; color:#1f2937; border-bottom:2px solid #1f2937; width:22%;"></th>
      <th style="padding:18px 20px; text-align:left; font-size:17px; font-weight:800; color:#1f2937; border-bottom:2px solid #1f2937;">エージェント型</th>
      <th style="padding:18px 20px; text-align:left; font-size:17px; font-weight:800; color:#00AFCC; border-bottom:2px solid #1f2937;">ダイレクトプラットフォーム</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:16px 20px; font-weight:700; color:#1f2937; border-bottom:1px solid #e5e5e5;">課金対象</td>
      <td style="padding:16px 20px; border-bottom:1px solid #e5e5e5;">コンサルタントの報酬から控除</td>
      <td style="padding:16px 20px; border-bottom:1px solid #e5e5e5;">クライアント企業から徴収</td>
    </tr>
    <tr>
      <td style="padding:16px 20px; font-weight:700; color:#1f2937; border-bottom:1px solid #e5e5e5;">料金体系</td>
      <td style="padding:16px 20px; border-bottom:1px solid #e5e5e5;">報酬の20〜40%を継続控除</td>
      <td style="padding:16px 20px; border-bottom:1px solid #e5e5e5;">月額固定 or 成約時のみ</td>
    </tr>
    <tr>
      <td style="padding:16px 20px; font-weight:700; color:#1f2937; border-bottom:1px solid #e5e5e5;">長期化の影響</td>
      <td style="padding:16px 20px; border-bottom:1px solid #e5e5e5;"><span style="background:linear-gradient(transparent 60%,rgba(255,122,82,0.32) 60%); font-weight:800;">累積控除額が増え続ける</span></td>
      <td style="padding:16px 20px; border-bottom:1px solid #e5e5e5;"><span style="background:linear-gradient(transparent 60%,rgba(0,175,204,0.32) 60%); font-weight:800;">期間に関係なくほぼ一定</span></td>
    </tr>
    <tr>
      <td style="padding:16px 20px; font-weight:700; color:#1f2937;">コンサルタント報酬</td>
      <td style="padding:16px 20px;">マージン控除後の額</td>
      <td style="padding:16px 20px; font-weight:800; color:#00AFCC;">交渉した単価そのまま</td>
    </tr>
  </tbody>
</table>
"""
art6_html = shell(
    ART6_VISUAL,
    "エージェント型 vs <span class='marker'>ダイレクトプラットフォーム</span>の構造差",
)


articles = {
    "what-is-freelance-consultant": art1_html,
    "direct-consulting": art2_html,
    "how-to-evaluate-consultants": art3_html,
    "how-to-become-freelance-consultant": art4_html,
    "freelance-consultant-rate": art5_html,
    "direct-contract": art6_html,
}

hti = Html2Image(output_path=str(OUT_TMP), size=(1200, 630),
                 custom_flags=["--disable-gpu", "--hide-scrollbars", "--default-background-color=00000000"])

for slug, html in articles.items():
    fname = f"ogp_{slug}.png"
    hti.screenshot(html_str=html, save_as=fname)
    src = OUT_TMP / fname
    dest = BASE / slug / "ogp.png"
    dest.write_bytes(src.read_bytes())
    print(f"{slug} -> {dest}")
