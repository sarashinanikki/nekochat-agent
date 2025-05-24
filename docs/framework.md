## Discord情報交換アシスタント AIプラットフォーム: 技術スタックとシステム構成案

### 1. プロジェクトの目的

Discordで行われる活発な情報交換に対し、AIを活用して会話内容の整理、調査、解説、要約を行い、ユーザーの理解と知識獲得を支援する。特に、過去の会話を振り返りやすくすることに重点を置く。

### 2. コアとなる設計判断

* **Discordデータアクセス:** AIが分析対象とするDiscordの会話データは、分析リクエスト時に都度Discord APIから直接取得する。これにより、Supabase DBにはDiscordの生メッセージを網羅的にアーカイブせず、DBのシンプルさを維持する。
* **Supabaseの役割:** 生成されたAIレポートの保存・管理、ユーザー認証、アプリケーション設定の管理に特化する。
* **利用者規模:** 5名未満の友人間での利用を想定し、インフラの複雑性よりも開発・運用のシンプルさを優先する。
* **UIの主軸:** Webアプリケーション (Next.js) をメインのインターフェースとし、レポート閲覧や対話的な深掘りを可能にする。Discordボットの機能は最小限とする。
* **開発言語:** TypeScriptで可能な限り統一する。

### 3. 技術スタック

| カテゴリ         | 技術                                 | 役割・目的                                                                                                                               |
| :--------------- | :----------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| **AIエージェント** | Mastra (AIエージェントフレームワーク) | AIプラットフォームの中核。データ取得指示、Gemini API連携、処理フローのオーケストレーション。TypeScriptで開発。                                              |
| **LLM** | Gemini API                           | 会話データの分析（整理、調査、解説、要約）を実行する大規模言語モデル。                                                                           |
| **フロントエンド** | Next.js (TypeScript)                 | メインのユーザーインターフェース。AIが生成したレポートの閲覧、対話形式での深掘り機能を提供。                                                              |
| **バックエンド** | Supabase                             |                                                                                                                                          |
|                  | └─ Database (PostgreSQL)             | AIが生成したレポート、ユーザーアカウント情報、アプリケーション設定の永続化。Discordの生メッセージは保存しない。                                               |
|                  | └─ Auth                              | Next.jsアプリケーションのユーザー認証。                                                                                                        |
|                  | └─ Functions (TypeScript)            | Discord APIからのオンデマンドデータ取得とMastraへの連携（Discord APIプロキシ/アダプタ）、Next.jsからのバックエンド処理リクエスト受付、Mastraエージェントの呼び出し。 |
| **Discord連携** | Discord API (discord.js等)         | Supabase Functions経由で、Mastraエージェントの指示に基づき、指定された期間・チャンネルのメッセージを都度取得。                                          |

### 4. システム構成案

```mermaid
graph TD
    subgraph User Interface (Next.js)
        User[ユーザー] -- 1. 分析リクエスト (例: '先週の話題') --> NextApp[Next.js Web UI];
        NextApp -- 2. リクエスト転送 --> SF_UI_API[Supabase Functions (UI向けAPI)];
    end

    subgraph AI Platform & Data Orchestration
        SF_UI_API -- 3. Mastraエージェント起動/指示 --> MastraAgent[Mastra AI Agent (TypeScript)];
        MastraAgent -- 4. Discordデータ取得指示 (期間,チャンネル等) --> SF_DiscordProxy[Supabase Functions (Discord APIプロキシ)];
        SF_DiscordProxy -- 5. Discord API呼び出し (都度取得) --> DiscordAPI[Discord API];
        DiscordAPI -- 6. メッセージデータ返却 --> SF_DiscordProxy;
        SF_DiscordProxy -- 7. 整形済みメッセージデータ返却 --> MastraAgent;
        MastraAgent -- 8. 分析用データをGemini APIへ送信 --> GeminiAPI[Gemini API];
        GeminiAPI -- 9. 分析結果返却 --> MastraAgent;
        MastraAgent -- 10. レポート保存指示と結果を返す --> SF_UI_API;
    end

    subgraph Backend Services (Supabase)
        SF_UI_API -- 11. 生成レポートをDBに保存 --> SupabaseDB[(Supabase DB: レポート, ユーザー情報, 設定)];
        SupabaseAuth[Supabase Auth] -- ユーザー認証 --> NextApp;
        SF_UI_API -- 12. レポート/処理ステータスをUIへ返却 --> NextApp;
        NextApp -- 13. レポート表示 / 対話UI提供 --> User;
    end
```

### 5. 主要なデータフロー（典型的なリクエスト処理）

1.  **ユーザー操作:** ユーザーがNext.jsで構築されたWeb UI上で、特定の期間やチャンネルを指定して会話の分析をリクエストする（例: 「先週の#generalチャンネルの議論をまとめて」）。
2.  **リクエスト受付 (Next.js & Supabase Functions):**
    * Next.jsはリクエストを受け取り、Supabase Functions上に構築されたUI向けAPIエンドポイントに送信する。
3.  **AIエージェント処理 (Mastra):**
    * Supabase FunctionsはMastra AIエージェントを起動（または呼び出し）、ユーザーのリクエスト内容を伝える。
    * Mastraエージェントは、分析に必要なDiscordメッセージの範囲（期間、チャンネル等）を特定する。
4.  **Discordデータ取得 (Supabase Functions - Discord APIプロキシ):**
    * Mastraエージェントは、Supabase Functions上に構築された別のAPIエンドポイント（Discord APIプロキシ/アダプタとして機能）に対し、特定した範囲のメッセージ取得を指示する。
    * このSupabase Functionは、`discord.js`等のライブラリを使用し、Discord APIを直接呼び出して該当メッセージをオンデマンドで取得する（ページネーション処理を含む）。
    * 取得したメッセージデータは、Mastraエージェントが扱いやすい形式に整形されて返却される。
5.  **AI分析 (Gemini API):**
    * Mastraエージェントは、取得・整形された会話データをコンテキスト情報としてGemini APIに送信し、情報の整理、調査、解説、要約などを実行させる。
6.  **レポート生成と保存:**
    * Gemini APIから分析結果を受け取ったMastraエージェントは、これをレポートとして整形する。
    * MastraエージェントはSupabase Functions（UI向けAPI）経由で、生成されたレポートをSupabase DBに保存するよう指示する。
7.  **結果表示:**
    * Supabase Functionsは処理結果（またはレポートへの参照）をNext.jsに返す。
    * Next.jsは受け取ったレポートをユーザーに表示し、必要に応じて対話型のUIでさらなる深掘りを可能にする。
