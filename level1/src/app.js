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

export default app;
