import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5002,
  groqApiKey: process.env.GROQ_API_KEY,
  tavilyApiKey: process.env.TAVILY_API_KEY,
};
