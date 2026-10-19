import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { llm } from "../config/llm.js";
import { tools } from "../tools/index.js";

// Bind tools to the LLM
const boundModel = llm.bindTools(tools);

// Node 1: Call Model
const callModel = async (state) => {
  const response = await boundModel.invoke(state.messages);
  return { messages: [response] };
};

// Conditional Edge: Check if model requested any tool call
const shouldContinue = (state) => {
  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage?.tool_calls && lastMessage.tool_calls.length > 0) {
    return "tool_node";
  }
  return "__end__";
};

// Node 2: Tool Execution Node
const toolNode = new ToolNode(tools);

// Define and compile LangGraph
export const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tool_node", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tool_node", "agent")
  .compile();
