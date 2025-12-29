# AGENTS.md

ARROW pro サブコンテンツプロジェクト - AIコーディングエージェント向けガイド

## Commands

### Docker（推奨）

```bash
# 開発サーバー起動
docker compose up dev              # lp-client (port 1234)
docker compose up dev-professional # lp-professional (port 1235)
docker compose up dev-request      # request (port 1236)

# ビルド（static-output内の資材はGithubActionsで作成するため変更をコミットしないこと）
docker compose run --rm build      # 全ターゲットをstatic-output/に出力
```

### ローカル（フォールバック）

```bash
# 開発サーバー起動
npm run dev                # lp-client (port 1234)
npm run dev:professional   # lp-professional (port 1235)
npm run dev:hot            # HMR有効モード

# ビルド（static-output内の資材はGithubActionsで作成するため変更をコミットしないこと）
npm run build              # 全ターゲットをstatic-output/に出力

# PM2によるバックグラウンド実行
npm run dev:pm2            # PM2で起動
npm run stop:pm2           # PM2停止
npm run logs:pm2           # ログ確認

# 静的ファイル配信（代替）
npm run serve:client       # http-serverでlp-client配信
```

## Tech Stack

- **Container**: Docker (Node.js 22 Alpine)
- **Bundler**: Parcel v2.16.0
- **Process Manager**: PM2 v6.0.14（ローカル環境用）
- **Languages**: HTML / CSS / JavaScript (vanilla)
- **Static Server**: http-server v14.1.1

## Project Structure

```
arrowpro-sub-contents/
├── lp-client/              # 企業向けランディングページ
│   ├── index.html
│   ├── css/
│   │   ├── base.css        # リセット、変数、基本スタイル
│   │   ├── components.css  # UIコンポーネント
│   │   ├── layout.css      # レイアウト、レスポンシブ
│   │   └── main.css        # エントリーポイント（@import）
│   ├── js/custom.js        # FAQ、ハンバーガーメニュー、アニメーション
│   └── img/
│
├── lp-professional/        # プロフェッショナル向けランディングページ
│   └── (同様の構成)
│
├── request/                # 資料ダウンロードフォーム
│   ├── index.html          # フォーム本体
│   ├── completed/          # 完了ページ
│   ├── css/style.css
│   └── js/main.js          # バリデーション、API連携
│
├── 06-consultants/         # コンサルタント紹介ページ（一時的な退避資材。削除可能）
│
├── static-output/          # ビルド出力（gitignore対象）
├── Dockerfile              # マルチステージビルド
├── compose.yml             # Docker Compose設定
├── .parcelrc               # Parcel設定
├── ecosystem.config.js     # PM2設定（ローカル用）
└── package.json
```

## Code Style

### CSS

4つのファイルに分離する構成を維持：

```css
/* base.css - CSS変数定義例 */
:root {
  --color-primary: #1a1a2e;
  --color-accent: #e94560;
  --font-family-base: "Noto Sans JP", sans-serif;
}

/* components.css - BEM風の命名 */
.faq-item { }
.faq-item__question { }
.faq-item__answer { }
.faq-item--active { }

/* layout.css - セクション単位 */
.section-hero { }
.section-features { }
```

### JavaScript

```javascript
// DOM取得はDOMContentLoaded内で
document.addEventListener('DOMContentLoaded', () => {
  const element = document.querySelector('.target');
  if (!element) return;

  // イベントリスナー登録
  element.addEventListener('click', handleClick);
});

// 関数は明確な命名
function handleClick(event) {
  event.preventDefault();
  // 処理
}
```

### HTML

```html
<!-- セクション構造 -->
<section class="section-name" id="section-name">
  <div class="container">
    <h2 class="section-title">タイトル</h2>
    <!-- コンテンツ -->
  </div>
</section>

<!-- 画像はWebP優先、alt必須 -->
<img src="./img/example.webp" alt="説明テキスト" loading="lazy">
```

## Project Context

### サービス概要

ARROW pro は企業とフリーコンサルタント（プロフェッショナル）を直接つなぐマッチングプラットフォーム。

### ターゲットユーザー

| ページ | 対象 | 目的 |
|--------|------|------|
| lp-client | 企業の担当者 | コンサルタント採用の訴求 |
| lp-professional | フリーコンサルタント | プラットフォーム登録の訴求 |
| request | 企業担当者 | 資料ダウンロード・リード獲得 |

### 外部連携

- Google Tag Manager: `GTM-WKN2CPSR`
- メールドメイン検証API: `/api/not-free-email`
- OGP・Twitter Card設定済み

## Git Workflow

```bash
# ブランチ命名
feature/機能名
fix/修正内容
chore/作業内容

# コミットメッセージ
feat: 新機能追加
fix: バグ修正
style: スタイル調整
chore: ビルド・設定変更
```

## Boundaries

### Always do

- ビルド確認: 変更後は `npm run build` で出力を確認
- 画像形式: 新規画像はWebP形式を使用
- レスポンシブ: モバイル表示を考慮した実装
- alt属性: img要素には必ずalt属性を設定

### Ask first

- 新規ページ追加: package.jsonのtargets設定が必要
- 外部ライブラリ導入: vanilla JSで実現可能か検討
- API連携の変更: エンドポイントやパラメータの変更
- GTMタグの変更: トラッキングに影響

### Never do

- `static-output/` 内のファイルを直接編集（ビルド生成物）
- `dist/` ディレクトリの使用（旧出力先、非推奨）
- 本番環境のAPIキーやシークレットをコミット
- `node_modules/` や `.parcel-cache/` をコミット

## Troubleshooting

サーバーが落ちた場合は `SERVER_TROUBLESHOOTING.md` を参照。

主な対処法:
```bash
# キャッシュクリア
rm -rf .parcel-cache && npm run dev

# ポート競合確認
lsof -i :1234

# 緊急時の静的配信
npm run serve:client
```
