# lp-client 画像の WebP 変換（タスク1）

## 手順

1. **PNG を配置**  
   次のファイルが `lp-client/img/` に存在することを確認してください。  
   - `01-hero/demo-c-right.png`  
   - `05-usecase/advisor.png`  
   - `09-common/favicon.png`  
   （リポジトリに含まれていない場合は、デザインやビルド成果物からコピーしてください。）

2. **依存関係を入れる**  
   `arrowpro-sub-contents` で:  
   `npm install`

3. **変換を実行**  
   `npm run images:webp`  
   → 同じフォルダに `*.webp` が出力されます。

4. **ビルド**  
   `npm run build`  
   トップの HTML はすでに `<picture>` で WebP を優先・PNG をフォールバックするように変更済みです。

## 注意

- WebP が存在しない場合は従来の PNG が表示されます（`<picture>` のフォールバック）。
- favicon は「圧縮のみ」のため、HTML のリンクは引き続き `.png` のままです。
