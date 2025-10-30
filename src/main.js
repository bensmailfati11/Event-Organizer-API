import "dotenv/config";
import express from "express";
import cors from "cors";
import { engine } from "express-handlebars";
import { connectMongo } from "#@/databases/connect-mongo.js";
import routes from "#@/routes/index.js";

const app = express();
const port = process.env.PORT || 3001;

// Set up Handlebars
app.engine("handlebars", engine({ defaultLayout: false }));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", routes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
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
