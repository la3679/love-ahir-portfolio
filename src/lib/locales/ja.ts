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
    "金融サービスとエンタープライズ基盤で、本番のバックエンド、フルスタックの画面、データ基盤、応用 AI を4年以上構築してきたソフトウェアエンジニアです。",
  "hero.seeWork": "実績を見る",
  "hero.resume": "履歴書",
  "hero.transformScene": "ボクセルシーンを変形",
  "hero.formation.identity": "アイデンティティ",
  "hero.formation.cloud": "クラウド",
  "hero.formation.helix": "ヘリックス",
  "hero.monogramAlt": "Love Ahir モノグラム",

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
  "home.proof.uptimeLabel": "本番稼働する8つの FastAPI サービスの稼働率",
  "home.proof.transactionsLabel": "イベント駆動サービスが支える1日あたりの取引件数",
  "home.proof.documentsLabel": "本番の検索パイプラインが扱う文書数",

  "home.work.eyebrow": "選りすぐりの実績",
  "home.work.title": "作り、測り、リリースする",
  "home.work.description":
    "背景・意思決定・成果まで、物語のすべてを記したプロジェクト。残りはインデックスにあります。",
  "home.work.viewCase": "ケーススタディを読む",
  "home.work.viewAll": "全16プロジェクト",
  "home.work.built": "構築",
  "home.work.stack": "技術スタック",
  "home.work.outcome": "成果",
  "home.work.repo": "リポジトリ",

  "home.experience.eyebrow": "経歴",
  "home.experience.title": "4年以上の本番エンジニアリング",
  "home.experience.description":
    "金融サービスとエンタープライズ基盤における、バックエンドサービス、フルスタックの画面、データ基盤、応用 AI。ここでは3つの職務を掲載しています。全経歴は About ページにあります。",
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
  "artifact.stage.interface": "検索、目撃マップ、バトル画面。",
  "artifact.stage.services": "クエリと保存メディアを提供する REST エンドポイント。",
  "artifact.stage.data": "地理空間の目撃レコードに対する 2dsphere インデックス。",
  "artifact.stage.systems": "GridFS によるメディア保存とターン制バトルのロジック。",
  "artifact.outcomeLabel": "検証済みの成果",
  "artifact.disclaimer":
    "私が構築したプロジェクトの抽象的なシステム図です。製品のスクリーンショットでも、データのライブ表示でもありません。",
  "artifact.cta": "ケーススタディを読む",
  "artifact.repo": "リポジトリ",

  "capabilities.eyebrow": "できること",
  "capabilities.title": "実際に取り組んでいる領域",
  "capabilities.description":
    "5 つの領域。いずれも公開済みのプロジェクトか、期間の明確な職務に裏づけられています（自己評価ではありません）。",
  "capabilities.fullstack.title": "フルスタックのプロダクト開発",
  "capabilities.fullstack.body":
    "エンドツーエンドのプロダクト。自分で設計・運用するサービスの上に、型付きの React インターフェースを載せます。",
  "capabilities.backend.title": "バックエンドと API",
  "capabilities.backend.body":
    "イベント駆動の Python / Java サービス、リレーショナルなデータモデル、そしてそれらを支えるデリバリーパイプライン。",
  "capabilities.ai.title": "応用 AI と LLM 連携",
  "capabilities.ai.body":
    "本番環境での検索・エージェントのワークフロー、埋め込みによる意味的マッチング、価値のある場面での従来型 ML。",
  "capabilities.data.title": "データ集約型アプリケーション",
  "capabilities.data.body":
    "地理空間インデックス、グラフデータ、数百万件規模でも正しく動き続けるパイプライン。",
  "capabilities.quality.title": "テスト・信頼性・アーキテクチャ",
  "capabilities.quality.body":
    "自動化された品質ゲート、UI テスト自動化、変更に耐えるシステム境界。",
  "capabilities.footnote":
    "上記の技術はいずれも、実際にそれを使ったプロジェクトまたは職務に由来します。",

  "about.eyebrow": "概要",
  "about.title": "リリースするエンジニア — 必要なときには研究レベルの厳密さで",
  "about.description":
    "私はソフトウェアの華やかさのない中核部分に関心があります。洗練されたインターフェースが、思い通りに振る舞わないデータと出会う場所です。面白い問題はそこにこそ存在します。",
  "about.p1":
    "私は金融サービスとエンタープライズ基盤で4年以上の本番経験を持つソフトウェアエンジニアです。仕事の大半はバックエンドにあります。イベント駆動の Python・Java サービス、リレーショナルなデータモデル、キャッシュ、認可、そしてそのすべてをリリース可能に保つデリバリーパイプラインです。",
  "about.p2":
    "もう半分は、人が実際に触れる部分です。リアルタイムデータの上に構築した React と TypeScript の画面、そして検索・エージェント・従来型 ML が装飾ではなくプロダクトの中で役割を果たす応用 AI 機能。スタックのどちら側でも測り方は同じです。レイテンシ、信頼性、そして数字が実際に動いたかどうか。",
  "about.p3":
    "厳密さは研究から来ています。RIT では 1,000 本の Android アプリを自動操作する Python ツールを作り、8,600万件以上のログを各アプリの公開プライバシーポリシーと突き合わせて分析しました。この成果は EASE 2026 Research Track に掲載されています。大規模な自動化、丁寧な検証、そして結果を正直に書くこと。これらはそのままエンジニアリングに持ち帰った習慣です。",
  "about.education": "学歴",
  "about.gpa": "GPA",

  "experience.eyebrow": "経歴",
  "experience.title": "バックエンド・フルスタック・応用 AI にまたがる4年以上",
  "experience.description":
    "金融サービスとエンタープライズ基盤での本番システム、そして RIT での大学院研究と教育。期間と勤務地はそのまま記載しています。",
  "experience.current": "現職",
  "experience.group.industry": "産業でのエンジニアリング",
  "experience.group.research-teaching": "研究と教育",

  "exp.morgan-stanley.role": "ソフトウェアエンジニア",
  "exp.morgan-stanley.focus": "エージェント型 AI とフルスタックシステム",
  "exp.morgan-stanley.summary":
    "債券業務向けに、イベント駆動のバックエンドサービス、リアルタイム取引画面、文書検索ワークフロー、デリバリー基盤を構築しています。",
  "exp.morgan-stanley.a1":
    "AWS ECS/Fargate 上に Redis キャッシュ、OAuth2/JWT、非同期タスクキューを備えたイベント駆動の FastAPI サービスを8つ設計し、8サービス全体で99.97%の稼働率を達成しました。",
  "exp.morgan-stanley.a2":
    "D3.js と WebSocket フィードを用いた React 18・TypeScript のダッシュボードをリリースし、200名超の債券ユーザーのトレーダー意思決定レイテンシを45%削減しました。",
  "exp.morgan-stanley.a3":
    "ツール呼び出し、制御されたエージェントメモリ、AWS Bedrock を用いたマルチエージェント LangGraph ワークフローを設計して取引例外処理を自動化し、手作業を65%削減、年間の手作業処理コストを推定240万ドル削減しました。",
  "exp.morgan-stanley.a4":
    "LangChain、FAISS、OpenAI Embeddings、プロンプトエンジニアリングによる検索拡張生成パイプラインを1,000万件超の文書に対して実装し、アナリストの検索時間を8分から90秒未満に短縮しました。",
  "exp.morgan-stanley.a5":
    "エンティティ抽出と取引メモの異常検知のために spaCy とともに BERT をファインチューニングし、ルールベースのベースラインに対して適合率を38%改善しました。",
  "exp.morgan-stanley.a6":
    "GitHub Actions と AWS CodePipeline でデリバリーパイプラインを構築し、Datadog の LLM トレース、SonarQube、pytest の品質ゲートで支えることで、デプロイのサイクルタイムを50%短縮しました。",

  "exp.sage-software-engineer-2.role": "ソフトウェアエンジニア 2",
  "exp.sage-software-engineer-2.summary":
    "大量トラフィックのエンタープライズ基盤について、バックエンド設計、フロントエンドの土台、データベース性能、機械学習の統合、オブザーバビリティを担当しました。",
  "exp.sage-software-engineer-2.a1":
    "1日50万件超の取引を扱う基盤向けに、Kafka のイベントストリーミングを備えた Java Spring Boot の REST マイクロサービスを設計し、コネクションプーリングにより API 応答時間を40%短縮しました。",
  "exp.sage-software-engineer-2.a2":
    "GCP CloudSQL 上で Flyway マイグレーションを用いて PostgreSQL のスキーマと複雑な結合を最適化し、レポート生成を14秒から2.1秒へ短縮しました（85%の改善）。",
  "exp.sage-software-engineer-2.a3":
    "Material UI と Jest を用いた再利用可能な React 17・Redux Toolkit のコンポーネントライブラリを構築し、4スプリントで10機能をリリース、QA のバグサイクルを45%短縮しました。",
  "exp.sage-software-engineer-2.a4":
    "GCP Cloud Run 上で Python の REST ラッパー越しに scikit-learn の異常検知サービスをデプロイし、1日100万件超のイベントを処理して不正検知の誤検出を30%削減しました。",
  "exp.sage-software-engineer-2.a5":
    "5名の Agile スクワッドのテクニカルリードを務め、3名のエンジニアを指導し、120件超のプルリクエストをレビューし、Grafana と Prometheus のオブザーバビリティを拡張して、インシデントの MTTR を32%短縮しました。",

  "exp.axisray.role": "ソフトウェアエンジニア インターン",
  "exp.axisray.summary":
    "Java マイクロサービスを堅牢化し、信頼性を高めデリバリーを加速する ML ベースの機能をリリースしました。",
  "exp.axisray.a1":
    "Spring Boot マイクロサービスをリファクタリングし、信頼性を高めて機能提供までの時間を20%短縮しました。",
  "exp.axisray.a2":
    "Python と Java で ML モデルを構築・統合し、レコメンド精度を30%向上させました。",
  "exp.axisray.a3":
    "レガシーな JSP アプリケーションを Spring Boot へ刷新し、より豊かなデータ可視化を実現しました。",

  "exp.moon-technolabs.role": "データサイエンス・AI/ML エンジニアリング インターン",
  "exp.moon-technolabs.summary":
    "SaaS のサプライチェーン強靭化プロジェクトを主導し、HRMS と CRM を横断するデータパイプラインと AI による最適化を構築しました。",
  "exp.moon-technolabs.a1":
    "サプライチェーン強靭化プロジェクトを推進し、業務効率を30%向上させました。",
  "exp.moon-technolabs.a2":
    "適応的な業務運用を支えるスケーラブルなデータパイプラインと AI ソリューションを設計しました。",
  "exp.moon-technolabs.a3":
    "リソース配分向けに ML モデルをチューニングし、運用コストを15%削減しました。",

  "exp.sage-associate-developer.role": "アソシエイトデベロッパー",
  "exp.sage-associate-developer.summary":
    "顧客オンボーディング API を構築し、社内ポータルの性能を改善し、MySQL から PostgreSQL への移行を自動化しました。",
  "exp.sage-associate-developer.a1":
    "1日1万件超のレコードを処理する Java Spring Boot の API を構築し、40件超のバグを修正。ELK Stack をログ調査とトラブルシューティングに用い、エンドポイントの信頼性を22%改善しました。",
  "exp.sage-associate-developer.a2":
    "3モジュール構成の社内ポータルに React の関数コンポーネントと React Router を導入し、遅延読み込みとコード分割でページ読み込み時間を30%短縮、Lighthouse の監査で検証しました。",
  "exp.sage-associate-developer.a3":
    "Python スクリプトで MySQL から PostgreSQL への移行を自動化し、50万件超のレコードのスキーマ適合性を検証、インフラチームに採用されたランブックを作成しました。",

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
  "work.description":
    "プロダクト・研究・データにわたる16のプロジェクト。うち6件は完全なケーススタディとしてまとめています。",
  "work.featuredHeading": "ケーススタディ",
  "work.archiveHeading": "その他のプロジェクト",
  "work.caseStudy": "ケーススタディ",
  "work.external": "外部リンク",
  "category.Web App": "Web アプリ",
  "category.Mobile App": "モバイルアプリ",
  "category.Machine Learning": "機械学習",
  "category.Data Analysis": "データ分析",
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
