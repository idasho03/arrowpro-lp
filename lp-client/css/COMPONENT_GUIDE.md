# コンポーネント使用ガイド

## 📦 Base Components

### Colors (カラーパレット)

```css
/* 使用可能なカラー変数 */
var(--cerulean)      /* メインカラー: #00afcc */
var(--cabaret)       /* アクセント: #e43f6f */
var(--charade)       /* テキスト: #1f2937 */
var(--white)         /* 背景: #ffffff */
var(--lochmara)      /* セカンダリ: #007accbf */
```

**使用例:**
```css
.my-element {
  color: var(--cerulean);
  background-color: var(--white);
}
```

### Typography (タイポグラフィ)

```html
<!-- 見出し（青・太字・24px） -->
<h2 class="notosansjp-bold-cerulean-24px">見出しテキスト</h2>

<!-- 本文（黒・通常・16px） -->
<p class="notosansjp-normal-charade-16px">本文テキスト</p>

<!-- 強調（赤・太字・20px） -->
<span class="notosansjp-bold-cabaret-20px">強調テキスト</span>
```

**利用可能なクラス:**
- `notosansjp-bold-cerulean-{size}px` - 青色太字
- `notosansjp-bold-cabaret-{size}px` - 赤色太字
- `notosansjp-normal-charade-{size}px` - 黒色通常
- `notosansjp-bold-white-{size}px` - 白色太字

---

## 🎨 Layout Components

### Grid System (グリッドシステム)

```html
<!-- デスクトップ用レイアウト -->
<div class="index screen">
  <!-- コンテンツ -->
</div>

<!-- モバイル用レイアウト -->
<div class="mobile screen">
  <!-- コンテンツ -->
</div>

<!-- タブレット用レイアウト -->
<div class="tablet screen">
  <!-- コンテンツ -->
</div>
```

**自動切り替え:**
- モバイル: 767px以下
- タブレット: 768px-1023px
- デスクトップ中: 1024px-1439px
- デスクトップ大: 1440px以上

### Header (ヘッダー)

```html
<header class="header">
  <div class="logo-1">
    <img src="img/logo.svg" alt="ARROW pro" />
  </div>
  <div class="cta-1">
    <a href="#" class="custom-button-arrowpro">ログイン</a>
    <a href="#" class="custom-button-arrowpro">新規登録</a>
  </div>
</header>
```

**特徴:**
- 固定ヘッダー（position: fixed）
- レスポンシブ対応
- ドロップシャドウ付き

### Footer (フッター)

```html
<footer class="footer">
  <div class="grid-grid-cols-2-mdg">
    <div class="logo">
      <img src="img/logo-white.svg" alt="ARROW pro" />
    </div>
    <div class="footer-links">
      <!-- リンク -->
    </div>
  </div>
</footer>
```

---

## 🧩 UI Components

### Buttons (ボタン)

#### 基本ボタン
```html
<a href="#" class="custom-button-arrowpro">ボタンテキスト</a>
```

**状態:**
- `:hover` - 浮き上がるアニメーション
- `:active` - 押し込むアニメーション

**レスポンシブ:**
- PC: `min-width: 112px`, `font-size: 16px`
- モバイル: `min-width: 72px`, `font-size: 14px`

#### ボタンラッパー
```html
<div class="button-wrapper-arrowpro">
  <a href="#" class="custom-button-arrowpro">ボタン1</a>
  <a href="#" class="custom-button-arrowpro">ボタン2</a>
</div>
```

### Cards (カード)

#### Feature Card（特徴カード）
```html
<div class="feature_0">
  <div class="feature-icon">
    <img src="img/icon.svg" alt="" />
  </div>
  <h3 class="feature-title">特徴タイトル</h3>
  <p class="feature-description">
    特徴の詳細説明がここに入ります。
  </p>
</div>
```

**特徴:**
- ホバー時に浮き上がる
- レスポンシブ対応
- シャドウ付き

#### Problem Card（課題カード）
```html
<div class="problem">
  <h3 class="problem-title">課題タイトル</h3>
  <p class="problem-description">課題の説明</p>
</div>
```

### FAQ Accordion（FAQアコーディオン）

```html
<div class="q-1">
  <div class="frame-14171">
    <div class="frame-14149-1">Q</div>
    <div class="div">質問がここに入ります</div>
    <div class="faq-arrow">▼</div>
  </div>
  <div class="frame-14172">
    <div class="div2">
      <span class="div-2-span">回答: </span>
      <span class="div-2-span2">回答の詳細がここに入ります。</span>
    </div>
  </div>
</div>
```

**JavaScript連携:**
```javascript
document.querySelectorAll('.frame-14171').forEach(item => {
  item.addEventListener('click', () => {
    item.closest('.q-1').classList.toggle('active');
  });
});
```

