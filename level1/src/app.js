import express from "express";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

// Middlewares
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Mount Routes
app.use("/", chatRoutes);

/*
================================================================================
                    LEARNING REFERENCE & PAST EXPERIMENTS
================================================================================

// --- 1. GEMINI INTERACTIONS API (BASIC CALL) ---
// const main = async () => {
//     const response = await ai.interactions.create({
//         model: "gemini-3.8-flash",
//         input: "hello",
//     });
//     console.log(response.output_text);
// }
// main();

// --- 2. GEMINI STREAMING EXPERIMENT ---
// const stream = await ai.interactions.create({
//     model: "gemini-3.8-flash",
//     input: "Explain how AI works",
//     stream: true,
// });
// for await (const event of stream) {
//     console.log(event);
// }

// --- 3. GEMINI EXPRESS ROUTE (/chat) ---
// app.post("/chat", async (req, res) => {
//     const { prompt } = req.body;
//     try {
//         const result = await ai.interactions.create({
//             model: "gemini-3.8-flash",
//             input: prompt,
//         });
//         console.log(result.output_text);
//         res.json({ response: result.output_text });
//     } catch (error) {
//         console.error("Gemini API error:", error?.error?.message || error.message);
//         res.status(error.status || 500).json({ error: error?.error?.message || "Something went wrong" });
//     }
// })

// --- 4. GROQ OPENAI-COMPATIBLE ROUTE (/chat) ---
// app.post("/chat", async (req, res) => {
//     const { prompt } = req.body;
//     try {
//         const result = await ai.chat.completions.create({
//             model: "openai/gpt-oss-120b",
//             messages: [{ role: "user", content: prompt }],
//         });
//         const text = result.choices[0].message.content;
//         console.log(text);
//         res.json({ response: text });
//     } catch (error) {
//         console.error("Groq API error:", error?.message);
//         res.status(error.status || 500).json({ error: error?.message || "Something went wrong" });
//     }
// })
================================================================================
*/

export default app;
