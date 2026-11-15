# Word Learner

日本語の意味を見て、対応する英単語をタイピングするミニゲーム。「寿司打」のタイムアタック・コンボボーナスのゲーム性を引き継ぎつつ、お題を英単語学習に変えたものです。

英検5級/4級/3級相当の単語セットがあらかじめ入っていますが、**このリポジトリはそのまま使うのではなく、好きな単語セットに入れ替えて自分用に作り替えて使うことを想定しています。**

## 自分用に作り替える

git cloneしたら、お使いのAIコーディングエージェント(Claude Code、Cursorなど)に話しかけるだけで単語セットを入れ替えられます。

> 「このゲームのお題をTOEICの英単語に変えて」
> 「英単語じゃなくて漢字の読み方クイズにして」

このリポジトリには`AGENTS.md`(`CLAUDE.md`も同内容)が置いてあり、AIエージェントがそれを読めば[docs/customization.md](./docs/customization.md)に沿って`resources/js/lib/customize/`配下(お題データ・制限時間などの定数)を編集してくれます。手で編集したい場合も同じ場所を見てください。それ以外の`resources/js/lib/`配下はゲームの内部ロジックなので、触る必要はありません。

## ローカルで動かす

詳細は [docs/infra/local-dev.md](./docs/infra/local-dev.md) を参照。

```bash
cp .env.example .env

docker compose up -d --build

docker compose exec app composer install
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate

npm ci    # ホスト。IDE補完・型チェック用
```

`http://localhost:8000` でアプリにアクセスできる。

## 遊び方

1. トップページで級(5級/4級/3級)とモードを選ぶ
   - 学習モード: 答えを見ながら練習する
   - チャレンジモード: 答えを隠して挑戦する。ログインしていればスコアがランキングに記録される
2. 「START GAME」を押すと3秒のカウントダウンのあとスタート
3. 60秒以内にできるだけ多くの単語をタイピングする。ノーミスで5問連続正解するごとに残り時間+2秒のボーナス

ログインしなくても遊べる。ログインが必要なのはスコアをランキングに残すときだけ。

## 技術スタック

Laravel + Inertia.js + React(TypeScript)+ Tailwind CSS のモノリス構成。詳しい設計・決定事項は [docs/](./docs/01-overview.md) を参照してください。
