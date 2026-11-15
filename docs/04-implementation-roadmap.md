# 実装ロードマップ

機能ごとの縦切り(1機能をバックエンド→フロントエンドまで一気通貫で作って、都度ローカルで動作確認する)で進める。デプロイはまず行わず、ローカルのDocker Composeで動作確認する([infra/local-dev.md](./infra/local-dev.md))。

進捗はこのファイルのチェックボックスで管理する。

## コミット規約

- 実装したら同じコミットでテストも書く(ユニットテストが書きやすい部分のみ。UIの見た目の確認は実際にブラウザで行う)
- ロードマップのステップ単位で、1ステップ実装したらすぐコミットする
- コミットする前に必ず変更内容をユーザーに提示し、確認を得てからコミットする
- ロードマップのチェックボックス更新は、そのステップの実装コミットに含める

## フェーズ1: 土台

- [ ] 1. リポジトリの骨組み: `git init`、`.gitignore`、README骨子
- [ ] 2. ローカルインフラ(db)の用意: `docker-compose.yml`に`db`を追加、`docker compose up -d`で起動確認
- [ ] 3. Laravel雛形 + Breeze(Inertia + React): `composer create-project laravel/laravel .` → `composer require laravel/breeze --dev` → `php artisan breeze:install react`
- [ ] 4. appコンテナ: `docker-compose.yml`に`app`サービス追加、`.env.example`
- [ ] 5. viteコンテナ: `docker-compose.yml`に`vite`サービス追加(`npm run dev`)([infra/local-dev.md](./infra/local-dev.md))
- [ ] 6. 疎通確認: `/`にアクセスしてBreeze標準のウェルカム/ダッシュボード相当のページが表示されることを確認
- [ ] 6.5. ルート`AGENTS.md`を作成: cloneした人のAIエージェントが[customization.md](./customization.md)と`// CUSTOMIZE:`コメント規約を見つけられるようにする([customization.md](./customization.md))

## フェーズ2: 認証

- [ ] 7. Breezeのスキャフォールドから不要な部分を削除: メール認証・パスワードリセット関連のルート/コントローラ/ページ/マイグレーション、プロフィール編集画面([backend/auth.md](./backend/auth.md))
- [ ] 8. DB: `users`テーブル調整(`email`列削除、`name`をUNIQUEに)
- [ ] 9. ログインのレートリミット設定([backend/auth.md](./backend/auth.md#ログインのレートリミット))、`SESSION_LIFETIME=10080`
- [ ] 10. `HandleInertiaRequests::share()`に`auth.user`を追加([backend/auth.md](./backend/auth.md))
- [ ] 11. ログイン/登録ページ(`Pages/Auth/Login.tsx` `Register.tsx`)の見た目をBreezeのデフォルトから調整、ローカルで登録→ログイン→ログアウトを一通り確認

## フェーズ3: ゲーム本体

**フロントエンド(バックエンド接続なしで先に動かせる)**
- [ ] 12. お題データ: `resources/js/lib/words/grade5.ts` `grade4.ts` `grade3.ts` `index.ts` `queue.ts`(英検5級/4級/3級の単語リスト選定・作成、バッグ方式の出題キュー、[frontend/game-engine.md](./frontend/game-engine.md))
- [ ] 13. 入力判定ロジック: `resources/js/lib/judge.ts`([frontend/game-engine.md](./frontend/game-engine.md))
- [ ] 14. `HomeController`(`/`): `grade`クエリを受けてランキングを計算し`Inertia::render('Home', [...])`。この時点ではランキングは空配列でよい
- [ ] 15. トップページの級・モード選択: `Pages/Home.tsx` + `Components/home/`(`LevelSelect` `ModeSelect` `StartGameButton`)、選択値を引き継いで`/play?grade=&mode=`へ遷移
- [ ] 16. `PlayController`(`/play`): `grade`必須・`mode`はenum(`practice`/`challenge`)をバリデーションし、不正なら`/`へリダイレクト。問題なければクエリの`grade` `mode`を`Inertia::render('Play', [...])`に渡す([api.md](./api.md))
- [ ] 17. ゲーム画面: `Pages/Play.tsx`(マウント時に`WORDS_BY_GRADE[grade]`の存在確認、無ければ`/`へリダイレクト) + `Components/game/`(`TypingGame` `Timer`(mm:ss表示) `QuestionCounter` `ComboIndicator` `HintText`(学習モードのみ) `ResultScreen`)、`/play`で実際にプレイして動作確認(級・モード・タイマー表示・コンボ・ボーナス・チャレンジモードの1問7秒スキップが仕様通りか)

## フェーズ4: スコア保存・ランキング

- [ ] 18. DB: `game_sessions`マイグレーション(`grade`カラム含む)、`RecordGameSession` Action([backend/folder-structure.md](./backend/folder-structure.md))
- [ ] 19. `GameSessionController`(`POST /game-sessions`、認証必須)([api.md](./api.md))
- [ ] 20. `HomeController`のランキング計算を実装(`game_sessions`を`grade`で絞って`user_id`でGROUP BY、上位10件、[backend/database-schema.md](./backend/database-schema.md))
- [ ] 21. ゲーム終了時、チャレンジモードかつログイン済みなら`axios.post('/game-sessions', { grade, score })`。学習モードは保存せず「チャレンジモードで挑戦しよう」導線、チャレンジモード未ログインは「ログインするとランキングに記録されます」導線を表示([frontend/game-engine.md](./frontend/game-engine.md))
- [ ] 22. トップページに`Components/ranking/RankingSidebar`を追加。`LevelSelect`の選択に応じて`router.reload({ only: ['grade', 'ranking'] })`でpartial reload(2カラムレイアウト、[frontend/routing.md](./frontend/routing.md))

## フェーズ5: 仕上げ

- [ ] 23. エラー/ローディング/空状態の整備
- [ ] 24. レスポンシブ確認

## フェーズ6: 本番デプロイ(Railway)

- [ ] 25. Railwayプロジェクトを作成しPostgresプラグイン・`app`サービスを追加、環境変数設定([infra/railway.md](./infra/railway.md))
- [ ] 26. ビルドステップで`composer install --no-dev`・`npm ci && npm run build`が通ることを確認
- [ ] 27. 自動生成ドメインでログイン→スコア保存→ランキング表示までの一連の動作を確認

各フェーズのファイルパス・詳細は、着手するタイミングで該当ドキュメント(`docs/backend/*` `docs/frontend/*` `docs/infra/*`)を見ながら詰める。
