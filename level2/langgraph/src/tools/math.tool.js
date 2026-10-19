import { tool } from "@langchain/core/tools";
import z from "zod";

export const additionTool = tool(
  async ({ a, b }) => {
    return `addition of ${a} and ${b} is ${a + b}`;
  },
  {
    name: "addition_tool",
    description: "Performs addition of two numbers",
    schema: z.object({
      a: z.number().describe("First number"),
      b: z.number().describe("Second number"),
    }),
  }
);
