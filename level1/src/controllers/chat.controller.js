import { model } from "../config/llm.js";

export const handleChat = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Please provide a valid prompt in the request body." });
  }

  try {
    const response = await model.invoke([
      {
        role: "system",
        content: "you are a aru's assistant",
      },
      {
        role: "user",
        content: prompt,
      },
    ]);

    console.log("AI Reply:", response.content);
    return res.status(200).json({ response: response.content });
  } catch (error) {
    console.error("LangChain Error:", error.message);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
