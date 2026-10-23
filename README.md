# 📚 読書ログ

読んだ本・読書中の本・読みたい本を記録し、読書の傾向をグラフで振り返る Web アプリです。
Google アカウントでログインすると、記録は自分のアカウントにだけ保存されます。

## 主な機能

- **Google ログイン**：ユーザーごとにデータを分けて保存（他人の記録は見えない・書き換えられない）
- **本の登録・編集・削除**：ステータス（読みたい／読書中／読了）、タイトル、著者、読了日、ジャンル、★評価、メモ
- **書籍検索**：タイトルを入れて 🔍 を押すと Google Books の候補一覧から選択でき、タイトル・著者・表紙を自動入力
- **一覧の検索・絞り込み・並べ替え**：キーワード（タイトル・著者・メモ）、ステータス、ジャンル、読了月、並び順
- **統計**：累計・今年の読了数、読書中／読みたい冊数、平均評価、年別の月別読了数、ジャンル別割合
- **リアルタイム同期**：同じアカウントなら複数の端末で自動的に反映
- スマホ表示対応

## 技術構成

| 役割 | 使用技術 |
|---|---|
| フロントエンド | React 19 + Vite |
| UI | MUI（Material UI） |
| 認証 | Firebase Authentication（Google） |
| データベース | Cloud Firestore（`users/{uid}/books`） |
| グラフ | Chart.js / react-chartjs-2 |
| 書籍情報 | Google Books API |

## 開発環境で動かす

```bash
npm install
npm run dev
```

ほかのコマンド：`npm run build`（本番ビルド）、`npm run lint`（ESLint）、`npm run preview`（ビルド結果の確認）

## Firebase の設定（初回のみ）

1. [Firebase コンソール](https://console.firebase.google.com/) → **Authentication** → ログイン方法で **Google** を有効にする
2. **Authentication → 設定 → 承認済みドメイン** に、公開先のドメインを追加する（`localhost` は最初から入っている）
3. セキュリティルール（本人以外は読み書きできない。`firestore.rules`）を反映する

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules
   ```

### 自分の Firebase プロジェクトを使う場合

`.env.example` を `.env.local` にコピーし、Firebase コンソールの「プロジェクトの設定 → マイアプリ」の値を入れてください。
`.firebaserc` のプロジェクト ID も書き換えます。

### Google Books API キー（推奨）

API キーなしでも検索できますが、共有の利用上限にすぐ達して検索できなくなることがあります。
一般公開する場合は [Google Cloud コンソール](https://console.cloud.google.com/apis/library/books.googleapis.com) で Books API を有効にして API キーを作り、
`.env.local` の `VITE_GOOGLE_BOOKS_API_KEY` に設定してください（キーには HTTP リファラー制限をかけることをおすすめします）。

## 公開（Firebase Hosting）

```bash
npm run build
firebase deploy --only hosting
```

## データ構造

```
users/{uid}/books/{bookId}
  title      : string   タイトル（必須）
  author     : string   著者
  status     : string   "読みたい" | "読書中" | "読了"
  date       : string   読了日 YYYY-MM-DD（読了のときのみ）
  genre      : string   ジャンル
  rating     : number   評価 1〜5（未評価は null）
  memo       : string   メモ・感想
  thumbnail  : string   表紙画像 URL
  createdAt / updatedAt : timestamp
```

> 旧バージョンはログインなしで全員共通の `books` コレクションに保存していました。
> 新しいルールではこのコレクションにアクセスできません。必要なデータは Firebase コンソールから移してください。
