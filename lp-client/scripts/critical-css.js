/**
 * Critical CSS Extraction Script
 * ファーストビューに必要なCSSを抽出します
 */

const fs = require('fs');
const path = require('path');
const { generate } = require('critical');

// 設定
const HTML_FILE = path.join(__dirname, '..', 'index.html');
const CSS_DIR = path.join(__dirname, '..', 'css');
const OUTPUT_FILE = path.join(__dirname, '..', 'critical.css');

console.log('🎯 Critical CSS抽出開始...\n');

const config = {
  // HTML ファイル
  src: HTML_FILE,
  
  // CSS ディレクトリ
  css: [
    path.join(CSS_DIR, 'main.css')
  ],
  
  // 出力先
  target: {
    css: OUTPUT_FILE,
    html: path.join(__dirname, '..', 'index.optimized.html')
  },
  
  // ビューポートサイズ
  dimensions: [
    {
      width: 375,
      height: 667
    }, // iPhone SE
    {
      width: 1920,
      height: 1080
    }  // Desktop
  ],
  
  // オプション
  inline: true,           // HTMLにインライン化
  minify: true,          // 圧縮
  extract: true,         // 元のCSSから削除
  penthouse: {
    timeout: 30000,      // タイムアウト（30秒）
    strict: false,       // 厳密モードを無効化
    renderWaitTime: 500  // レンダリング待機時間
  }
};

generate(config)
  .then(({ css, html }) => {
    // Critical CSSを保存
    fs.writeFileSync(OUTPUT_FILE, css);
    console.log(`✅ Critical CSS: ${OUTPUT_FILE}`);
    console.log(`   サイズ: ${(css.length / 1024).toFixed(2)} KB\n`);

    // 最適化されたHTMLを保存
    if (html) {
      const htmlOutputFile = path.join(__dirname, '..', 'index.optimized.html');
      fs.writeFileSync(htmlOutputFile, html);
      console.log(`✅ 最適化HTML: ${htmlOutputFile}\n`);
    }

    console.log('📝 使用方法:');
    console.log('   1. critical.css の内容を index.html の <head> 内にインライン化');
    console.log('   2. 元の CSS を async で読み込む\n');
    
    console.log('例:');
    console.log('<style>');
    console.log('  /* critical.css の内容をここにコピー */');
    console.log('</style>');
    console.log('<link rel="preload" href="css/main.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">');
    console.log('<noscript><link rel="stylesheet" href="css/main.css"></noscript>');

    console.log('\n✨ Critical CSS抽出完了！');
  })
  .catch(err => {
    console.error('❌ エラーが発生しました:', err.message);
    console.error('\n💡 ヒント:');
    console.error('   - HTMLファイルが存在するか確認してください');
    console.error('   - CSSファイルのパスが正しいか確認してください');
    console.error('   - npm install critical を実行してください');
    process.exit(1);
  });

