/**
 * lp-client の PNG を WebP に変換（タスク1用）
 * 実行: npm run images:webp （arrowpro-sub-contents で）
 * 前提: lp-client/img/01-hero/demo-c-right.png, 05-usecase/advisor.png, 09-common/favicon.png が存在すること
 */

const path = require('path');
const fs = require('fs');

const root = path.join(__dirname, '..');
const lpClientImg = path.join(root, 'lp-client', 'img');

const tasks = [
  { dir: '01-hero', name: 'demo-c-right', quality: 85 },
  { dir: '05-usecase', name: 'advisor', quality: 85 },
  { dir: '09-common', name: 'favicon', quality: 90 },
];

async function run() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('sharp が入っていません。先に npm install sharp を実行してください。');
    process.exit(1);
  }

  for (const { dir, name, quality } of tasks) {
    const srcPath = path.join(lpClientImg, dir, `${name}.png`);
    const outPath = path.join(lpClientImg, dir, `${name}.webp`);

    if (!fs.existsSync(srcPath)) {
      console.warn(`スキップ（ファイルなし）: ${srcPath}`);
      continue;
    }

    try {
      await sharp(srcPath)
        .webp({ quality })
        .toFile(outPath);
      console.log(`OK: ${name}.png → ${name}.webp`);
    } catch (err) {
      console.error(`エラー ${srcPath}:`, err.message);
    }
  }
}

run();
