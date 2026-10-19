import { TavilySearch } from "@langchain/tavily";

export const tavilyTool = new TavilySearch({
  maxResults: 5,
  topic: "general",
});
