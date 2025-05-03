import express from "express";
import connectDB from "./DB.js"; // Import MongoDB connection
import userRoutes from "./routes/user.js"; // Import routes
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 7000;

// CORS Middleware
app.use(cors({ origin: "*" }));

// Parse incoming JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/user", userRoutes);

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, "dist")));

// Fallback for all other routes to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}!`));
