import express from "express";
import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";
import { TavilySearch } from "@langchain/tavily";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import z from "zod";
import { MessagesAnnotation, StateGraph, MemorySaver } from "@langchain/langgraph";

dotenv.config();

const app = express();
const port = process.env.PORT || 5003;

app.use(express.json());

const checkpointer = new MemorySaver();

// 1. Tavily Search Tool
const tool1 = new TavilySearch({
  maxResults: 5,
  topic: "general",
});

// 2. Custom Addition Tool
const tool2 = tool(
  async ({ a, b }) => {
    return `addition of ${a} and ${b} is ${a + b}`;
  },
  {
    name: "addition_tool",
    description: "addition of two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

// Tools Array
const tools = [tool1, tool2];

// 3. Groq LLM with tools bound
const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.7,
}).bindTools(tools);

// 4. LangGraph Nodes & Conditional Logic
const callModel = async (state) => {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
};

const shouldContinue = (state) => {
  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage?.tool_calls && lastMessage.tool_calls.length > 0) {
    return "tool_node";
  }
  return "__end__";
};

const toolNode = new ToolNode(tools);

// 5. StateGraph definition
const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tool_node", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tool_node", "agent")
  .compile({ checkpointer });

// 6. Chat Endpoint
app.post("/chat", async (req, res) => {
  const { prompt, thread_id } = req.body;
  try {
    const result = await graph.invoke(
      {
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        configurable: { thread_id: thread_id || "user-123" },
      }
    );

    const lastMessage = result.messages[result.messages.length - 1];
    console.log("Response:", lastMessage.content);
    res.json({ response: lastMessage.content });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(port, () => {
  console.log(`Level 3 LangGraph server running on http://localhost:${port}`);
});



process.once("SIGUSR2", () => {
  server.close(() => {
    process.kill(process.pid, "SIGUSR2");
  });
});

process.on("SIGINT", () => {
  server.close(() => {
    process.exit(0);
  });
});
