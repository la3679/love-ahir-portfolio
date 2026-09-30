import type { Translation } from "./en-US";

/** Japanese (日本語). */
const ja: Translation = {
  brand: "Love Ahir",

  "nav.about": "概要",
  "nav.experience": "経歴",
  "nav.work": "実績",
  "nav.research": "研究",
  "nav.skills": "スキル",
  "nav.expertise": "専門分野",
  "nav.contact": "連絡先",
  "nav.resume": "履歴書",
  "nav.downloadResume": "履歴書をダウンロード",
  "nav.skipToContent": "コンテンツへスキップ",

  "hero.badge": "ソフトウェアエンジニア · フルスタック · バックエンド · 応用 AI",
  "hero.statement": "私は信頼できるフルスタック製品と応用 AI システムを作ります。",
  "hero.roles":
    "データプラットフォームとエンタープライズ SaaS 製品向けに、バックエンドサービス、フルスタックアプリケーション、分散データパイプライン、エージェント型 AI ワークフローを3年以上構築してきたソフトウェアエンジニアです。",
  "hero.seeWork": "実績を見る",
  "hero.resume": "履歴書",
  "hero.transformScene": "ボクセルシーンを変形",
  "hero.formation.identity": "アイデンティティ",
  "hero.formation.architecture": "アーキテクチャ",
  "hero.formation.throughput": "スループット",
  "hero.monogramAlt": "Love Ahir モノグラム",
  "hero.sceneDisclaimer": "形状表現のみ — ライブテレメトリではありません。",

  "hero.stage.label": "アーキテクチャ概要",
  "hero.stage.step.client": "採用担当者が履歴書をアップロードし、職務要件を設定します。",
  "hero.stage.step.api": "スコアリング処理を最初から最後まで担います。",
  "hero.stage.step.match": "キーワードの一致ではなく、意味で候補者を順位付けします。",
  "hero.stage.step.explain": "各スコアの根拠となる不足点を平易な言葉で返します。",
  "hero.stage.store": "PostgreSQL が候補者・求人・スコアを保存します。",
  "hero.stage.disclaimer":
    "実際に開発したプロジェクトの構成図です。製品のスクリーンショットではありません。",
  "hero.stage.cta": "ケーススタディを読む",

  "home.proof.eyebrow": "実績",
  "home.proof.yearsLabel": "エンジニアとしての実務経験年数",
  "home.proof.recordsLabel": "Spark と Delta Lake のパイプラインで1回の実行ごとに処理するレコード数",
  "home.proof.tracesLabel": "エンジニアリング作業の自動化前に評価したエージェントトレース数",
  "home.proof.apisLabel": "マルチテナント SaaS モジュール向けに提供した REST API 数",

  "home.work.eyebrow": "選りすぐりの実績",
  "home.work.title": "作り、測り、リリースする",
  "home.work.description":
    "背景・意思決定・成果まで、物語のすべてを記したプロジェクト。残りはインデックスにあります。",
  "home.work.viewCase": "ケーススタディを読む",
  "home.work.viewAll": "全{{count}}プロジェクト",
  "home.work.built": "構築",
  "home.work.stack": "技術スタック",
  "home.work.outcome": "成果",
  "home.work.repo": "リポジトリ",

  "home.experience.eyebrow": "経歴",
  "home.experience.title": "3年以上の本番エンジニアリング",
  "home.experience.description":
    "データプラットフォームとエンタープライズ SaaS 製品における、バックエンドサービス、フルスタックアプリケーション、データパイプライン、エージェント型 AI。ここでは3つの職務を掲載しています。全経歴は About ページにあります。",
  "home.experience.cta": "経歴と学歴の詳細",

  "home.research.eyebrow": "研究",
  "home.research.title": "プライバシーポリシーはログと一致しているか？",
  "home.research.finding":
    "調査した1,000本の Android アプリのうち67.6%が、ポリシーで一切開示していない機微データをログに記録していました。",
  "home.research.venue": "EASE 2026 · Research Track",
  "home.research.cta": "研究を読む",

  "home.about.cta": "私についてもっと",
  "home.about.photoAlt": "Love Ahir",
  "home.about.nowLabel": "現在",
  "home.about.basedLabel": "拠点",
  "home.about.studiedLabel": "学歴",

  "artifact.label": "主要プロジェクト · システム構成",
  "artifact.stagesLabel": "アーキテクチャを見る",
  "artifact.stage.interface": "例外キュー、証拠、レビュー操作。",
  "artifact.stage.services": "レビュー時に明示的に停止する型付き調査。",
  "artifact.stage.data": "ワークフローの状態と検索可能な証拠。",
  "artifact.stage.systems": "レビュアーの認可と追記専用の監査ログ。",
  "artifact.outcomeLabel": "検証済みの成果",
  "artifact.disclaimer":
    "私が構築したプロジェクトの抽象的なシステム図です。製品のスクリーンショットでも、データのライブ表示でもありません。",
  "artifact.cta": "ケーススタディを読む",
  "artifact.repo": "リポジトリ",

  "capabilities.eyebrow": "できること",
  "capabilities.title": "実際に取り組んでいる領域",
  "capabilities.description":
    "6 つの領域。いずれも公開済みのプロジェクトか、期間の明確な職務に裏づけられています（自己評価ではありません）。",
  "capabilities.languages.title": "言語とフレームワーク",
  "capabilities.languages.body":
    "JVM、Python、TypeScript、モバイル、3D Web の各スタックで本番サービスとインターフェースを構築しています。",
  "capabilities.cloud.title": "クラウドと DevOps",
  "capabilities.cloud.body": "AWS と GCP 上でのコンテナ化されたデリバリーを、CI/CD パイプラインとオブザーバビリティで再現可能なリリースに仕上げます。",
  "capabilities.databases.title": "データベース",
  "capabilities.databases.body":
    "データの形に合わせて、リレーショナル、ドキュメント、グラフ、キャッシュ、メディア保存を選びます。",
  "capabilities.ai.title": "データと AI",
  "capabilities.ai.body":
    "ツール呼び出しと MLflow Tracing を備えたガバナンス付きエージェントワークフロー、大規模な Spark パイプライン、応用機械学習。",
  "capabilities.testing.title": "テストと QA",
  "capabilities.testing.body": "開発から本番までのリリースを守る、ユニット・統合・UI テストの自動化。",
  "capabilities.practices.title": "実践",
  "capabilities.practices.body": "イベント駆動アーキテクチャ、冪等な処理、検索パターン、埋め込みを、システムが必要とする場面で活用します。",
  "capabilities.footnote":
    "上記の技術はいずれも、実際にそれを使ったプロジェクトまたは職務に由来します。",

  "about.eyebrow": "概要",
  "about.title": "リリースするエンジニア — 必要なときには研究レベルの厳密さで",
  "about.description":
    "私はソフトウェアの華やかさのない中核部分に関心があります。洗練されたインターフェースが、思い通りに振る舞わないデータと出会う場所です。面白い問題はそこにこそ存在します。",
  "about.p1":
    "私はデータプラットフォームとエンタープライズ SaaS 製品で3年以上の本番経験を持つソフトウェアエンジニアです。仕事の大半はバックエンドにあります。Python・Java サービス、マルチテナントの REST API、PostgreSQL のパフォーマンスチューニング、1回の実行で1,000万件以上のレコードを処理する Spark パイプライン、そしてそのすべてをリリース可能に保つテストと CI/CD です。",
  "about.p2":
    "もう半分は、人が実際に触れる部分です。React と TypeScript の画面、再利用可能な UI コンポーネント、そしてデモではなく評価によって価値を証明するエージェント型 AI ワークフロー。スタックのどちら側でも、レイテンシ、信頼性、そして数字が動いたかどうかで仕事を測ります。",
  "about.p3":
    "厳密さは研究から来ています。RIT では 1,000 本の Android アプリを自動操作する Python ツールを作り、8,600万件以上のログを各アプリの公開プライバシーポリシーと突き合わせて分析しました。この成果は EASE 2026 Research Track に掲載されています。大規模な自動化、丁寧な検証、そして結果を正直に書くこと。これらはそのままエンジニアリングに持ち帰った習慣です。",
  "about.education": "学歴",
  "about.gpa": "GPA",

  "experience.eyebrow": "経歴",
  "experience.title": "バックエンド・データ・フルスタック・応用 AI にまたがる3年以上",
  "experience.description":
    "データプラットフォームとエンタープライズ SaaS 製品の本番システム、そして RIT での大学院研究と教育。期間と勤務地はそのまま記載しています。",
  "experience.current": "現職",
  "experience.group.industry": "産業でのエンジニアリング",
  "experience.group.research-teaching": "研究と教育",

  "exp.databricks.role": "ソフトウェアエンジニア（AI Platform）",
  "exp.databricks.focus": "エージェント型 AI とデータプラットフォームエンジニアリング",
  "exp.databricks.summary":
    "開発者向け・データ向けワークフローのために、ガバナンス付きエージェントワークフロー、バックエンドサービス、大規模 Spark パイプライン、フルスタックのプラットフォーム機能を構築しています。",
  "exp.databricks.a1":
    "Databricks Agent Framework、ツール呼び出し、MLflow Tracing を用いてガバナンス付きのエージェント型 AI ワークフローを統合し、1,000件以上のエージェントトレースを評価したうえで、スプリントごとに4つの定型エンジニアリング作業を自動化しました。",
  "exp.databricks.a2":
    "ワークスペース、ジョブ、メタデータ操作向けに Python バックエンドサービスと Java SDK 連携を開発し、キャッシュ、バリデーション、障害処理を加えることで、失敗するサービス呼び出しを18%削減しました。",
  "exp.databricks.a3":
    "Apache Spark と Delta Lake 上に PySpark と SQL のパイプラインを構築して1回の実行で1,000万件以上のレコードを処理し、インクリメンタルロードと Unity Catalog によるガバナンスで実行時間を2.5時間から40分に短縮しました。",
  "exp.databricks.a4":
    "Python、FastAPI、React、TypeScript を用いてフルスタックのプラットフォーム機能を開発し、10以上の開発者向け・データ向けワークフローにわたって REST API、非同期ワークフロー、再利用可能な UI コンポーネントを構築しました。",
  "exp.databricks.a5":
    "pytest、統合テスト、Git、Bazel、自動化された CI/CD パイプラインでサービスを本番化し、開発・ステージング・本番の各リリースにわたる150件以上の自動チェックを維持しました。",
  "exp.databricks.a6":
    "フロントエンド、プラットフォーム、データ、SRE のエンジニアと連携して API を設計し、分散システムの障害を解決し、オブザーバビリティとリリース準備を強化した8件以上の本番ワークフローを提供しました。",

  "exp.neon-software-engineer-2.role": "ソフトウェアエンジニア II",
  "exp.neon-software-engineer-2.summary":
    "エンタープライズ SaaS プラットフォームのために、マルチテナント SaaS モジュールを設計し、PostgreSQL のパフォーマンスを改善し、リリースを堅牢化しました。",
  "exp.neon-software-engineer-2.a1":
    "Java、Spring Boot、Python、React でマルチテナント SaaS モジュールを設計し、テナント設定、アクセス制御、通知、顧客向け管理機能のための REST API を20以上提供しました。",
  "exp.neon-software-engineer-2.a2":
    "クエリチューニング、インデックス設計、コネクションプーリングにより PostgreSQL を最適化し、25万件以上のレコードと ML 予測データを扱うサービスで p95 レイテンシを2.1秒から480ミリ秒に短縮しました。",
  "exp.neon-software-engineer-2.a3":
    "定期処理と大量データロードのための Python バックグラウンドジョブを構築して長時間処理を顧客向けサービスから切り離し、API のタイムアウトエラーを24%削減しました。",
  "exp.neon-software-engineer-2.a4":
    "JUnit、pytest、Docker、Git、Jenkins、AWS のデプロイワークフローで本番リリースを堅牢化し、API とデータベースの不具合を解消しながら、SaaS 環境全体で12回のアプリケーションリリースを支えました。",
  "exp.neon-software-engineer-2.a5":
    "コードレビュー、デバッグセッション、API 設計の指導、テストの実践を通じて3名のジュニアエンジニアを指導し、技術タスクの調整と、再利用可能なバックエンド・データベース開発標準の徹底を担いました。",

  "exp.neon-associate-software-engineer.role": "アソシエイトソフトウェアエンジニア",
  "exp.neon-associate-software-engineer.summary":
    "ユーザー、承認、レポート、管理のワークフロー向けに、エンタープライズ SaaS の機能、REST API、Python による自動化を構築しました。",
  "exp.neon-associate-software-engineer.a1":
    "React.js、Java、Spring Boot、PostgreSQL でエンタープライズ SaaS のワークフロー機能を開発し、ユーザー、承認、レポート、管理ワークフロー向けのレスポンシブな画面と15以上の REST API を構築しました。Jenkins パイプラインでデプロイし、手作業を減らしてユーザーの効率を高めました。",
  "exp.neon-associate-software-engineer.a2":
    "10万件以上の業務レコードを扱う Python スクリプトでデータ検証、定期レポート、ファイル処理を自動化し、サポートチームの作業を週7時間削減しました。",
  "exp.neon-associate-software-engineer.a3":
    "シニアエンジニア、QA、プロダクトチームと協力して JUnit と pytest の統合テストを作成し、スプリントリリースを通じて18件以上の本番不具合を解決しました。",

  "exp.rit-research-assistant.role": "大学院研究アシスタント — プライバシーとセキュリティ",
  "exp.rit-research-assistant.summary":
    "Android アプリがプライバシーポリシーで約束することと、実際にログへ記録することの差を測定した EASE 2026 論文の共著者です。",
  "exp.rit-research-assistant.a1":
    "EASE 2026 Research Track に採録。8,600万件超の実ログを、公開されたプライバシーポリシーと突き合わせて分析しました。",
  "exp.rit-research-assistant.a2":
    "ADB、Monkey、logcat を用いた自動アプリ探索と挙動分析のための Python ツールを構築しました。",
  "exp.rit-research-assistant.a3":
    "調査対象アプリの67.6%が、ポリシーで一切開示していない機微データを漏らしていることを明らかにしました。",

  "exp.rit-teaching-assistant.role": "ティーチングアシスタント — ソフトウェア品質保証",
  "exp.rit-teaching-assistant.summary":
    "Xueling Zhang 博士のもとで SWEN 777 の大学院講義を支援し、テスト方法論と論文セミナーを通じて学生を指導しました。",
  "exp.rit-teaching-assistant.a1":
    "大学院生をソフトウェアテスト方法論で指導し、課題の質と講義満足度を高めました。",
  "exp.rit-teaching-assistant.a2":
    "25本超の研究論文を読み解くセミナーを主導し、受講生全体の批判的読解と議論を鍛えました。",
  "exp.rit-teaching-assistant.a3":
    "Slack・メール・Zoom で毎週オフィスアワーを開き、課題や研究で詰まった学生を支援しました。",

  "work.eyebrow": "インデックス",
  "work.title": "すべての実績",
  "work.description": "プロダクト・研究・データにわたる{{count}}件のプロジェクトと、{{studies}}件の詳細なケーススタディ。",
  "work.featuredHeading": "ケーススタディ",
  "work.archiveHeading": "その他のプロジェクト",
  "work.caseStudy": "ケーススタディ",
  "work.external": "外部リンク",
  "category.Web App": "Web アプリ",
  "category.Mobile App": "モバイルアプリ",
  "category.Machine Learning": "機械学習",
  "category.Data Analysis": "データ分析",
  "case.tradeops-copilot.summary": "取得した証拠と必須の人間によるレビューを使い、合成取引データの例外を調査します。",
  "case.sentinelflow.summary": "信頼性のあるイベント配信、リスクスコア、アナリストの調査を通じて合成取引を追跡します。",
  "case.navisight.summary": "地図、分析、証拠を表示するコパイロットで船舶の過去の動きを探索します。",
  "case.webops-commander.summary": "ブラウザのツールで模擬インシデントを調査し、復旧の実行前に人間が承認します。",
  "category.Game Development": "ゲーム開発",
  "category.Automation": "自動化",
  "category.Publication": "論文",

  "case.eyebrow": "ケーススタディ",
  "case.context": "背景",
  "case.problem": "課題",
  "case.approach": "アプローチ",
  "case.shipped": "リリースしたもの",
  "case.retro": "次はこう変える",
  "case.metrics": "成果",
  "case.stack": "スタック",
  "case.role": "役割",
  "case.timeframe": "期間",
  "case.viewRepo": "リポジトリを見る",
  "case.viewPaper": "論文を見る",
  "case.viewLive": "ライブで見る",
  "case.next": "次のケーススタディ",
  "case.prev": "前のケーススタディ",
  "case.backToIndex": "すべての実績へ戻る",

  "case.privacy-policies-vs-logs.summary":
    "1,000本の Android アプリがプライバシーポリシー通りに動作しているかを測定した EASE 2026 の実証研究。",
  "case.ar-gesture-lab.summary":
    "3D ワールド座標を画面ピクセルへ投影し、Appium がライブ AR オブジェクトへのジェスチャーを自動化できるようにするテストハーネス。",
  "case.vidking-ai-streaming.summary":
    "Gemini によるレコメンド、TMDB のライブ検索、デバイス間で同期するウォッチリストを備えたフルスタックのストリーミングプラットフォーム。",
  "case.aura-grid.summary":
    "決定論的エンジン上の対戦型 3D 戦略ゲーム。フレーム単位で正確なリプレイと、プレイヤーに適応する RL 対戦相手を備えています。",
  "case.resumatch-ai.summary":
    "LLM 埋め込みによる履歴書スクリーニング。候補者を意味的に採点し、スコアの背後にあるギャップを説明します。",
  "case.pokedex-mongodb.summary":
    "MongoDB の 2dsphere インデックスで29.6万件超の地理空間レコードを提供するフルスタックプラットフォーム。バトルゲーム付き。",

  "research.eyebrow": "研究",
  "research.title": "Do Privacy Policies Match with the Logs?",
  "research.subtitle": "Android アプリにおけるプライバシー開示の実証研究",
  "research.venue": "EASE 2026 · Research Track",
  "research.abstractHeading": "要旨",
  "research.abstract":
    "プライバシーポリシーは、アプリがユーザーデータについて交わす約束です。しかし実行時の挙動はそれを守っているのでしょうか？ 本研究は1,000本の Android アプリから得た8,600万件超の実ログを分析し、各アプリを自動探索して観測されたデータフローを公表ポリシーと突き合わせました。結果、67.6%のアプリがポリシーで開示していない機微データをログに記録しており、ポリシーと実態が完全に一致したのはわずか0.4%でした。",
  "research.findingsHeading": "主な発見",
  "research.finding1":
    "調査対象アプリの67.6%が、プライバシーポリシーで一切開示していない機微データをログに記録していました。",
  "research.finding2":
    "プライバシーポリシーと実際のログ記録が完全に一致したアプリは、わずか0.4%でした。",
  "research.finding3":
    "ADB・Monkey・logcat を基盤とする自動探索ツールにより、1,000本の Android アプリから8,600万件超のログを分析しました。",
  "research.methodHeading": "手法",
  "research.method":
    "Python 製ツールが各アプリを自動で操作しました。ADB と Monkey が UI を探索し、logcat が実行時出力を記録し、分析パイプラインが観測された機微データのフローを各アプリのポリシーの記述と照合しました。",
  "research.citationHeading": "この研究を引用する",
  "research.copyBibtex": "BibTeX をコピー",
  "research.copied": "コピーしました！",
  "research.viewOnConf": "EASE 2026 で見る",
  "research.vizCaption":
    "調査した1,000本のアプリのうち、未開示の機微データを漏らしている割合と、ポリシーと完全に一致している割合。",
  "research.vizTableCaption": "主な発見（データ）",

  "skills.eyebrow": "ツールキット",
  "skills.title": "私が選ぶスタック",
  "skills.description":
    "実際の成果物をリリースするために使ってきた言語・フレームワーク・プラットフォーム。スタック上の位置ごとに分類しています。",

  "expertise.eyebrow": "私の専門",
  "expertise.title": "本当に得意な6つのこと",
  "expertise.description":
    "フロントエンドのピクセルから研究手法まで、私が最も価値を発揮できる領域です。",

  "credentials.eyebrow": "修了証",
  "credentials.title": "修了証と継続的な学習",
  "credentials.description":
    "修了したコースとラーニングパスを、正式名称と種別とともに掲載しています。各項目は発行元の証明書にリンクしています。",
  "credentials.aboutDescription":
    "以下はいずれも修了したコースまたはラーニングパスであり、専門資格ではありません。その旨を明記しています。各項目は発行された証明書にリンクしています。",
  "credentials.viewAll": "修了証 {{total}} 件すべて",
  "credentials.viewCertificate": "証明書を見る",
  "credentials.type.course-completion": "コース修了",
  "credentials.type.learning-path": "ラーニングパス",
  "credentials.type.certificate": "修了証",
  "credentials.type.professional-certification": "専門資格",
  "credentials.note.examPrep":
    "試験対策コースです。Microsoft や Azure の認定資格ではありません。",

  "contact.eyebrow": "連絡先",
  "contact.title": "リリースする価値のあるものを一緒に作りましょう",
  "contact.description":
    "ソフトウェアエンジニア、フルスタック、バックエンドの職を歓迎しており、興味深い課題について話すのはいつでも大歓迎です。",
  "contact.openTo": "検討中の職種",
  "contact.openToText":
    "ソフトウェアエンジニア、フルスタック、バックエンドの職。加えて、検索・エージェント・応用 ML が売り文句ではなくプロダクトの一部となる AI エンジニアリングの仕事も歓迎します。",
  "contact.copyEmail": "メールをコピー",
  "contact.copied": "コピーしました！",
  "contact.link.email": "メール",
  "contact.link.github": "GitHub",
  "contact.link.linkedin": "LinkedIn",
  "contact.link.location": "所在地",

  "notfound.title": "このページは存在しません",
  "notfound.description": "このアドレスには何もありません。実績へ戻りましょう。",
  "notfound.home": "ホームへ戻る",

  "footer.tagline": "ソフトウェアエンジニア — フルスタック・バックエンド・応用 AI",
  "footer.builtWith": "React、Tailwind、Framer Motion で設計・構築。",
  "footer.source": "GitHub でソースを見る",

  "theme.label": "テーマ",
  "theme.light": "ライト",
  "theme.dark": "ダーク",
  "language.label": "言語",
};

export default ja;
