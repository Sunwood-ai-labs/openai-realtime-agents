<div align="center">

![Realtime API エージェントデモのスクリーンショット](/public/screenshot.png)

# 🤖 Realtime API エージェントデモ

[![GitHub stars](https://img.shields.io/github/stars/Sunwood-ai-labs/openai-realtime-agents?style=flat-square)](https://github.com/Sunwood-ai-labs/openai-realtime-agents/stargazers)
[![License](https://img.shields.io/github/license/Sunwood-ai-labs/openai-realtime-agents?style=flat-square)](https://github.com/Sunwood-ai-labs/openai-realtime-agents/blob/main/LICENSE)

[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com/)

</div>

OpenAI Realtime APIを活用した高度なエージェントパターンのデモンストレーションです。主に以下の機能を実装しています：

- 定義されたエージェントグラフに基づく連続的なエージェント遷移 ([OpenAI Swarm](https://github.com/openai/swarm)にインスパイアされています)
- 重要な判断が必要な場合のo1-miniなどのより高度なモデルへのバックグラウンドエスカレーション
- ステートマシンに基づくプロンプト制御（例：ユーザー認証時の名前や電話番号を1文字ずつ確認する機能）

このリポジトリを使用すれば、20分以内にマルチエージェントのリアルタイム音声アプリを構築できます！

## 🚀 セットアップ

- Next.js + TypeScriptで構築されています
- 依存関係のインストール: `npm i`
- 環境変数に`OPENAI_API_KEY`を設定
- サーバー起動: `npm run dev`
- ブラウザで[http://localhost:3000](http://localhost:3000)を開くと、自動的に`simpleExample`エージェントセットに接続されます

## 🤖 エージェントの設定
`src/app/agentConfigs/simpleExample.ts`での設定例：
```javascript
import { AgentConfig } from "@/app/types";
import { injectTransferTools } from "./utils";

// エージェントの定義
const haiku: AgentConfig = {
  name: "haiku",
  publicDescription: "俳句を作成するエージェント", // agent_transfer toolのコンテキスト
  instructions:
    "ユーザーにテーマを尋ね、そのテーマに関する俳句を日本語で作成してください。",
  tools: [],
};

const greeter: AgentConfig = {
  name: "greeter",
  publicDescription: "ユーザーに挨拶をするエージェント",
  instructions:
    "ユーザーに日本語で挨拶し、俳句を聞きたいか尋ねてください。はいと答えた場合は'haiku'エージェントに転送してください。",
  tools: [],
  downstreamAgents: [haiku],
};

// downstreamAgentsを指すtransfer toolを追加
const agents = injectTransferTools([greeter, haiku]);

export default agents;
```

このコードは、スクリーンショットで示されているインタラクションを実現するエージェントセットを定義しています。

### 📚 次のステップ
- `src/app/agentConfigs`内の設定を確認してください。上記の例は基本的な概念を示すミニマルなデモです。
- [frontDeskAuthentication](src/app/agentConfigs/frontDeskAuthentication): ユーザーを段階的な認証フローでガイドし、各値を1文字ずつ確認し、ツール呼び出しで認証を行い、別のエージェントに転送します。2番目のエージェントは意図的に「退屈」な性格を持たせており、パーソナリティとトーンの制御方法を示しています。
- [customerServiceRetail](src/app/agentConfigs/customerServiceRetail): 認証フローに加えて、定型スクリプトからの長文の提案を読み上げ、複雑な返品フローを案内します。注文の検索、ポリシーの確認、ユーザーコンテキストの収集、`o1-mini`による返品可否の判断などを行います。このフローをテストするには、スノーボードを返品したいと伝えて必要な手順を進めてください！

### 🛠️ 独自のエージェントの定義
- これらをコピーして、独自のマルチエージェント音声アプリを作成できます！新しいエージェントセットの設定を作成したら、`src/app/agentConfigs/index.ts`に追加することで、UI上の「シナリオ」ドロップダウンメニューから選択できるようになります。
- ツールとツールロジック（バックグラウンドLLM呼び出しを含む）の定義方法は[src/app/agentConfigs/customerServiceRetail/returns.ts](src/app/agentConfigs/customerServiceRetail/returns.ts)を参照してください。
- 詳細なパーソナリティとトーンの定義、およびユーザー情報を段階的に収集するためのプロンプトステートマシンの使用方法は[src/app/agentConfigs/frontDeskAuthentication/authentication.ts](src/app/agentConfigs/frontDeskAuthentication/authentication.ts)を参照してください。
- エージェントを1つのエージェントセットにまとめる方法は[src/app/agentConfigs/frontDeskAuthentication/index.ts](src/app/agentConfigs/frontDeskAuthentication/index.ts)を参照してください。
- これらの規則に従ったプロンプトの作成支援が必要な場合は、[メタプロンプト](src/app/agentConfigs/voiceAgentMetaprompt.txt)を参照するか、[Voice Agent Metaprompter GPT](https://chatgpt.com/g/g-678865c9fb5c81918fa28699735dd08e-voice-agent-metaprompt-gpt)を使用してください。

## 💻 UI機能
- シナリオドロップダウンでエージェントシナリオを選択し、エージェントドロップダウンで特定のエージェントに自動的に切り替えることができます。
- 左側に会話履歴が表示され、ツール呼び出し、その応答、エージェントの変更が含まれます。メッセージ以外の要素はクリックで展開できます。
- 右側にイベントログが表示され、クライアントとサーバーの両方のイベントを確認できます。クリックで詳細なペイロードを表示します。
- 下部では、接続/切断、音声アクティビティ検出とPTTの切り替え、音声再生のオン/オフ、ログの表示/非表示を制御できます。

## 👥 コア開発者
- Noah MacCallum - [Sunwood-ai-labs](https://x.com/Sunwood-ai-labs)
- Ilan Bigio - [ibigio](https://github.com/ibigio)
