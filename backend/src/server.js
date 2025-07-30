import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import CORS middleware for handling cross-origin requests
// import path from "path"; // Import path module for handling file paths

import cookieParser from "cookie-parser";

import notesRoutes from "./routes/notesRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";


dotenv.config(); // Load environment variables from .env file

// const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001;
// const __dirname = path.resolve(); // Get the current directory name

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost",
    "https://stockmounts.onrender.com" // public frontend URL
];

//middleware
app.use(
    cors({
        origin: allowedOrigins, // Allow requests from these origins
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
); // Enable CORS for all routes (Cross-Origin Resource Sharing)

app.set("trust proxy", 1);

//deploy under PRODUCTION (for monorepo, not for multi service deployment)
// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "../frontend/dist"))); // Serve static files from the "dist" directory in frontend
//     app.get("*", (req, res) => {
//         res.sendFile(path.join(__dirname, "../frontend/dist/index.html")); // Serve the index.html file for the root route
//     });
// }

app.use(cookieParser()); // Middleware to parse cookies
app.use(express.json({ limit: "1mb" })); //before routes to parse JSON bodies (so that req.body ({title, content}) is available in the routes)
app.use(rateLimiter); // Middleware to limit the rate of requests


app.use("/api/notes", notesRoutes); // Middleware to parse JSON bodies
app.use("/api/predict", predictionRoutes); // Middleware for prediction routes
app.use("/api/auth", authRoutes); // Middleware for authentication routes
// app.use("/api/whatever", whateverRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true });
});


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port:", PORT); //run the app
    });
});

//An ENDPOINT is a combination of a URL + HTTP method
// (like GET, POST, etc.) that allows clients to interact with the server.