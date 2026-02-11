# 🤖 AI反応生成の設定方法

## 1. Anthropic APIキーの取得

1. https://console.anthropic.com/ にアクセス
2. アカウントを作成（まだの場合）
3. API Keysページに移動
4. 「Create Key」をクリックして新しいAPIキーを作成

## 2. 環境変数の設定

`.env.local` ファイルを開いて、取得したAPIキーを設定：

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx
```

## 3. 開発サーバーの再起動

APIキーを設定したら、開発サーバーを再起動：

```bash
# 現在のサーバーを停止（Ctrl+C）
# 再起動
npm run dev
```

## 4. 動作確認

1. ブラウザで http://localhost:3000 を開く
2. 製品コンセプトを入力（例: "医薬品グレードのプロテイン"）
3. 「🚀 Start Simulation」をクリック
4. ペルソナがAI生成の反応を返すことを確認

## 仕組み

- 各ペルソナの`traits`（特性）がプロンプトとして使用されます
- Claude APIがペルソナになりきって、製品コンセプトに対する反応を生成
- 反応は日本語で自然な会話調で生成されます
- ペルソナの年齢、タイプ、性格に基づいてカスタマイズされます

## トラブルシューティング

### エラー: "ANTHROPIC_API_KEY is not configured"
- `.env.local`ファイルが正しく作成されているか確認
- APIキーが正しく設定されているか確認
- 開発サーバーを再起動

### 反応が生成されない
- ブラウザのコンソールでエラーを確認
- APIキーが有効か確認（console.anthropic.comで確認）
- API利用制限に達していないか確認
