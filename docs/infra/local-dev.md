# ローカル開発環境(すべてDocker)

## 方針

- `docker compose up -d`だけで開発環境が全部立ち上がる。app(Laravel)/ vite(開発用アセットサーバー)/ dbをすべてコンテナで動かす
- ホストにPHP / Composer / Nodeを入れない。`php artisan serve`や`npm run dev`はホストでは打たない
- **例外**: `node_modules`だけはホストにも入れる(`npm ci`。IDEのTSサーバー/ESLint用)
- artisan / composer / npmはすべて`docker compose exec`経由
- ソースはバインドマウント(コード編集は即反映)

Inertiaはフロント・バックエンドが別オリジンではないため、EC3のような「frontend/backend 2サービスが別々に動いて相互に通信する」構成ではなく、**Laravelアプリ1つ+開発用のVite dev serverという組み合わせ**になる([02-decisions-log.md](../02-decisions-log.md))。

## サービス一覧

| サービス | イメージ / ビルド | 役割 | ホスト公開ポート |
|---|---|---|---|
| `app` | `serversideup/php:8.4-fpm-nginx` | Laravel + Inertia。nginx + php-fpm | `8000`(→8080) |
| `vite` | node:22-alpine | `npm run dev`(Vite dev server、HMR用。本番ではビルド成果物をLaravelが配信するだけなので不要) | `5173` |
| `db` | `postgres:16-alpine` | PostgreSQL | `5432` |

キュー・スケジューラ・ストレージ・メール送信を使う機能が無いため、この3サービスのみで足りる。

### 通信経路

```
ブラウザ
  │ GET / , POST /login , POST /game-sessions ...(同一オリジン、Cookie+CSRF)
  ▼
localhost:8000 ── appコンテナ(nginx → php-fpm → Laravel + Inertia)
  │        ▲
  │        └─ 開発中はVite dev server(localhost:5173)からアセットをHMR付きで読み込む
  ▼
db:5432
```

## docker-compose.ymlの要点

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: word_learner
      POSTGRES_USER: word_learner
      POSTGRES_PASSWORD: word_learner
    ports: ["5432:5432"]
    volumes:
      - db-data:/var/lib/postgresql/data

  app:
    image: serversideup/php:8.4-fpm-nginx
    volumes:
      - .:/var/www/html
    environment:
      SSL_MODE: "off"
      PHP_OPCACHE_ENABLE: "0"
      AUTORUN_ENABLED: "false"
    ports: ["8000:8080"]
    depends_on:
      db: { condition: service_healthy }

  vite:
    image: node:22-alpine
    working_dir: /var/www/html
    command: sh -c "npm install && npm run dev -- --host"
    volumes:
      - .:/var/www/html
      - /var/www/html/node_modules
    ports: ["5173:5173"]

volumes:
  db-data:
```

## 環境変数(ローカル)

### .env(要点)

| 変数 | 値 |
|---|---|
| `APP_URL` | `http://localhost:8000` |
| `DB_CONNECTION` | `pgsql` |
| `DB_HOST` | `db` |
| `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | `word_learner` |
| `SESSION_DRIVER` | `database` |
| `SESSION_LIFETIME` | `10080`(7日) |

`FRONTEND_URL`・`SANCTUM_STATEFUL_DOMAINS`・CORS関連の設定は不要(単一オリジンのため、[backend/auth.md](../backend/auth.md))。

## 初回セットアップ

```bash
cp .env.example .env

docker compose up -d --build

docker compose exec app composer install
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate

npm ci    # ホスト。IDE補完・型チェック用
```

## よく使うコマンド

```bash
docker compose up -d
docker compose down            # データは残る
docker compose logs -f app

docker compose exec app php artisan migrate
docker compose exec app php artisan tinker

docker compose exec vite npm run lint
docker compose exec vite npx tsc --noEmit
```

## トラブルシュート

| 症状 | 対処 |
|---|---|
| アセットの変更が反映されない | `vite`コンテナが起動しているか確認(`docker compose logs -f vite`) |
| `vendor`が無い | `docker compose exec app composer install` |
| `could not translate host name "db"` | `.env`の`DB_HOST=db`(`127.0.0.1`はコンテナ自身) |
| ログインしても認証状態が保持されない | `SESSION_DRIVER=database`になっているか、`sessions`マイグレーションを実行済みか確認 |
| 書き込みルートが419(CSRFトークン不一致) | ブラウザのCookieが残っているか確認。開発中に`APP_KEY`を再生成すると既存セッションが無効になるため、Cookieを削除して再ログインする |
