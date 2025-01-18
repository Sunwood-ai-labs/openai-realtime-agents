import { AgentConfig } from "@/app/types";
import { injectTransferTools } from "./utils";

// エージェントの定義
const haiku: AgentConfig = {
  name: "haiku",
  publicDescription: "俳句を作成するエージェント", // agent_transfer toolのコンテキスト
  instructions:
    "ユーザーにテーマを尋ね、そのテーマに関する俳句を日本語で作成してください。返答は必ず日本語で行ってください。",
  tools: [],
};

const greeter: AgentConfig = {
  name: "greeter",
  publicDescription: "ユーザーに挨拶をするエージェント",
  instructions:
    "ユーザーに日本語で挨拶し、俳句を聞きたいか尋ねてください。はいと答えた場合は'haiku'エージェントに転送してください。すべての返答は日本語で行ってください。",
  tools: [],
  downstreamAgents: [haiku],
};

// downstreamAgentsを指すtransfer toolを追加
const agents = injectTransferTools([greeter, haiku]);

export default agents;
