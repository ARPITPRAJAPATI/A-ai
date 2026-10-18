import express from "express";
import dotenv from "dotenv";
dotenv.config();
// import { GoogleGenAI } from "@google/genai";
// const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
import { ChatGroq } from "@langchain/groq";
import OpenAI from "openai";
const app = express()

const port = process.env.PORT || 5000
app.use(express.json());
const ai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});


// const main = async () => {
//     const response = await ai.interactions.create({
//         model: "gemini-3.8-flash",
//         input: "hello",
//     });
//     console.log(response.output_text);
// }
// main();
// const stream = await ai.interactions.create({
//     model: "gemini-3.8-flash",
//     input: "Explain how AI works",
//     stream: true,
// });
// for await (const event of stream) {
//     console.log(event);
// }

// project

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

const model = new ChatGroq({
    model: "openai/gpt-oss-120b", // ya llama-3.3-70b-versatile
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.7,
});

app.post("/chat", async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await model.invoke([{
            role: "system",
            content: "you are a aru's assistant",
        },
        {
            role: "user",
            content: prompt,
        }]);
        console.log(response.content);
        res.json({ response: response.content });
    } catch (error) {
        console.error("LangChain Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log("server started at port no.", port);
})