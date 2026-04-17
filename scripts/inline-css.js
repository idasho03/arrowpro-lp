/**
 * ビルド後処理: CSSファイルをHTMLにインライン化
 *
 * Parcelビルド後に実行し、<link rel="stylesheet"> を <style> タグに置き換える。
 * レンダリングブロック解消により、モバイルLCPを改善する。
 *
 * 使い方: node scripts/inline-css.js
 */

const fs = require('fs');
const path = require('path');

const targets = [
  'static-output/lp-client',
  // 必要に応じて他のターゲットも追加
];

for (const dir of targets) {
  const htmlPath = path.join(__dirname, '..', dir, 'index.html');

  if (!fs.existsSync(htmlPath)) {
    console.log(`SKIP: ${htmlPath} が見つかりません`);
    continue;
  }

  let html = fs.readFileSync(htmlPath, 'utf-8');

  // <link rel="stylesheet" href="..."> を検出してインライン化
  const linkRegex = /<link\s+rel="stylesheet"\s+href="([^"]+)"\s*\/?>/g;
  let match;
  let inlinedCount = 0;

  while ((match = linkRegex.exec(html)) !== null) {
    const cssHref = match[1];
    // publicUrl付きの絶対パスからファイル名だけ取り出す
    const cssFilename = path.basename(cssHref);
    const cssPath = path.join(path.dirname(htmlPath), cssFilename);

    if (!fs.existsSync(cssPath)) {
      console.log(`  WARN: CSS not found: ${cssPath}`);
      continue;
    }

    let cssContent = fs.readFileSync(cssPath, 'utf-8');

    // CSSインライン化時、相対url()はHTML基準で解決されるため
    // CSSファイルと同ディレクトリの相対パスを絶対パスに書き換える
    // 例: url(firm.e3733851.webp) → url(/arrowpro-sub-contents/static-output/lp-client/firm.e3733851.webp)
    const baseUrl = cssHref.substring(0, cssHref.lastIndexOf('/') + 1);
    cssContent = cssContent.replace(
      /url\((?!data:|https?:\/\/|\/\/)([^)]+)\)/g,
      (match, relPath) => {
        // クォート除去
        const cleanPath = relPath.replace(/^['"]|['"]$/g, '');
        return `url(${baseUrl}${cleanPath})`;
      }
    );

    const styleTag = `<style>/* ${path.basename(cssHref)} */${cssContent}</style>`;

    html = html.replace(match[0], styleTag);
    inlinedCount++;
    console.log(`  INLINE: ${path.basename(cssHref)} (${(cssContent.length / 1024).toFixed(1)} KB)`);
  }

  if (inlinedCount > 0) {
    fs.writeFileSync(htmlPath, html, 'utf-8');
    console.log(`OK: ${dir}/index.html — ${inlinedCount}件のCSSをインライン化`);
  } else {
    console.log(`SKIP: ${dir}/index.html — インライン化対象なし`);
  }
}
