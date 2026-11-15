# Word Learner

英検5級/4級/3級の単語を、日本語の意味から英単語のスペルをタイピングして学ぶゲーム。Laravel + Inertia.js + React のモノリス構成。

設計・決定事項・実装の進め方は [docs/](./docs/01-overview.md) を参照してください。

## ローカル開発

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
