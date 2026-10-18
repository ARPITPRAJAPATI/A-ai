import { ChatGroq } from "@langchain/groq";
import { config } from "./env.js";

export const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: config.groqApiKey,
  temperature: 0.7,
});
