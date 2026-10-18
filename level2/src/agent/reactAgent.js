import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { llm } from "../config/llm.js";
import { tools } from "../tools/index.js";

export const agent = createReactAgent({
  llm,
  tools,
});