**特徴:**
- クリックで展開/折りたたみ
- 滑らかなアニメーション
- ホバー時のハイライト

---

## 📄 Page Sections

### Hero Section（ヒーローセクション）

```html
<div class="fv">
  <div class="test">
    <div class="title_catch">
      <div class="title-1">
        <div class="frame-1418">
          <h1 class="text notosansjp-bold-cerulean-48px">
            企業からプロフェッショナルに
          </h1>
        </div>
        <div class="frame-1418">
          <div class="text notosansjp-bold-cerulean-48px">
            "白羽の矢"を。
          </div>
        </div>
      </div>
      <div class="text-3-1">
        フリーコンサルタントに特化した、<br />
        企業が個人と直接繋がるプラットフォーム
      </div>
    </div>
    
    <!-- Point badges -->
    <div class="point">
      <div class="frame-14187">
        <div class="ellipse-6"></div>
        <div class="text-1 notosansjp-bold-white-20px">
          大手<br />コンサル<br />出身者多数
        </div>
      </div>
    </div>
  </div>
  
  <div class="frame-14195">
    <img class="demo_c_right" src="img/hero.png" alt="Demo" />
  </div>
</div>
```

### Problems Section（課題セクション）

```html
<div class="problems">
  <div class="title">
    <h2 class="problems-1 notosansjp-bold-cabaret-25px">
      こんなお悩みありませんか？
    </h2>
  </div>
  
  <div class="problems-2">
    <div class="problem">
      <h3 class="problem-title">課題1</h3>
      <p class="problem-description">説明文</p>
    </div>
    <!-- 他の課題カード -->
  </div>
</div>
```

### Features Section（特徴セクション）

```html
<div class="features">
  <div class="title">
    <h2 class="notosansjp-bold-cerulean-32px">ARROW proの特徴</h2>
  </div>
  
  <div class="feature_1-2">
    <div class="feature_0">
      <div class="feature-icon">
        <img src="img/icon1.svg" alt="" />
      </div>
      <h3 class="feature-title">特徴1</h3>
      <p class="feature-description">説明</p>
    </div>
    
    <div class="feature_0-1">
      <div class="feature-icon">
        <img src="img/icon2.svg" alt="" />
      </div>
      <h3 class="feature-title">特徴2</h3>
      <p class="feature-description">説明</p>
    </div>
  </div>
</div>
```

### CTA Section（行動喚起セクション）

```html
<div class="cta">
  <h2 class="notosansjp-bold-cerulean-32px">今すぐ始めましょう</h2>
  <p class="notosansjp-normal-charade-16px">
    無料で登録して、優秀な人材と出会おう
  </p>
  <div class="button-wrapper-arrowpro">
    <a href="#" class="custom-button-arrowpro">無料登録</a>
  </div>
</div>
```

---

## 🎯 ベストプラクティス

### 1. クラス名の使い方

```html
<!-- 良い例 -->
<div class="feature_0">
  <h3 class="feature-title notosansjp-bold-cerulean-24px">...</h3>
</div>

<!-- 避けるべき例 -->
<div style="display: flex;">  <!-- インラインスタイルは避ける -->
  <h3>...</h3>
</div>
```

### 2. レスポンシブ対応

```css
/* モバイルファースト（推奨） */
.my-component {
  padding: 20px;  /* モバイル用 */
}

@media (min-width: 768px) {
  .my-component {
    padding: 40px;  /* タブレット以上 */
  }
}
```

### 3. CSS変数の活用

```css
/* 良い例 */
.my-element {
  color: var(--cerulean);
  font-size: var(--font-size-m);
}

/* 避けるべき例 */
.my-element {
  color: #00afcc;  /* ハードコードは避ける */
  font-size: 16px;
}
```

### 4. 階層構造の維持

```
base/        → 変数、リセット、タイポグラフィ
↓
layout/      → グリッド、ヘッダー、フッター
↓
components/  → 再利用可能なUI部品
↓
pages/       → ページ固有のスタイル
```

---

## 🔧 カスタマイズ

### 新しいカラーの追加

1. `base/_variables.css` に追加:
```css
:root {
  --my-color: #ff6b6b;
}
```

2. 使用:
```css
.my-element {
  color: var(--my-color);
}
```

### 新しいコンポーネントの作成

1. 適切なディレクトリにファイルを作成:
```
components/_my-component.css
```

2. `main.css` でインポート:
```css
@import url('components/_my-component.css');
```

3. HTMLで使用:
```html
<div class="my-component">...</div>
```

---

## 📚 参考リンク

- [CSS変数の使い方](https://developer.mozilla.org/ja/docs/Web/CSS/Using_CSS_custom_properties)
- [Flexboxガイド](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [レスポンシブデザインのベストプラクティス](https://web.dev/responsive-web-design-basics/)

---

**最終更新**: 2025年10月11日

