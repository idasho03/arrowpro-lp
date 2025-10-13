/**
 * CSS Build Script
 * すべてのCSSファイルを1つにまとめます（開発用）
 */

const fs = require('fs');
const path = require('path');

// 設定
const CSS_DIR = path.join(__dirname, '..', 'css');
const OUTPUT_DIR = path.join(__dirname, '..', 'dist', 'css');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'bundle.css');

console.log('🔨 CSS Build開始...\n');

// 出力ディレクトリを作成
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`✅ 出力ディレクトリを作成: ${OUTPUT_DIR}\n`);
}

// @import を解決する関数
function resolveImports(cssContent, basePath) {
  const importRegex = /@import\s+url\(['"]?([^'"]+)['"]?\);/g;
  let match;
  let resolvedCss = cssContent;

  while ((match = importRegex.exec(cssContent)) !== null) {
    const importPath = match[1];
    const fullPath = path.join(basePath, importPath);
    
    try {
      const importedCss = fs.readFileSync(fullPath, 'utf8');
      console.log(`  📦 インポート: ${importPath}`);
      
      // 再帰的に解決
      const resolvedImport = resolveImports(importedCss, path.dirname(fullPath));
      
      // @import文を実際のCSSで置き換え
      resolvedCss = resolvedCss.replace(match[0], `\n/* ${importPath} */\n${resolvedImport}\n`);
    } catch (error) {
      console.warn(`  ⚠️  インポートをスキップ: ${importPath} (${error.message})`);
      resolvedCss = resolvedCss.replace(match[0], `/* ${importPath} - not found */`);
    }
  }

  return resolvedCss;
}

try {
  // main.css を読み込み
  const mainCssPath = path.join(CSS_DIR, 'main.css');
  console.log(`📖 読み込み: ${mainCssPath}`);
  
  const mainCss = fs.readFileSync(mainCssPath, 'utf8');
  
  // すべての @import を解決
  console.log('\n🔗 インポートを解決中...');
  const bundledCss = resolveImports(mainCss, CSS_DIR);
  
  // ファイルに保存
  fs.writeFileSync(OUTPUT_FILE, bundledCss);
  
  console.log(`\n✅ ビルド完了: ${OUTPUT_FILE}`);
  console.log(`   サイズ: ${(bundledCss.length / 1024).toFixed(2)} KB`);
  
  // 統計情報
  const lines = bundledCss.split('\n').length;
  const imports = (mainCss.match(/@import/g) || []).length;
  
  console.log(`\n📊 統計:`);
  console.log(`   総行数: ${lines.toLocaleString()}`);
  console.log(`   解決したインポート: ${imports}`);
  
  console.log('\n✨ ビルド完了！');
  console.log('\n💡 次のステップ:');
  console.log('   npm run minify:css - 本番用に圧縮');
  
} catch (error) {
  console.error('❌ エラーが発生しました:', error.message);
  process.exit(1);
}

