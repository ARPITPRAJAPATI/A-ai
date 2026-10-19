import { graph } from "../graph/stateGraph.js";

export const handleChat = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Please provide a valid prompt in the request body." });
  }

  try {
    const result = await graph.invoke({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const lastMessage = result.messages[result.messages.length - 1];
    console.log("LangGraph Reply:", lastMessage.content);

    return res.status(200).json({ response: lastMessage.content });
  } catch (error) {
    console.error("Chat Controller Error:", error.message);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
