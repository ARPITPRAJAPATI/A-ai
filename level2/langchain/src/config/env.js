import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5001,
  groqApiKey: process.env.GROQ_API_KEY,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL,
  tavilyApiKey: process.env.TAVILY_API_KEY,
};
