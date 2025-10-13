/**
 * CSS Minification Script
 * 本番環境用にCSSファイルを圧縮します
 */

const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

// 設定
const SOURCE_DIR = path.join(__dirname, '..', 'css');
const OUTPUT_DIR = path.join(__dirname, '..', 'dist', 'css');
const INPUT_FILE = path.join(SOURCE_DIR, 'main.css');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'main.min.css');

console.log('🚀 CSS Minification開始...\n');

// 出力ディレクトリを作成
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`✅ 出力ディレクトリを作成: ${OUTPUT_DIR}`);
}

try {
  // CSSファイルを読み込み
  const css = fs.readFileSync(INPUT_FILE, 'utf8');
  console.log(`📖 読み込み: ${INPUT_FILE}`);
  console.log(`   サイズ: ${(css.length / 1024).toFixed(2)} KB\n`);

  // Minify
  const minified = new CleanCSS({
    level: {
      1: {
        all: true,
        normalizeUrls: false // URLを保持
      },
      2: {
        all: true,
        removeDuplicateRules: true,
        mergeMedia: true,
        restructureRules: true
      }
    },
    sourceMap: true, // ソースマップを生成
    rebaseTo: OUTPUT_DIR
  }).minify(css);

  // エラーチェック
  if (minified.errors.length > 0) {
    console.error('❌ エラー:');
    minified.errors.forEach(err => console.error(`   - ${err}`));
    process.exit(1);
  }

  // 警告表示
  if (minified.warnings.length > 0) {
    console.warn('⚠️  警告:');
    minified.warnings.forEach(warn => console.warn(`   - ${warn}`));
    console.log('');
  }

  // 圧縮されたCSSを保存
  fs.writeFileSync(OUTPUT_FILE, minified.styles);
  console.log(`✅ 圧縮完了: ${OUTPUT_FILE}`);
  console.log(`   サイズ: ${(minified.styles.length / 1024).toFixed(2)} KB`);

  // ソースマップを保存
  if (minified.sourceMap) {
    const sourceMapFile = OUTPUT_FILE + '.map';
    fs.writeFileSync(sourceMapFile, minified.sourceMap.toString());
    console.log(`✅ ソースマップ: ${sourceMapFile}`);
  }

  // 圧縮率を計算
  const originalSize = css.length;
  const minifiedSize = minified.styles.length;
  const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(2);

  console.log(`\n📊 圧縮率: ${reduction}% 削減`);
  console.log(`   元のサイズ: ${(originalSize / 1024).toFixed(2)} KB`);
  console.log(`   圧縮後: ${(minifiedSize / 1024).toFixed(2)} KB`);
  console.log(`   削減量: ${((originalSize - minifiedSize) / 1024).toFixed(2)} KB`);

  console.log('\n✨ Minification完了！');

} catch (error) {
  console.error('❌ エラーが発生しました:', error.message);
  process.exit(1);
}

