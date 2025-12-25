# サーバーが落ちる問題の対処法

## 現在の状況
`npm run dev`を直接実行してもサーバーが落ち続ける場合の対処法です。

## 考えられる原因と対処法

### 1. ファイルウォッチャーの制限（Windows）
Windowsでは同時に監視できるファイル数に制限があります。

**対処法：**
```powershell
# キャッシュをクリア
cd arrowpro-sub-contents
Remove-Item -Recurse -Force .parcel-cache -ErrorAction SilentlyContinue
npm run dev
```

### 2. メモリ不足
長時間実行でメモリが増加する場合があります。

**対処法：**
- 定期的にサーバーを再起動（1-2時間ごと）
- タスクマネージャーでNode.jsプロセスのメモリ使用量を確認

### 3. ポートの競合
ポート1234が既に使用されている場合があります。

**対処法：**
```powershell
# ポート1234を使用しているプロセスを確認
netstat -ano | findstr ":1234"

# 必要に応じてプロセスを終了
taskkill /PID <プロセスID> /F
```

### 4. Parcelのキャッシュの問題
キャッシュが破損している可能性があります。

**対処法：**
```powershell
# キャッシュを完全にクリア
cd arrowpro-sub-contents
Remove-Item -Recurse -Force .parcel-cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
npm run dev
```

### 5. 大量のファイル変更
一度に大量のファイルを変更すると、Parcelが追いつかなくなることがあります。

**対処法：**
- ファイルを少しずつ変更する
- 変更後、数秒待ってからブラウザをリロード

## 緊急時の対処法

### サーバーを完全にリセット
```powershell
# 1. すべてのNode.jsプロセスを終了
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force

# 2. キャッシュをクリア
cd arrowpro-sub-contents
Remove-Item -Recurse -Force .parcel-cache -ErrorAction SilentlyContinue

# 3. サーバーを再起動
npm run dev
```

## より安定した代替案

### http-serverを使用（ホットリロードなし）
```powershell
npm run serve:client
```
- ホットリロードはありませんが、より安定しています
- ファイルを変更したら手動でブラウザをリロードしてください

