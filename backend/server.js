 

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");

// Load environment variables before any other setup.
dotenv.config();

// Connect to MongoDB once the environment is ready.
connectDB();

const app = express();

// Allow the React app to talk to the backend.
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

// Parse JSON and form submissions.
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check route for quick server verification.
app.get("/", (req, res) => {
    res.send("Server Running");
});

// Authentication routes.
app.use("/api/users", userRoutes);

// Protected flashcard routes.
app.use("/api/flashcards", flashcardRoutes);

// Basic 404 handler for unknown routes.
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Centralized error handler for unexpected failures.
app.use((error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: error.message || "Server error"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

 