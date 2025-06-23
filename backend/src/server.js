import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import CORS middleware for handling cross-origin requests
import path from "path"; // Import path module for handling file paths

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";


dotenv.config(); // Load environment variables from .env file


// const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve(); // Get the current directory name


//middleware
if (process.env.NODE_ENV !== "production") { // Enable CORS only in development mode
    app.use(
        cors({
            origin:"http://localhost:5173", // Allow requests from this origin (frontend)
        })
    ); // Enable CORS for all routes (Cross-Origin Resource Sharing)
}

app.use(express.json()); //before routes to parse JSON bodies (so that req.body ({title, content}) is available in the routes)
app.use(rateLimiter); // Middleware to limit the rate of requests

// app.use((req, res, next) => {
//     console.log(`Request Method: ${req.method} & Request URL: ${req.url}`); // Log the request method and URL
//     next(); // Call the next middleware or route handler
// });

app.use("/api/notes", notesRoutes); // Middleware to parse JSON bodies
// app.use("/api/products", productRoutes);
// app.use("/api/whatever", whateverRoutes);

if (process.env.NODE_ENV === "production") { //deploy only under production
    app.use(express.static(path.join(__dirname, "../frontend/dist"))); // Serve static files from the "dist" directory in frontend
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html")); // Serve the index.html file for the root route
    });
}

//An ENDPOINT is a combination of a URL + HTTP method
// (like GET, POST, etc.) that allows clients to interact with the server.

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port:", PORT); //run the app
    });
});