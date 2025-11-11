import "dotenv/config";
import express from "express";
import type { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import { connectMongo } from "./databases/connect-mongo.ts";
import apiRoutes from "./routes/index.ts";

const app: Application = express();
const port: string | number = process.env.PORT || 3001;

// -----------------------------
// Common middleware
// -----------------------------
app.use(cors()); // CORS for API consumers
app.use(express.json()); // JSON bodies for API
app.use(express.urlencoded({ extended: true })); // URL-encoded bodies for forms
// -----------------------------
// API routes under /api
app.use("/api", apiRoutes);

// -----------------------------
// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// -----------------------------
// Start server
// -----------------------------
async function startServer() {
  try {
    await connectMongo();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
