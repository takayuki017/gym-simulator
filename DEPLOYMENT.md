# 🚀 Deployment Guide

## GitHub公開手順

### 1. GitHubでリポジトリを作成

1. https://github.com/new にアクセス
2. Repository name: `gym-simulator`
3. Description: "AI-powered virtual test marketing platform for protein product development"
4. Public を選択
5. 「Create repository」をクリック

### 2. リモートリポジトリを追加してプッシュ

```bash
cd "/Users/takayuki_kashiwazaki/Calude Code/gym-simulator"
git remote add origin https://github.com/YOUR_USERNAME/gym-simulator.git
git branch -M main
git push -u origin main
```

`YOUR_USERNAME`をあなたのGitHubユーザー名に置き換えてください。

---

## Vercelへのデプロイ

### 1. Vercelアカウントにログイン

https://vercel.com にアクセスしてログイン

### 2. プロジェクトをインポート

1. 「Add New」→「Project」をクリック
2. GitHubリポジトリを接続
3. `gym-simulator`を選択
4. 「Import」をクリック

### 3. 環境変数を設定

1. 「Environment Variables」セクションに移動
2. 以下を追加：
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: あなたのAnthropic APIキー
   - **Environment**: Production, Preview, Development すべてにチェック

3. 「Deploy」をクリック

### 4. デプロイ完了

数分後、デプロイが完了します。
あなたのアプリは `https://gym-simulator-xxx.vercel.app` のようなURLでアクセス可能になります。

---

## Netlifyへのデプロイ（代替）

### 1. Netlifyにログイン

https://app.netlify.com にアクセス

### 2. 新しいサイトを作成

1. 「Add new site」→「Import an existing project」
2. GitHubを接続
3. `gym-simulator`を選択

### 3. ビルド設定

- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18 以上

### 4. 環境変数

1. Site settings → Environment variables
2. `ANTHROPIC_API_KEY`を追加

### 5. デプロイ

「Deploy site」をクリック

---

## カスタムドメイン設定（オプション）

### Vercel

1. Project Settings → Domains
2. カスタムドメインを追加
3. DNSレコードを設定

### Netlify

1. Site settings → Domain management
2. Add custom domain
3. DNS設定を更新

---

## 継続的デプロイ

GitHubにプッシュすると、自動的にデプロイされます：

```bash
git add .
git commit -m "Update features"
git push
```

Vercel/Netlifyが自動的に検出して再デプロイします。

---

## トラブルシューティング

### ビルドエラー

- `npm install`が正常に動作するか確認
- Node.jsバージョンを18以上に設定

### APIエラー

- 環境変数`ANTHROPIC_API_KEY`が正しく設定されているか確認
- APIキーが有効か確認

### パフォーマンス

- Vercelの無料プランでは制限があります
- 多くのユーザーが同時に使用する場合はProプランを検討

---

## セキュリティ

- APIキーは絶対にコードにコミットしない
- `.env.local`は`.gitignore`に含まれている
- 本番環境では環境変数として設定
